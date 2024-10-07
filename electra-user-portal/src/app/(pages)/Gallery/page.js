'use server'
import { ImageStoreProvider } from "@/app/store/ImageStore"
import Header from "@/components/header/Header"
import ImageFilter from "@/components/imageFilter/ImageFilter"
import ImgSlider from "@/components/ImgSlider/ImgSlider"
import PhotoGroup from "@/components/photoGroup/PhotoGroup"
const Gallery = () => {
  return (
    <ImageStoreProvider>
    <Header/>
    <ImgSlider/>
    <ImageFilter/>
    <PhotoGroup/>
    </ImageStoreProvider>
  )
}

export default Gallery
