import Image from "next/image";
import face from "../../public/Face.png"

export default function Home() {
  return (
        <div>
          <Image src={face} alt="face" className="ml-20 mt-10"/>
          <h1 className="text-6xl ml-20 text-center font-extrabold mt-5">Face Forensic</h1>
        </div>
  );
}
