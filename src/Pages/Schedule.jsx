import React from 'react'
import Background from '../assets/Bg2.jpg'
import { motion } from 'framer-motion'

const Schedule = () => {
  const scheduleData = [
    { day: 'السبت', time: '8:00 - 12:00' },
    { day: 'الأحد', time: '9:00 - 13:00' },
    { day: 'الاثنين', time: '8:00 - 12:00' },
  ]

  // Animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        type: 'spring',
        stiffness: 100
      }
    }
  }

  const scheduleItemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.3 + (i * 0.2),
        duration: 0.6,
        type: 'spring',
        stiffness: 120
      }
    })
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, x: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        delay: 0.4,
        duration: 0.8,
        type: 'spring',
        stiffness: 80
      }
    }
  }

  return (
    <div className='min-h-screen w-screen bg-black flex items-center justify-center p-4 md:p-0'>
      <div className='w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-0 px-4 lg:px-10'>
        
        {/* Schedule Content */}
        <div className='w-full lg:w-[40vw] flex flex-col items-center justify-start py-10 lg:py-20'>
          <motion.h1 
            className='Styled text-5xl md:text-6xl lg:text-7xl text-white mb-8 lg:mb-[10vh]'
            initial="hidden"
            animate="visible"
            variants={titleVariants}
          >
            أوقات التدريس
          </motion.h1>
          
          <div className='w-full max-w-md space-y-[8vh]'>
            {scheduleData.map((item, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={scheduleItemVariants}
                whileHover={{ scale: 1.05, x: -10, color: '#93C5FD' }}
                transition={{ type: 'spring' }}
                className='cursor-pointer'
              >
                <p className='Styled text-white text-3xl md:text-4xl lg:text-5xl text-center hover:text-white/80 transition-all'>
                  {item.day} {item.time}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Background Image */}
        <div className='w-full lg:w-[60vw] flex items-center justify-center'>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={imageVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring' }}
            style={{
              backgroundImage: `url(${Background})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center'
            }}
            className='h-[50vh] lg:h-[80vh] w-full rounded-2xl relative overflow-hidden group shadow-2xl'
          >
            {/* Gradient overlay matching landing page style */}
            <motion.div 
              className='absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent group-hover:opacity-40 transition-opacity duration-500'
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Schedule