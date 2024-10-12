import Link from "next/link";
export default function Home() {
  return (
    <>
    <h1 className="text-white text-center p-4 font-black text-2xl capitalize">Electra Admin panel</h1>
    <div className="flex justify-center items-center h-[80vh]">
   <div className="flex flex-col justify-center text-center gap-6">
    <Link href={'/pages/Upload'} className="bg-slate-800 shadow-lg shadow-slate-500 text-white p-2 rounded-xl px-4 font-bold">Upload gallery images</Link>
    <Link href={'/pages/GetImage'} className="bg-slate-800 shadow-lg shadow-slate-500 text-white p-2 rounded-xl px-4 font-bold">see gallery images</Link>
    <Link href={'/pages/uploadTeam'} className="bg-slate-800 shadow-lg shadow-slate-500 text-white p-2 rounded-xl px-4 font-bold">Upload team details</Link>
    <Link href={'/pages/getTeam'} className="bg-slate-800 shadow-lg shadow-slate-500 text-white p-2 rounded-xl px-4 font-bold">get team details</Link>
    <Link href={'/pages/ResUpload'} className="bg-slate-800 shadow-lg shadow-slate-500 text-white p-2 rounded-xl px-4 font-bold">Upload resources</Link>
    <Link href={'/pages/getResources'} className="bg-slate-800 shadow-lg shadow-slate-500 text-white p-2 rounded-xl px-4 font-bold">see resources</Link>
   </div>
   </div>
   </>
  );
}
