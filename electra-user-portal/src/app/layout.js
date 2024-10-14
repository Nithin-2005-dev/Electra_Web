import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes'
export const metadata = {
  title: "Electra Society",
  description: `Discover the Electra Society of NIT Silchar. Explore event galleries, academic resources, team details, and all about the Electrical Engineering Department. Stay updated with seminars, workshops, and student activities organized by Electra Society`,
  keywords:`Electrical Engineering, NIT Silchar, academic resources, class notes, electrical engineering department, engineering seminars, technical workshops, research publications, student activities, Electra Society, NIT Silchar events, faculty directory, lab manuals, project reports, engineering syllabus, engineering assignments,Electra Society NIT Silchar,Electrical Engineering Site Nit Silchar`,
};
export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{baseTheme:dark}}>
    <html lang="en">
    <head>
    <link rel="icon" href="https://i.imghippo.com/files/mt3cO1728475194.png" />
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap" rel="stylesheet"></link>
<link href="https://fonts.googleapis.com/css2?family=Jacquarda+Bastarda+9&display=swap" rel="stylesheet"></link>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&display=swap" rel="stylesheet"></link>
<link href="https://fonts.googleapis.com/css2?family=Sofadi+One&display=swap" rel="stylesheet"></link>
<link href="https://fonts.googleapis.com/css2?family=Sofadi+One&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet"></link>
<link href="https://fonts.googleapis.com/css2?family=Shadows+Into+Light&display=swap" rel="stylesheet"></link>
<link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Shadows+Into+Light&display=swap" rel="stylesheet"></link>
<link href="https://fonts.googleapis.com/css2?family=Edu+AU+VIC+WA+NT+Guides:wght@400..700&display=swap" rel="stylesheet"/>
    </head>
      <body
      >
      {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
