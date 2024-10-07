'use client'
import { Suspense, useEffect } from "react";
import Home from "./(pages)/Home/page";
import Head from "next/head";
export default function Main() {
  return <>
  <Head><link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap" rel="stylesheet"></link>
<link href="https://fonts.googleapis.com/css2?family=Jacquarda+Bastarda+9&display=swap" rel="stylesheet"></link>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&display=swap" rel="stylesheet"></link>
<link href="https://fonts.googleapis.com/css2?family=Sofadi+One&display=swap" rel="stylesheet"></link>
<link href="https://fonts.googleapis.com/css2?family=Sofadi+One&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet"></link>
<link href="https://fonts.googleapis.com/css2?family=Shadows+Into+Light&display=swap" rel="stylesheet"></link>
<link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Shadows+Into+Light&display=swap" rel="stylesheet"></link>
<link href="https://fonts.googleapis.com/css2?family=Edu+AU+VIC+WA+NT+Guides:wght@400..700&display=swap" rel="stylesheet"/></Head>
  <>
  <Home/>
  </>
  </>;
}
