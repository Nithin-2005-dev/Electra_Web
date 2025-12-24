// src/app/layout.js
import "./globals.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import AppSplash from "../components/AppSplash";
import { Inter, Playfair_Display } from "next/font/google";

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

export const metadata = {
  title: "Electra Society",
  description:
    "Discover the Electra Society of NIT Silchar. Explore events, resources, team details, and the Electrical Engineering Department.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-black text-white antialiased">

        {/* 🔴 STATIC FIRST-PAINT LOADER (BLOCKS INITIAL PAINT) */}
        <div id="electra-static-loader">
          <div className="loader-content">
            <h1>Electra</h1>
            <span className="line" />
            <p>Preparing the experience</p>
          </div>
        </div>

        {/* 🟢 REACT SPLASH CONTROLLER */}
        <AppSplash />

        <Header />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
