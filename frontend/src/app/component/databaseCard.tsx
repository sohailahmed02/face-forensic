import { TrashIcon } from "@heroicons/react/16/solid"


type Props={
    id:number,
    name:string,
    imaget:string
    notify:any
}

const DatabaseCard = ({id,name,imaget,notify}:Props) => {


    const removeChat = async () => {
        const endpoint = "http://127.0.0.1:8000/delete/"

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
                notify.success(response.message); // Show success notification             
               })                
            }
    catch (error) {
        console.error("Error uploading files:", error);
    }}
  return (
    <div className="max-w-none w-96 m-8 p-4 bg-teal-700 text-white flex items-center">
        <img src={`data:image/jpeg;base64,${imaget}`}
            alt=""
            width={100}
            height={100}
            className='w-16 h-16 object-cover mr-3 rounded-md'
        />
        <div>
            <p className='text-2xl font-bold' >{name}</p>
            <span>{name}</span>
        </div>
        <div className="ml-auto ">
            <span className='text-xl rounded-full bg-orange-600 w-full h-full'>{id}</span>

        <TrashIcon 
                onClick={removeChat}
                className="h-5 w-5 mt-4 text-gray-200 hover:text-red-700"/>
    </div>
</div>
  )
}

export default DatabaseCard