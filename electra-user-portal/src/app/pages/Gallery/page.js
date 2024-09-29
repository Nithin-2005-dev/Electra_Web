'use server'
import Header from "@/components/header/Header"
import ImageFilter from "@/components/imageFilter/ImageFilter"
import ImgSlider from "@/components/ImgSlider/ImgSlider"
import PhotoGroup from "@/components/photoGroup/PhotoGroup"
const Gallery = () => {
  return (
    <>
    <Header/>
    <ImgSlider/>
    <ImageFilter/>
    <PhotoGroup/>
    </>
  )
}

export default Gallery
