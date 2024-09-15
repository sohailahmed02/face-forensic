"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal,ArrowUpDown,Trash2 } from "lucide-react"
import { TrashIcon } from "@heroicons/react/16/solid"
import { Toaster, toast } from 'react-hot-toast'

 
import { Button } from "@/components/ui/button"


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"


  import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card"
  

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Users = {
  id: string
  file_name: string
  image: string
}


const removeChat = async (id:string) => {
    const endpoint = "http://127.0.0.1:8000/delete/"
    const loadingToast = toast.loading('deleting data...');

try{
        const responsefile  = await fetch(endpoint,{
            method: "POST",
            body:JSON.stringify({
                "id": id,
            }),    
        headers:{
            "Content-Type" : "application/json"
        }
            })
            .then(res => res.json())
            .then(async response => {
            toast.success(response.message,{
                id:loadingToast
            }); // Show success notification 
                    
           })                
        }
catch (error) {
    console.error("Error deleting files:", error);
    toast.error("Error deleting files",{
        id:loadingToast})
    // toast.error(error); // Show success notification 
}}

export const columns: ColumnDef<Users>[] = [
    
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Id
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
      },

  {
    accessorKey: "file_name",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  
  {
    accessorKey: "image",
    header: "Image",
    cell:({row})=>{
        const image_base64= row.getValue("image")
        return <div>

              <HoverCard>
              <HoverCardTrigger>
            <img src={`data:image/jpeg;base64,${image_base64}`} alt="image" height={30} width={30}/>
                </HoverCardTrigger>
              <HoverCardContent>
              <img src={`data:image/jpeg;base64,${image_base64}`} alt="image" height={200} width={200}/>
              </HoverCardContent>
            </HoverCard>
        </div>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment= row.original.id
    //   console.log("payment",payment)
 
      return (
        
        <DropdownMenu>
            <Toaster />
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <DropdownMenuLabel>Actions</DropdownMenuLabel>+ */}
            <DropdownMenuItem
              onClick={()=>removeChat(payment)}
            >Remove
            </DropdownMenuItem>
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
        
      )
    },
  }
]
