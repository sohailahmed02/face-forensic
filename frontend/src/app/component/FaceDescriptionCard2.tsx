import FingerPrintIcon from '@heroicons/react/16/solid/FingerPrintIcon'



type Props={
    image_only_face: string
    detection_score: number
    match_score: number
    database_index:number
    database_image:string
    matched_database_name:string
    matched_database_age:number,
    matched_database_gender:string,
} 


const FaceDescriptionCard2 = ({image_only_face,
                              detection_score,
                              match_score,
                              database_index,
                              database_image,
                              matched_database_name,
                              matched_database_age,
                              matched_database_gender}:Props) => {

  return (
    <div className=" flex flex-wrap gap-x-20 items-center justify-center">
    
   
    {/* <div className="flex-shrink-0 m-6 relative overflow-hidden bg-teal-500 rounded-lg max-w-xs shadow-lg">
      <svg class="absolute bottom-0 left-0 mb-8" viewBox="0 0 375 283" fill="none" style="transform: scale(1.5); opacity: 0.1;">
        <rect x="159.52" y="175" width="152" height="152" rx="8" transform="rotate(-45 159.52 175)" fill="white"/>
        <rect y="107.48" width="152" height="152" rx="8" transform="rotate(-45 0 107.48)" fill="white"/>
      </svg>
      <div className="relative pt-10 px-10 flex items-center justify-center">
        <div class="block absolute w-48 h-48 bottom-0 left-0 -mb-24 ml-3" style="background: radial-gradient(black, transparent 60%); transform: rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1); opacity: 0.2;"></div>
        <img className="relative w-40" src="https://user-images.githubusercontent.com/2805249/64069998-305de300-cc9a-11e9-8ae7-5a0fe00299f2.png" alt="">
      </div>
      <div className="relative text-white px-6 pb-6 mt-6">
        <span className="block opacity-75 -mb-1">Outdoor</span>
        <div className="flex justify-between">
          <span className="block font-semibold text-xl">Monstera</span>
          <span className="block bg-white rounded-full text-teal-500 text-xs font-bold px-3 py-2 leading-none flex items-center">$45.00</span>
        </div>
      </div>
    </div> */}
    <div className="flex-shrink-0 m-6 relative overflow-hidden bg-purple-500 rounded-lg max-w-xs shadow-lg">
      <svg className="absolute bottom-0 left-0 mb-8 transform: scale(1.5); opacity: 0.1;" viewBox="0 0 375 283" fill="none">
        <rect x="159.52" y="175" width="152" height="152" rx="8" transform="rotate(-45 159.52 175)" fill="white"/>
        <rect y="107.48" width="152" height="152" rx="8" transform="rotate(-45 0 107.48)" fill="white"/>
      </svg>
      <div className="relative pt-10 px-10 flex items-center justify-center">
        <div className="block absolute w-48 h-48 bottom-0 left-0 -mb-24 ml-3 background: radial-gradient(black, transparent 60%); transform: rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1); opacity: 0.2;"></div>
        <img className="relative h-40 w-40 rounded-lg" src={`data:image/jpeg;base64,${image_only_face}`} alt=""/>
      </div>
      <div className="relative text-white px-6 pb-6 mt-6">
        {/* <span className="block opacity-75 -mb-1">Age: {matched_database_age}</span> */}
        <div className="flex justify-between">
          {/* <span className="block font-semibold text-lg">{matched_database_gender}</span> */}
          <span className="block bg-white rounded-full text-purple-500 text-xs font-bold px-3 py-2 leading-none flex items-center">{detection_score}%</span>
        </div>
      </div>
    </div>

    <div className="flex-shrink-0 m-6 relative overflow-hidden bg-orange-500 rounded-lg max-w-xs shadow-lg">
      <svg className="absolute bottom-0 left-0 mb-8 transform: scale(1.5); opacity: 0.1;" viewBox="0 0 375 283" fill="none">
        <rect x="159.52" y="175" width="152" height="152" rx="8" transform="rotate(-45 159.52 175)" fill="white"/>
        <rect y="107.48" width="152" height="152" rx="8" transform="rotate(-45 0 107.48)" fill="white"/>
      </svg>
      <div className="relative pt-10 px-10 flex items-center justify-center">
        <div className="block absolute w-48 h-48 bottom-0 left-0 -mb-24 ml-3 background: radial-gradient(black, transparent 60%); transform: rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1); opacity: 0.2;"></div>
        <img className="relative rounded-full w-40" src={`data:image/jpeg;base64,${database_image}`} alt=""/>
      </div>
      <div className="relative text-white px-6 pb-6 mt-6">
        <span className="block opacity-75 -mb-1">Name: {matched_database_name}</span>
        <div className="flex justify-between">
          {/* <span className="block font-semibold ">Id:</span> */}
          <span className="block font-semibold text-xl">ID: {database_index}</span>
          {/* <FingerPrintIcon className="  block h-10 w-10 mx-auto mt-5 text-black animate-pulse"/> */}
          <span className="block bg-white rounded-full text-orange-500 text-xs font-bold px-3 py-2 leading-none flex items-center">{match_score}%</span>
        </div>
      </div>
    </div>
    
  </div>
        
  )
}

export default FaceDescriptionCard2