'use client'

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Slider } from "@/components/ui/slider"
import { Toaster,toast } from 'react-hot-toast'
import FingerPrintIcon from '@heroicons/react/16/solid/FingerPrintIcon'

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [image_only_face, setimage_only_face] = useState("");
  const [slide2, setslide2]=useState([50])
  const [loading,  setloading]= useState(false)
  const [camResult,setCamResult] = useState([{
    "image":"",
    "database_id" : 0
  }])

  

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
    sendImageToServer(imageSrc);
    setloading(false)
  };

  const sendImageToServer = async (image) => {
  const matchingToast = toast.loading('Matcing...');
    try {
      const response = await fetch('http://127.0.0.1:8000/cam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image,
                               slide2:slide2[0].toString() }),
      });

      if (!response.ok) {
        throw new Error('Failed to send image');
      }

      const data = await response.json();
      // console.log('Server response:', data);
      setCamResult(data)

      toast.success('Successfuly matched',{
        id:matchingToast})
      setloading(true)
        
    } catch (error) {
      console.error('Error sending image:', error);
      toast.error('failed to matched with database',{
        id:matchingToast})
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <Toaster />
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-full max-w-sm"
      />
      <button
        onClick={capture}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Capture
      </button>
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

      {!loading ? 
          <>
          <p className="mt-10 text-center text-black">
            Match result will display here...
          </p>
          <FingerPrintIcon className="h-10 w-10 mx-auto mt-5 text-black animate-pulse"/>
          </>  
          :
        <div>
        {camResult.map((cam)=> {
          return(
            <div key={cam.database_id}>
            <img className="relative h-40 w-40 rounded-lg" src={`data:image/jpeg;base64,${cam.image}`} alt=""/>
            <span>face matched with database id : {cam.database_id}</span>
            </div>
          )
        })}
    </div>
    }  
  </div>
  )}

export default WebcamCapture;
