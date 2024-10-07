
import { AnimationStoreProvider } from "@/app/store/AnimationStore"
import Header from "@/components/header/Header"
import ResourcesHero from "@/components/pikachu/ResourcesHero"
import Semesters from "@/components/Semesters/Semesters"
import Loader from "./loading"

const Resources = () => {
  return (
    <AnimationStoreProvider>
    <div className="flex flex-col gap-20 md:gap-6">
    <Header/>
    <ResourcesHero/>
    </div>    
    <Semesters/>
    </AnimationStoreProvider>
  )
}

export default Resources
