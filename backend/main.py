

from base64 import b64encode
import base64
import io
import pickle
from fastapi import Depends, FastAPI, HTTPException,UploadFile,File, Form
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
from sqlmodel import Field, Session, SQLModel, create_engine, select
from typing import List, Union, Optional, Annotated
from contextlib import asynccontextmanager
from pydantic import BaseModel
from PIL import Image

import os
from dotenv import load_dotenv


from insightface_detection_recognition_model_loading import detection_recognition_model
from cosine_similarity import cosine_similarity



load_dotenv()
# Get the DATABASE_URL variable from the environment
DATABASE_URL = os.getenv("DATABASE_URL")    


class FaceView(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True,index=True)
    name : str = Field(default=None)
    image: bytes = Field(default=None)
    embedding: bytes = Field(default=None)    

connection_string = str(DATABASE_URL).replace(
    "postgresql", "postgresql+psycopg"
)

engine = create_engine(
    connection_string,
    pool_size=10,
    max_overflow=20)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)



@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Creating tables..")
    # create_db_and_tables()
    print("Models loading..")
    global detection_model, recognition_model
    detection_model, recognition_model, = detection_recognition_model()    
    yield
    
app = FastAPI(lifespan=lifespan, title="Hello World API with DB", 
    version="0.0.1",
    servers=[
        {
            "url": "http://127.0.0.1:8000", # ADD NGROK URL Here Before Creating GPT Action
            "description": "Development Server"
        }
        ])


app.add_middleware(
    CORSMiddleware,
    allow_origins =     ['*'],
    allow_credentials = ['*'],
    allow_methods =     ['*'],
    allow_headers =     ['*']
)

@app.get("/")
def read_root():
    return "welcome to Face view"

def get_session():
    with Session(engine) as session:
        if not session:
            raise HTTPException(status_code=404, detail="session not found")
        yield session   
          

def get_detection_model():
    return detection_model

def get_recognition_model():
    return recognition_model
  

class face_obj:
   def __init__(self, bbox, kps, embeddings):
      self.bbox       = bbox
      self.kps        = kps
      self.embeddings  = embeddings


def get_embedding(image_for_embeddings_array,detection_model,recognition_model):
    bboxes, kpss= detection_model.detect(image_for_embeddings_array,input_size =(640,640))
    no_of_faces = len(bboxes)  
    embedding_blob=0
    if no_of_faces>0:
        face_check= face_obj(bboxes[0][0:3], kpss[0],[0])    
        embedding512 =recognition_model.get(image_for_embeddings_array,face=face_check) 
        # print("embedding512",embedding512)
        embedding_blob = pickle.dumps(embedding512)  #BLOB (Binary Large Object)   
    return embedding_blob, no_of_faces

class Data_upload(BaseModel):
    file:UploadFile
    # name:str

@app.post("/upload")
async def Imageupload(file: Annotated[UploadFile, File(...)],
                      name: Annotated[str, Form(...)],
                      session: Annotated[Session, Depends(get_session)],
                      detection_model = Depends(get_detection_model),
                      recognition_model = Depends(get_recognition_model)):
    print("loaded succesfully",name)   
    contents = await file.read()
    np_array = np.frombuffer(contents, np.uint8)
    
    if np_array is None:
        raise HTTPException(status_code=400, detail="Invalid image")    
    image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
    resized_img = cv2.resize(image, (200,200))
    _, buffer = cv2.imencode('.jpg', resized_img)
    
    # contents = await fileo.read()                          
    image_for_embeddings = Image.open(io.BytesIO(contents))  
    image_for_embeddings_array = np.array(image_for_embeddings)
    embeddings,no_of_faces = get_embedding(image_for_embeddings_array,detection_model,recognition_model)
    print("no_of_faces",no_of_faces)
    if no_of_faces != 1:
        raise HTTPException(status_code=400, detail=f"{no_of_faces} number of faces detected")        
    else :
        new_image = FaceView(image=buffer.tobytes(),
                                name=name,
                                embedding=embeddings)
        session.add(new_image)
        session.commit()
        session.refresh(new_image)
        
        return {"detail": name}      


class Data_Base_Entry(BaseModel):
    id:int
    file_name:str
    image:str
    
@app.get("/database",response_model=List[Data_Base_Entry])
async def database(session: Annotated[Session, Depends(get_session)]):    
    faceview = session.exec(select(FaceView)).all()
    # print("faceview", (faceview))
    data  = []
    for face in faceview: 
        Entry = Data_Base_Entry(
            id = face.id,
            file_name = face.name,
            image = b64encode(face.image).decode('utf-8')
            )
        data.append(Entry)
    print("complete")
    return data



class Delete_id(BaseModel):
    id:int
        

@app.post("/delete")
async def delete(del_id:Delete_id, session: Annotated[Session, Depends(get_session)]):    
    print("ID is", del_id.id)
    statement = select(FaceView).where(FaceView.id == del_id.id)
    results = session.exec(statement)
    hero = results.one()
    if not hero:
            raise HTTPException(status_code=404, detail="data not found")
    # print("Hero: ", hero)
    session.delete(hero)
    session.commit()
    
    return {"message": f"id {del_id.id} deleted succesful+ly"}

# Define Pydantic models
# class MatchEntry(BaseModel):
#     index: int
#     name: str
#     score: float

# class ResponseModel(BaseModel):
#     image_with_faces: List[str]  
#     no_of_faces: int
#     scores: List[float]
#     match_score: List[MatchEntry]
    
class MatchResponseModel(BaseModel):
    image_only_face: str
    detection_score: float
    match_score: float
    database_index:int
    database_image:str
    matched_database_name:str
    

@app.post("/match",response_model=List[MatchResponseModel])
# async def Imageupload(file:List[UploadFile],
#                       match_threshold: Annotated[str, Form(...)],
async def Imageupload(file: Annotated[UploadFile, File(...)],
                      match_threshold: Annotated[str, Form(...)],
                      session: Annotated[Session, Depends(get_session)],
                      detection_model = Depends(get_detection_model),
                      recognition_model = Depends(get_recognition_model)):
    
    print("loaded succesfully",match_threshold)   
    # file_names = []
    
    # for fileo in file:
        # file_names.append(fileo.filename)
    contents = await file.read()        
    # np_array = np.frombuffer(contents, np.uint8)        
    # image convert from nextjs format that is base64 to numpy                  
    img = Image.open(io.BytesIO(contents))  
    img_array = np.array(img)
            
    image_with_faces,embeddings , scores   = image_processing(img_array,
                                                            detection_model,
                                                            recognition_model)
    print("embeddings len",len(embeddings))
    match_score = similartity_check(embeddings,session,match_threshold)       
            
    data=[]
    for i in range(len(match_score)):
        matched_database_image = select(FaceView.image).where(FaceView.id == match_score[i]["data_id"])
        matched_database_image = session.exec(matched_database_image).first()
        # print("matched_database_image",matched_database_image)
        
        matched_database_name = select(FaceView.name).where(FaceView.id == match_score[i]["data_id"])
        matched_database_name = session.exec(matched_database_name).first()
        
        
        entry = MatchResponseModel(
            database_image=b64encode(matched_database_image).decode('utf-8'),                          
            database_index =  match_score[i]["data_id"],
            match_score = round(match_score[i]["score"]*100,2),
            detection_score = round(scores[i],2),
            image_only_face= b64encode(image_with_faces[match_score[i]["face_id"]]).decode('utf-8'),
            matched_database_name = matched_database_name,
            # matched_database_age = Age[match_score[i]["face_id"]],
            # matched_database_gender = Gender[i],
            
        )
        data.append(entry)           
    # print("MatchResponseModel",data)           
       
    return data

def similartity_check(embeddings,session,match_threshold):
    match_score =[]
    faceview_ids = session.exec(select(FaceView.id)).all()   
    
    for j in faceview_ids:       
        embeddings_statement = select(FaceView.embedding).where(FaceView.id == j)
        embeddings_results = session.exec(embeddings_statement)
        stored_embeddings = embeddings_results.first()
        stored_embeddings = pickle.loads(stored_embeddings)
        

        m_pre_score = 0
        for i in range(len(embeddings)): 
            check = [item for item in match_score if item["face_id"] ==i]
            print("checkcheck",check)
            if len(check) == 0 :
                m_score = cosine_similarity(embeddings[i],stored_embeddings)
                print("similarity of %d face has score with %d image is %f"  %(i,j,m_score))
                if m_score > m_pre_score and m_score >= int(match_threshold)/100:
                    match_score.append({"face_id":i,
                                        "data_id":j,
                                        "score":m_score})
                    break
                
    print("match_score", match_score)
    return match_score

def image_processing(image_check,detection_model,recognition_model):
    bboxes, kpss= detection_model.detect(image_check,input_size =(640,640))  
    detection_score = []
    embeddings= []
    image_with_face =[]   
    # # Iterate over face bounding boxes
    for idx, bbox in enumerate(bboxes):
        detection_score.append(bbox[4]*100)
        # print("bbox[0:3]",bbox[0:4])
        face_check= face_obj(bbox[0:4], kpss[idx],[0])
        embeddings.append(recognition_model.get(image_check,face=face_check))
        box  = [int(b) for b in bbox]        
        # Draw the bounding box
        cv2.rectangle(image_check, (box[0], box[1]), (box[2],box[3]), (0, 0, 255), 3)
        # Draw the label
        label = str(idx + 1)  # Label index starts at 1
        cv2.putText(image_check, label, (box[0], box[1]-10 if box[1]-10 > 10 else box[1]+720+20), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)
        # output_path = f"./utils/{label}.jpg"
        # # Save the output image
        # cv2.imwrite(output_path, img_array)
        # for i, (x1, y1, x2, y2) in enumerate(box):
        # Crop the face using the bounding box coordinates
        face = image_check[box[1]:box[3], box[0]:box[2]]

        face = cv2.cvtColor(face, cv2.COLOR_BGR2RGB)         
        _, buffer = cv2.imencode('.jpg', face)        
        image_with_face.append(buffer)
     
        
        
    return image_with_face,    embeddings  ,     detection_score


class camInputModel(BaseModel):
    image: str
    slide2 :str

class camResultModel(BaseModel):
    image : str
    database_id : int

    
@app.post("/cam", response_model= List[camResultModel])   
async def get_snap(image_data: camInputModel,
                   session: Annotated[Session, Depends(get_session)],
                   detection_model = Depends(get_detection_model),
                   recognition_model = Depends(get_recognition_model)):
        
    match_threshold = image_data.slide2
    image_data = image_data.image.split(",")[1]  # Remove the base64 header
     # Step 2: Decode the base64 string into binary data
    image_binary = base64.b64decode(image_data)
    img = Image.open(io.BytesIO(image_binary))  
    img_array = np.array(img)
    
    image_with_faces,embeddings , scores   = image_processing(img_array,
                                                            detection_model,
                                                            recognition_model)
    
    match_score = similartity_check(embeddings,session,match_threshold)  
    camoutput =[]
    for item in match_score:
        print("face_id", item["face_id"])
        print("data_id", item["data_id"])
        camdata = camResultModel(
                image =   b64encode(image_with_faces[item["face_id"]]).decode('utf-8'),
                database_id = item["data_id"],              
    )    
        camoutput.append(camdata)
    return camoutput
        