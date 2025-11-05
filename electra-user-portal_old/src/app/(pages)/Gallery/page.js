'use server'
import { ImageStoreProvider } from "@/app/store/ImageStore"
import Footer from "@/components/footer/Footer"
import Header from "@/components/header/Header"
import ImageFilter from "@/components/imageFilter/ImageFilter"
import ImgSlider from "@/components/ImgSlider/ImgSlider"
import PhotoGroup from "@/components/photoGroup/PhotoGroup"
const Gallery = () => {
  return (
    <main>
    <ImageStoreProvider>
    <Header/>
    <ImgSlider/>
    <ImageFilter/>
    <PhotoGroup/>
    <Footer/>
    </ImageStoreProvider>
    </main>
  )
}

export default Gallery
