import Link from "next/link";

export default function Home() {
  return (
   <div className="flex flex-col justify-center text-center gap-2">
    <Link href={'/pages/Upload'} className="bg-blue-300 text-white p-2">Upload gallery images</Link>
    <Link href={'/pages/GetImage'} className="bg-blue-300 text-white p-2">see gallery images</Link>
    <Link href={'/pages/uploadTeam'} className="bg-blue-300 text-white p-2">Upload team details</Link>
    <Link href={'/pages/getTeam'} className="bg-blue-300 text-white p-2">get team details</Link>
    <Link href={'/pages/ResUpload'} className="bg-blue-300 text-white p-2">Upload resources</Link>
    <Link href={'/pages/getResources'} className="bg-blue-300 text-white p-2">see resources</Link>
   </div>
  );
}
