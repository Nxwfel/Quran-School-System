import React from 'react'
import { motion } from 'framer-motion'

const About = () => {
  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        type: 'spring',
        stiffness: 100
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: 0.3 + (i * 0.2),
        duration: 0.6,
        type: 'spring',
        stiffness: 120
      }
    })
  }

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.5 + (i * 0.2),
        duration: 0.6,
        type: 'spring',
        stiffness: 100
      }
    })
  }

  return (
    <div className='min-h-screen w-screen flex flex-col lg:flex-row items-center justify-between bg-black p-4 md:p-8 lg:p-0'> 
      {/* Teachers Section */}
      <div className='w-full lg:w-[50vw] lg:h-screen p-4 md:p-6 lg:p-10 flex flex-col'>
          <motion.h1 
            className='Styled text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-6 md:mb-8 lg:mb-0 text-center lg:text-right'
            initial="hidden"
            animate="visible"
            variants={titleVariants}
          >
            طاقمنا التدريسي
          </motion.h1>
          
          {/* Cards */}
          <div className='flex w-full lg:w-[40vw] text-center items-start justify-start gap-4 md:gap-6 lg:gap-[1vw] overflow-x-auto overflow-y-hidden pb-4 mt-6 lg:mt-[10vh]'>
            <motion.div 
              custom={0}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ type: 'spring' }}
              className='h-[40vh] md:h-[45vh] lg:h-[50vh] bg-[#2E2E2E] text-center min-w-[70vw] md:min-w-[40vw] lg:min-w-[25vw] rounded-2xl shadow-2xl overflow-hidden flex-shrink-0 flex flex-col items-center'
            >
              <div className='h-[30vh] md:h-[35vh] lg:h-[40vh] w-full hover:blur-xl hover:transition-all bg-white'>

              </div>
              <h1 className='text-white Styled text-2xl md:text-3xl lg:text-4xl mt-2 md:mt-3 px-2'>
                الاستاذ خالد الدوسري
              </h1>
            </motion.div>

            <motion.div 
              custom={1}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ type: 'spring' }}
              className='h-[40vh] md:h-[45vh] lg:h-[50vh] bg-[#2E2E2E] text-center min-w-[70vw] md:min-w-[40vw] lg:min-w-[25vw] rounded-2xl shadow-2xl overflow-hidden flex-shrink-0 flex flex-col items-center'
            >
              <div className='h-[30vh] md:h-[35vh] lg:h-[40vh] w-full hover:blur-xl hover:transition-all bg-white'>

              </div>
              <h1 className='text-white Styled text-2xl md:text-3xl lg:text-4xl mt-2 md:mt-3 px-2'>
                الاستاذ خالد الدوسري
              </h1>
            </motion.div>
          </div>
      </div>

      {/* Stats Section */}
      <div className='w-full lg:w-[50vw] lg:h-screen flex flex-col pt-8 md:pt-12 lg:pt-[10vh] gap-8 md:gap-12 lg:gap-[10vh] items-center justify-start lg:justify-start'>
        <motion.h1 
          custom={0}
          initial="hidden"
          animate="visible"
          variants={statVariants}
          whileHover={{ scale: 1.1, color: '#60A5FA' }}
          transition={{ type: 'spring' }}
          className='Styled text-5xl md:text-6xl lg:text-7xl text-white cursor-pointer text-center'
        >
          +3 مدرسين
        </motion.h1>

        <motion.h1 
          custom={1}
          initial="hidden"
          animate="visible"
          variants={statVariants}
          whileHover={{ scale: 1.1, color: '#60A5FA' }}
          transition={{ type: 'spring' }}
          className='Styled text-5xl md:text-6xl lg:text-7xl text-white cursor-pointer text-center'
        >
          +20 طالب
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 1, rotate: 360 }}
          transition={{ delay: 1.2, duration: 1, type: 'spring' }}
          className=''
        >

        </motion.div>
      </div>
    </div>
  )
}

export default About