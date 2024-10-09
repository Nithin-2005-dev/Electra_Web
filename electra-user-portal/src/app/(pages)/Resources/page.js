
import { AnimationStoreProvider } from "@/app/store/AnimationStore"
import Header from "@/components/header/Header"
import ResourcesHero from "@/components/pikachu/ResourcesHero"
import Semesters from "@/components/Semesters/Semesters"
import Loader from "./loading"
import Footer from "@/components/footer/Footer"

const Resources = () => {
  return (
    <AnimationStoreProvider>
    <div className="flex flex-col gap-20 sm:gap-10 md:gap-6">
    <Header/>
    <ResourcesHero/>
    </div>    
    <Semesters/>
    <Footer/>
    </AnimationStoreProvider>
  )
}

export default Resources
