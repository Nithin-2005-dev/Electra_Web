
import { AnimationStoreProvider } from "@/app/store/AnimationStore"
import Header from "@/components/header/Header"
import ResourcesHero from "@/components/pikachu/ResourcesHero"
import Semesters from "@/components/Semesters/Semesters"

const Resources = () => {
  return (
    <AnimationStoreProvider>
    <div className="flex flex-col gap-16 md:gap-6">
    <Header/>
    </div>
    <ResourcesHero/>
    <Semesters/>
    </AnimationStoreProvider>
  )
}

export default Resources
