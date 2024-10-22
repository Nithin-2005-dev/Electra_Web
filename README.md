# Electra Society Website - NIT Silchar
This repository contains the source code for the official website of the Electra Society of NIT Silchar, built using Next.js.
## Overview

This website showcases the activities, events, and achievements of the society, providing information to students, faculty, and visitors.

## Tech Stack

- Next.js: React framework for server-rendered applications.
- React.js: Frontend UI library for building interactive user interfaces.
- Tailwind CSS (or your choice of styling): For styling and responsive design.
- Node.js: Backend for handling requests and API endpoints (if applicable).
-mongoDb:Database to handle the overall data in the website
## Prerequisites

- Node.js
- npm or yarn package manager

## Getting Started

To get a local copy of the project and run it locally:
```bash
### 1. Clone the repository
git clone https://github.com/Nithin-2005-dev/Electra_Website.git
cd Electra_Website
### 2. Install Dependencies
npm install
# or
yarn install

### 3. Run the development server
npm run dev
# or
yarn dev
Open http://localhost:3000 in your browser to view the website in development mode.

### 5. Build for production
npm run build

### 6.  Start the production server
npm start

project structure
.app
├──src
      
      ├── database       # database folder
      ├── api            # API routes
      ├── external_apis  # third party apis
      ├── auth           #pages belongs to authantication 
      ├── pages          # pages
      ├── store          # context apis
      ├── styles         # custom styles with css modules
      └── utils          # utility files
├── components   # Reusable ui components
├── models       # data models

packages
->three.js three/fibre three/drei #3d model rendering
->shadcn #ui components
->react icons #custom icons
->hover.css #for hovering effect of buttons [https://github.com/IanLunn/Hover]
->react-verticle-components #event-timeline
->clerk #for authentication
->file-saver #to save images
->framer-motion #animation library
->mongoose #for data validating and modelling
->cloudinary #images store
->type writer #typing effect library
->react-toastify #to show toasts
