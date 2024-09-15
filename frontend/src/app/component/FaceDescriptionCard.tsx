
type Props={
    image_only_face: string
    detection_score: number
    match_score: number
    database_index:number
    database_image:string
} 


const FaceDescriptionCard = ({image_only_face,
                              detection_score,
                              match_score,
                              database_index,
                              database_image,}:Props) => {

  return (
    <div className=" grid grid-cols-5 gap-10 w-auto bg-white p-3">
      <div className="bg-red-500 col-span-2 ">
      <img className="h-auto w-auto object-cover" src={`data:image/jpeg;base64,${image_only_face}`} />
      {/* <img className=" object-cover h-auto w-auto" src="https://i.imgur.com/5yeBVeM.jpeg" /> */}

      <ul className="mt-3 flex flex-wrap">
        <li className="mr-auto">
          <p>{detection_score}</p>
          <p></p>
        </li>
        {/* <li className="mr-2">
          <a href="#" className="flex text-gray-400 hover:text-gray-600"> */}
            {/* <svg className="mr-0.5" style="width:24px;height:24px" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
            </svg> */}
                {/* <p>{match_score}</p> */}
            {/* </a>
        </li>
        <li className="mr-2">
          <a href="#" className="flex text-gray-400 hover:text-gray-600"> */}
            {/* <svg className="mr-0.5" style="width:24px;height:24px" viewBox="0 0 24 24">
              <path fill="currentColor" d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9Z" />
            </svg> */}
          {/* <p>{database_index}</p>            
          </a>
        </li> */}
    
      </ul>
      </div>

      <div className="bg-blue-500 col-span-1">

      </div>

      <div className="bg-green-500  col-span-2 flex flex-col items-center justify-center">
      <img className="object-center" src={`data:image/jpeg;base64,${database_image}`} height={100} width={100} />
            <p>Match Score  {(match_score*100)} %</p>
            <p>Data Base Id {database_index}</p>
     
      </div>
    </div>
        
  )
}

export default FaceDescriptionCard