// src/app/layout.tsx
import BackgroundElectric from "../components/BackgroundElectric.jsx";
import "./globals.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
export const metadata = {
  title: "Electra Society",
  description: `Discover the Electra Society of NIT Silchar. Explore event galleries, academic resources, team details, and all about the Electrical Engineering Department.`,
  keywords:`Electrical Engineering, NIT Silchar, academic resources, class notes, electrical engineering department, engineering seminars, technical workshops, research publications, student activities, Electra Society, NIT Silchar events, faculty directory, lab manuals, project reports, engineering syllabus, engineering assignments,Electra Society NIT Silchar,Electrical Engineering Site Nit Silchar`,
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="/electra_logo.jpg" />
      <body className="bg-background text-textPrimary antialiased">
        <Header />
        <BackgroundElectric />
        <main className="pt-16">{children}</main>
        <Footer/>
      </body>
    </html>
  );
}
