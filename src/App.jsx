import { useState } from 'react'
import LandingPage from './Pages/LandingPage.jsx'
import About from './Pages/About.jsx'
import Schedule from './Pages/Schedule.jsx'
import Contact from './Pages/Contact.jsx'
function App() {
  

  return (
    <div
    className='min-h-screen w-screen overflow-x-hidden'
    >
      <LandingPage />
      <About />
      <Schedule />
      <Contact />
    </div>
  )
}

export default App
