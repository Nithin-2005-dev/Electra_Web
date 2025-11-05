import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes'
export const metadata = {
  title: "Electra Society",
  description: `Discover the Electra Society of NIT Silchar. Explore event galleries, academic resources, team details, and all about the Electrical Engineering Department.`,
  keywords:`Electrical Engineering, NIT Silchar, academic resources, class notes, electrical engineering department, engineering seminars, technical workshops, research publications, student activities, Electra Society, NIT Silchar events, faculty directory, lab manuals, project reports, engineering syllabus, engineering assignments,Electra Society NIT Silchar,Electrical Engineering Site Nit Silchar`,
};
export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{baseTheme:dark}}>
    <html lang="en">
    <head>
    <link rel="icon" href="https://i.imghippo.com/files/mt3cO1728475194.png" />
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
<meta name="robots" content="index, follow"></meta>
    </head>
      <body
      >
      {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
