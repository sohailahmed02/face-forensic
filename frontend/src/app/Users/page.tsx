'use client'

import { Users,columns } from "./columns"
import { DataTable } from "./data-table"
import { Toaster, toast } from 'react-hot-toast'
import React, { useEffect, useState } from 'react'
import IdentificationIcon from '@heroicons/react/16/solid/IdentificationIcon'



import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

  
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
  } from "@/components/ui/dialog"
  


async function getUsers(): Promise<Users[]> {

    const loadingToast = toast.loading('Loading data...');

    const res = await fetch(
        "http://127.0.0.1:8000/database/"
    )

    
    if (res.ok){
        toast.dismiss(loadingToast);
        const data = await res.json()
        // console.log("data", data)
         return data
    }
    
    else{
        toast.error('failed to load database',{
            id:loadingToast})
        // toast.error('Error fetching data');
        // Dismiss the loading toast in case of error
        toast.dismiss(loadingToast); 
        const blank:Users[]= [{ 
            id: "",
            file_name:"",
            image:"",
                }]
        // console.log("failed to fetch")
        return blank
        }   
}


type UploadResponse = {
    detail: string;
};

const User =  () => {

    const [data, setData] = useState<Users[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [name, setName]= useState("")


const handleFileChange = (event:any) => {
    setSelectedFiles(Array.from(event.target.files));
  };


  const handleUpload = async () => {
    // console.log("uploading state")
    
    const formData = new FormData();
    formData.append('file', selectedFiles[0])
    formData.append('name',name)  
   
    const endpoint = "http://127.0.0.1:8000/upload/"
    const upnotification = toast.loading('uploaing data...');

    try{
        const responsefile  = await fetch(endpoint,{
            method: "POST",
            body:formData,
        })
        // console.log("statusText",responsefile.statusText)
        const result: UploadResponse = await responsefile.json();
        // console.log("responsefile",result)

        const detail = result.detail;   
        
        if(responsefile.ok) {     
                 toast.success(`uploaded: ${detail} successfully`,{
                        id:upnotification});
                 };     
        if (responsefile.ok) {
            toast.success(`uploaded: ${detail} successfully`,{
                id:upnotification});
        } else {
            toast.error(`uploading failed ${detail}`,{
                id:upnotification})
        }                        
    }
        catch (error) {
            toast.error('Error uploading files',{
                id:upnotification})
            console.error("Error uploading files:", error);
            }  

  }
    useEffect(() => {
        const fetchData = async () => {
          // console.log("ggetting userss...")
          const data = await getUsers();
          setData(data);
          setLoading(false);
        };
    
        fetchData();
      }, []);

  return (
     
           <div className="flex flex-col h-screen overflow-hidden ">
            <Toaster />
            <div> 
            <Dialog>
      <DialogTrigger  asChild>
        <Button className="ml-20 mt-10 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"  variant="secondary">Add Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Profile</DialogTitle>
          <DialogDescription>
            Add New profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="default name"
              className="col-span-3"
              onChange={(e)=> setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              Image
            </Label>
            <Input
              type="file"
              accept=".jpeg,.jpg"
              id="image"
              className="col-span-3"
              onChange={handleFileChange} 
            />
          </div>

        </div>
        <DialogFooter>
        <DialogClose asChild>
          <Button 
          onClick={handleUpload}    
          disabled={!name || !selectedFiles[0]}
          >Upload</Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>

            </div>
             {/* <div> 
                <h1 className="mt-2 text-xl font-bold ml-2"> All Profiles</h1> 
             </div> */}
{loading ? 
        <> 
          <p className="mt-10 text-center text-black">
        Database will display here...
      </p>
      <IdentificationIcon className="h-10 w-10 mx-auto mt-5 text-black animate-pulse"/>
         </> : 
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-20">
          <DataTable columns={columns} data={data} />
        </div>
}
           </div>                     
      
  )
}

export default  User