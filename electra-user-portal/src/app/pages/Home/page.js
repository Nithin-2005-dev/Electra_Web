'use client'
import LightninigBold from "@/components/3d-models/lightning-bolt"
import Events from "@/components/Events/Events"
import Header from "@/components/header/Header"
import Landing from "@/components/landing-page/Landing"
import About from "../Resources/page"
import AboutUs from "@/components/aboutUs/About"
const Home = () => {
  return (
    <div>
      <Header/>
      <Landing/>
      <AboutUs/>
      <Events/>
    </div>
  )
}

export default Home
