
import { AnimationStoreProvider } from "@/app/store/AnimationStore"
import Header from "@/components/header/Header"
import ResourcesHero from "@/components/pikachu/ResourcesHero"
import Semesters from "@/components/Semesters/Semesters"

const Resources = () => {
  return (
    <AnimationStoreProvider>
    <Header/>
    <ResourcesHero/>
    <Semesters/>
    </AnimationStoreProvider>
  )
}

export default Resources
