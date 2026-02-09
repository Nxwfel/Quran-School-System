import React, { useState } from 'react'
import Background from '../assets/Bg.jpg'
import {Link as Scroll} from 'react-scroll'
import {Link as Redirect} from 'react-router-dom'
import {motion, AnimatePresence} from 'framer-motion'

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  // Animation variants
  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        type: 'spring',
        stiffness: 100
      }
    })
  }

  const titleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.3,
        duration: 0.8,
        type: 'spring'
      }
    }
  }

  const quoteVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.6,
        duration: 0.8,
        type: 'spring'
      }
    }
  }

  const buttonVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.9 + (i * 0.15),
        duration: 0.6,
        type: 'spring'
      }
    })
  }

  const scrollIconVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 1.4,
        duration: 0.8
      }
    },
    float: {
      y: [0, 10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const mobileMenuVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    },
    exit: {
      opacity: 0,
      x: '100%',
      transition: {
        duration: 0.3
      }
    }
  }

  return (
    <div
    style={{backgroundImage: `url(${Background})` , backgroundPosition:'center' , backgroundSize:'cover' }}
    className='min-h-screen w-screen flex flex-col justify-center items-center z-50 relative'>
      
      {/* Desktop Navbar */}
      <div className='bg-transparent h-[15vh] z-20 w-screen flex items-center px-4 md:px-10 justify-between max-md:hidden'>
         <div className='flex items-center justify-center gap-[2vw]'> 
           <motion.div
             custom={0}
             initial="hidden"
             animate="visible"
             variants={navItemVariants}
           >
             <Scroll>
              <p className='Normal cursor-pointer text-white font-bold hover:text-transparent transform-3d transition-all'>رئيسية</p>
             </Scroll>
           </motion.div>
           <motion.div
             custom={1}
             initial="hidden"
             animate="visible"
             variants={navItemVariants}
           >
             <Scroll>
              <p className='Normal cursor-pointer text-white font-bold hover:text-transparent transform-3d transition-all'>معلومات</p>
             </Scroll>
           </motion.div>
           <motion.div
             custom={2}
             initial="hidden"
             animate="visible"
             variants={navItemVariants}
           >
             <Scroll>
              <p className='Normal cursor-pointer text-white font-bold hover:text-transparent transform-3d transition-all'>تواصلوا معنا</p>
             </Scroll>
           </motion.div>
         </div>

         <motion.div 
           className='Styled font-thin text-3xl md:text-4xl lg:text-5xl text-white'
           initial="hidden"
           animate="visible"
           variants={titleVariants}
         >
          <h1>
            مدرسة الجياد
          </h1>
         </motion.div>
      </div>

      {/* Mobile Navbar */}
      <div className='md:hidden bg-transparent h-[10vh] z-20 w-screen flex items-center px-4 justify-between'>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => setMenuOpen(!menuOpen)}
          className='text-white z-30'
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-8">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </motion.button>

        <motion.div 
          className='Styled font-thin text-3xl text-white'
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          <h1>مدرسة الجياد</h1>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            className='fixed top-0 right-0 h-screen w-[70vw] bg-black/95 backdrop-blur-md z-20 flex flex-col items-center justify-center gap-8 md:hidden'
          >
            <Scroll onClick={() => setMenuOpen(false)}>
              <p className='Normal cursor-pointer text-white text-2xl font-bold'>رئيسية</p>
            </Scroll>
            <Scroll onClick={() => setMenuOpen(false)}>
              <p className='Normal cursor-pointer text-white text-2xl font-bold'>معلومات</p>
            </Scroll>
            <Scroll onClick={() => setMenuOpen(false)}>
              <p className='Normal cursor-pointer text-white text-2xl font-bold'>تواصلوا معنا</p>
            </Scroll>
          </motion.div>
        )}
      </AnimatePresence>

      <div className='flex-1 w-screen flex flex-col items-center justify-center z-20 px-4' >
        <motion.div 
          className='w-[90vw] md:w-[70vw] lg:w-[50vw] bg-white rounded-2xl flex justify-end text-center px-4 md:px-6 py-4 md:py-0'
          initial="hidden"
          animate="visible"
          variants={quoteVariants}
        >
          <h1 className='Styled text-3xl md:text-4xl lg:text-5xl leading-relaxed md:leading-[4rem] lg:leading-[5rem] text-transparent bg-clip-text' 
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
        </motion.div>

        <div className='w-[90vw] md:w-[70vw] lg:w-[50vw] mt-[4vh] md:mt-[2vh] gap-4 md:gap-[3vw] flex flex-col md:flex-row items-center justify-center'>
           <motion.button
           custom={0}
           initial="hidden"
           animate="visible"
           variants={buttonVariants}
           whileHover={{ scale:1.05 , rotate:5 , backgroundColor:'white',color:'black' , gap:'1vw'}}
           transition={{type:'spring'}}
           className='w-full md:w-auto p-3 md:p-2 bg-white/20 flex items-center justify-center text-lg md:text-xl cursor-pointer text-white Styled rounded-sm'
           >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-7 md:size-9 mt-2 rotate-180">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
            </svg>
            فضاء الاساتذة
           </motion.button>
           <motion.button
           custom={1}
           initial="hidden"
           animate="visible"
           variants={buttonVariants}
           whileHover={{ scale:1.05 , rotate:5 , backgroundColor:'white',color:'black' , gap:'1vw'}}
           transition={{type:'spring'}}
           className='w-full md:w-auto p-3 md:p-2 bg-white/20 flex items-center justify-center text-lg md:text-xl cursor-pointer text-white Styled rounded-sm'
           >
            فضاء الاولياء
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-7 md:size-9 mt-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
            </svg>
           </motion.button>
        </div>
        
        <Scroll>
          <motion.svg
          initial="hidden"
          animate="visible"
          variants={scrollIconVariants}
          whileHover={{scale:1.05 , y:'0.5vh'}}
          style={{
            animation: 'float 2s ease-in-out infinite'
          }}
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="white" className="size-8 md:size-10 cursor-pointer absolute bottom-5 right-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
            </motion.svg>
        </Scroll>
      </div>
    <motion.div 
      className='h-screen w-screen top-0 absolute bg-gradient-to-b from-transparent to-black z-10 pointer-events-none'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />

    <style jsx>{`
      @keyframes float {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(10px);
        }
      }
    `}</style>
    </div>
  )
}

export default LandingPage