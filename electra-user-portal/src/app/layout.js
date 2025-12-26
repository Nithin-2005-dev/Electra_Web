// src/app/layout.js
import "./globals.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import AppSplash from "../components/AppSplash";
import { Analytics } from "@vercel/analytics/next"
import { Inter, Playfair_Display } from "next/font/google";
export const metadata = { title: "Electra Society", description: "Discover the Electra Society of NIT Silchar. Explore events, resources, team details, and the Electrical Engineering Department.", keywords: "Electrical Engineering, NIT Silchar, Electra Society, engineering events, technical workshops, academic resources", icons: { icon: "https://res.cloudinary.com/dqa3ov76r/image/upload/v1729535834/favoritePhotos/ldlchr4ijcpgfq8nu2gx.jpg", }, };
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  variable: "--font-playfair",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-black text-white antialiased">
        <AppSplash />
        <Header />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}