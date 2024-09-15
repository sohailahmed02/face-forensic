'use client'

import React, { useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'


type UploadResponse = {
    message: string;
    file_names: string[]
};

const Upload = () => {

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleFileChange = (event:any) => {
    setSelectedFiles(Array.from(event.target.files));
    setResponseMessage(''); // Clear previous response message
    setUploadedFiles([]); // Clear previous uploaded files list
  };

  const handleUpload = async () => {
        setIsUploading(true);
        setResponseMessage(''); // Clear previous response message
        setUploadedFiles([]); // Clear previous uploaded files list
    const formData = new FormData();
    selectedFiles.forEach(file=>{
        formData.append('file', file)
    })
    const endpoint = "http://127.0.0.1:8000/upload/"
    const notification = toast.loading("image uploading...")
    try{
    const responsefile  = await fetch(endpoint,{
        method: "POST",
        body:formData
    })
    const result: UploadResponse[] = await responsefile.json();
    const messageObj = result.find(item => 'message' in item);
    const fileNamesObj = result.find(item => 'file_names' in item);
    if (messageObj && fileNamesObj) {     
            fileNamesObj.file_names.forEach((filename) => {
                toast.success(`uploaded: ${filename} successfully`,{
                    id:notification});
            });      
        setResponseMessage(messageObj.message); // Set the response message
        setUploadedFiles(fileNamesObj.file_names); // Set the uploaded files list
    } else {
        toast.error('Unexpected response format',{
            id:notification})
        setResponseMessage('Unexpected response format');
    }
    } catch (error) {
        toast.error('Error uploading files',{
            id:notification})
        console.error("Error uploading files:", error);
        setResponseMessage('Error uploading files');
    } finally {
        setIsUploading(false);
    }   
}

  return (
    <div> 
        <Toaster />
        <div className="upload-container p-10 m-10  drop-shadow-lg shadow-slate-500">
            <input 
            type="file" 
            multiple
            onChange={handleFileChange} 
            accept=".jpeg,.jpg"
            />
            <button 
            className='w-48 border-lime-600 border m-2 p-2' 
            onClick={handleUpload}>
                Upload</button>
                <p className='text-red-700 font-bold'>.jpeg,.jpg  only</p> 
        </div> 
            
    </div>
  )
}

export default Upload