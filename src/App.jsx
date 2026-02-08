import { useState } from 'react'
import LandingPage from './Pages/LandingPage.jsx'
import About from './Pages/About.jsx'
function App() {
  

  return (
    <div
    className='min-h-screen w-screen overflow-x-hidden'
    >
      <LandingPage />
      <About />
    </div>
  )
}

export default App
