'use client'
import React, { useState } from 'react'
import FaceDescriptionCard2 from '../component/FaceDescriptionCard2'
import { Toaster,toast } from 'react-hot-toast'
import FingerPrintIcon from '@heroicons/react/16/solid/FingerPrintIcon'
import { Slider } from "@/components/ui/slider"



type MatchEntry={
    "index": number
    "name": string
    "score": number
}

// type ResponseModel={
//     "image_with_faces": string[] 
//     "no_of_faces": number
//     "scores": number[]
//     "match_score": MatchEntry[]
// }

type Matchdata={
  image_only_face: string
  detection_score: number
  match_score: number
  database_index:number
  database_image:string
  matched_database_name:string,
  matched_database_age:number,
  matched_database_gender:string,
}

const Match = () => {
  const [slide2, setslide2]=useState([50])

  const [loading,  setloading]= useState(false)
  const [selectedFile, setSelectedFile] = useState([]);
  const [match_data, setMatch_data]= useState([{"image_only_face":"",
                                                "detection_score":0,
                                                "match_score" : 0,
                                                "database_index":0,
                                                "database_image":"",  
                                                "matched_database_name":"",   
                                                "matched_database_age":0,
                                                "matched_database_gender":""
                                              }])


  const handleFileChange = (event:any) => {
    setSelectedFile(Array.from(event.target.files));
    setloading(false)
 
  };


  const handleUpload = async () => {

    const endpoint = "http://127.0.0.1:8000/match/"
    const formData = new FormData();

    formData.append('file', selectedFile[0])
    formData.append('match_threshold', slide2[0].toString())
  const matchingToast = toast.loading('Matcing...');
  // console.log("match_threshold", slide2[0])
    try{
      const responsefile  = await fetch(endpoint,{
          method: "POST",
          body:formData
      })
      const data:Matchdata[] = await responsefile.json();
      // console.log(data)
      setMatch_data(data)
      toast.success('Successfuly matched',{
        id:matchingToast})
      setloading(true)
  }
  catch (error) { 
    // console.error("Error uploading files:", error);
    toast.error('failed to matched with database',{
      id:matchingToast})
}
  }
  return (
      
      <div className='flex flex-col h-screen overflow-hidden'> 
        <Toaster />
        <div className='flex'>
        <div className="upload-container p-3 drop-shadow-lg shadow-slate-500">
            <input 
            type="file" 
            onChange={handleFileChange} 
            accept=".jpeg,.jpg"
            />
            <button 
            className='w-48 border-lime-600 border m-2 p-2' 
            onClick={handleUpload}>
                Upload</button>
                <p className='text-red-700 font-bold'>.jpeg,.jpg  only</p> 
        </div> 
        <div className='p-5'>
        <label className="block mb-2 text-m font-bold text-gray-900 dark:text-white">Match Threhold</label>
        <Slider 
            className='w-80'
            defaultValue={slide2} 
            max={100}
            min ={40}
            step={1}
            onValueChange={(value)=> {
              setslide2(value);
            }}
             />
            <span >{slide2}</span> 
            {slide2[0]< 45 ?
            <><br />
            <span className='text-red-700  text-sm font-bold'>Too low value may provide wrong results</span></>:<></>}
        </div>
        </div>

        {/* <div className="flex-1 overflow-y-auto   w-full flex-wrap content-center justify-center p-1 bg-gray-200">
        <div className="grid  gap-3">
          {match_data.map((m_data)=>  {return(            
                  <FaceDescriptionCard key={m_data.database_index} 
                               database_image={m_data.database_image}
                               database_index={m_data.database_index} 
                               detection_score={m_data.detection_score}
                               image_only_face={m_data.image_only_face}
                               match_score={m_data.match_score}/>
          )})}
          </div>
    </div> */}



 <div className='flex-1 overflow-y-auto'>

 {!loading ? 
      <>
      <p className="mt-10 text-center text-black">
        Match result will display here...
      </p>
      <FingerPrintIcon className="h-96 w-96 mx-auto mt-5 text-black animate-pulse"/>
      </>  
      :
<>
   {match_data.map((m_data:any)=>  {return(            
                  <FaceDescriptionCard2   key={m_data.database_index} 
                               database_image={m_data.database_image}
                               database_index={m_data.database_index} 
                               detection_score={m_data.detection_score}
                               image_only_face={m_data.image_only_face}
                               match_score={m_data.match_score}
                               matched_database_name={m_data.matched_database_name}
                               matched_database_age={m_data.matched_database_age}
                               matched_database_gender={m_data.matched_database_gender}/>
                               
          )})}
          </>
           }
</div>
</div>  
  )
}

export default Match