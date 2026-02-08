import React from 'react'
import Background from '../assets/Bg.jpg'
import {Link as Scroll} from 'react-scroll'
import {Link as Redirect} from 'react-router-dom'
import {motion} from 'framer-motion'
const LandingPage = () => {
  return (
    <div
    style={{backgroundImage: `url(${Background})` , backgroundPosition:'center' , backgroundSize:'cover' }}
    className='min-h-screen w-screen flex flex-col justify-center items-center z-50'>
      {/* Navbar */}
      <div className='bg-transparent h-[15vh] z-20 w-screen flex items-center px-10 justify-between max-md:hidden'>
         <div className='flex items-center justify-center gap-[2vw]'> 
           <Scroll>
            <p className='Normal cursor-pointer text-white font-bold hover:text-transparent transform-3d transition-all'>رئيسية</p>
           </Scroll>
           <Scroll>
            <p className='Normal cursor-pointer text-white font-bold hover:text-transparent transform-3d transition-all'>معلومات</p>
           </Scroll>
           <Scroll>
            <p className='Normal cursor-pointer text-white font-bold hover:text-transparent transform-3d transition-all'>تواصلوا معنا</p>
           </Scroll>
         </div>

         <div className='Styled font-thin text-5xl text-white'>
          <h1>
            مدرسة الجياد
          </h1>
         </div>

      </div>
      <div className='h-[85vh] w-screen flex flex-col items-center justify-start z-20' >
        <div className='w-[50vw] bg-white rounded-2xl flex justify-end text-center max-md:w-[90vw] px-6 mt-[10vh]'>
          <h1 className='Styled text-5xl/20 text-transparent bg-clip-text' 
              style={{
                backgroundImage: `url(${Background})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
            وَهَٰذَا كِتَابٌ أَنزَلْنَاهُ مُبَارَكٌ فَاتَّبِعُوهُ وَاتَّقُوا لَعَلَّكُمْ تُرْحَمُونَ
          </h1>
        </div>

        <div className='w-[50vw] mt-[2vh] gap-[3vw] flex items-center justify-center'>
           <motion.button
           initial={{ scale:1 , rotate:0, backgroundColor:'transparent' ,color:'white' , gap:'0vw'}}
           whileHover={{ scale:1.05 , rotate:5 , backgroundColor:'white',color:'black' , gap:'1vw'}}
           transition={{type:'spring'}}
           className='p-2 bg-white/20 flex items-center justify-center text-xl cursor-pointer text-white Styled rounded-sm'
           >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-9 mt-2 rotate-180">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
            </svg>
            فضاء الاساتذة
           </motion.button>
           <motion.button
           initial={{ scale:1 , rotate:0, backgroundColor:'transparent' ,color:'white' , gap:'0vw'}}
           whileHover={{ scale:1.05 , rotate:5 , backgroundColor:'white',color:'black' , gap:'1vw'}}
           transition={{type:'spring'}}
           className='p-2 bg-white/20 flex items-center justify-center text-xl cursor-pointer text-white Styled rounded-sm'
           >
            فضاء الاولياء
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-9 mt-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
            </svg>

           </motion.button>
        </div>
        <Scroll>
          <motion.svg
          initial={{scale:1 , y:'0vh'}}
          whileHover={{scale:1.05 , y:'0.5vh'}}
          transition={{type:'spring'}}
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="white" className="size-10 cursor-pointer absolute bottom-5 right-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
            </motion.svg>
        </Scroll>
      </div>
    <div className='h-screen w-screen top-0 absolute bg-gradient-to-b from-transparent to-black z-10' />
    </div>
  )
}

export default LandingPage