import { useState } from 'react'
import LandingPage from './Pages/LandingPage.jsx'
import About from './Pages/About.jsx'
import Schedule from './Pages/Schedule.jsx'
import Contact from './Pages/Contact.jsx'
import TeacherPage from './Pages/TeacherPage.jsx'
import ParentPage from './Pages/ParentPage.jsx'
function App() {
  

  return (
    <div
    className='min-h-screen w-screen overflow-x-hidden'
    >
      <LandingPage />
      <About />
      <Schedule />
      <Contact />
      <TeacherPage />
      <ParentPage />
    </div>
  )
}

export default App
