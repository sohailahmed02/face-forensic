'use client'
import Link from "next/link"


const Sidebar = () => {

    const signOut= ()=> {
            console.log("signout")
    }

  return (
    <div className='flex flex-col h-screen bg-gradient-to-bl from-neutral-400 via-neutral-500 to-neutral-600'>
        <div className='flex-1 '>
         
        <div className="">
            <Link href="../" passHref>
                <button className="w-48 border-lime-600 border m-2 p-2">
                Home
                </button>
            </Link>
        </div>

        <div className="">
            <Link href="../Users" passHref>
                <button className="w-48 border-lime-600 border m-2 p-2">
                Database
                </button>
            </Link>
        </div>

        <div className="">
            <Link href="../Match" passHref>
                <button className="w-48 border-lime-600 border m-2 p-2">
                Match
                </button>
            </Link>
        </div>

          <div className="">
            <Link href="../Cam" passHref>
                <button className="w-48 border-lime-600 border m-2 p-2">
                Cam
                </button>
            </Link>
        </div>        

        </div>
        <div>
      <button onClick={() => signOut()} className="w-48 border-lime-600 border m-2 p-2" >Sign Out</button>   

      </div>
</div>
  )
}

export default Sidebar