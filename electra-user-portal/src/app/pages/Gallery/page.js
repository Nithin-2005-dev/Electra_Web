'use server'
import Header from "@/components/header/Header"
import ImageFilter from "@/components/imageFilter/ImageFilter"
import ImgSlider from "@/components/ImgSlider/ImgSlider"
const Gallery = () => {
  return (
    <>
    <Header/>
    <ImgSlider/>
    <ImageFilter/>
    </>
  )
}

export default Gallery
