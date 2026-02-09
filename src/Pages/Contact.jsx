import React from 'react'
import { motion } from 'framer-motion'

const Contact = () => {
  return (
    <div className='min-h-screen w-screen bg-black flex flex-col items-center justify-center p-4 md:p-10'>
      <div className='w-full max-w-4xl flex flex-col items-center justify-center gap-[8vh]'>
        
        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='Styled text-6xl md:text-7xl lg:text-8xl text-white text-center'
        >
          تواصلوا معنا
        </motion.h1>

        {/* Contact Information */}
        <div className='w-full flex flex-col items-center justify-center gap-[6vh]'>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
            whileHover={{ scale: 1.05, x: -10 }}
            className='cursor-pointer text-center'
          >
            <p className='Normal text-white/60 text-xl md:text-2xl mb-2'>
              الهاتف
            </p>
            <p className='Styled text-white text-3xl md:text-4xl lg:text-5xl'>
              +213 123 456 789
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: 'spring' }}
            whileHover={{ scale: 1.05, x: -10 }}
            className='cursor-pointer text-center'
          >
            <p className='Normal text-white/60 text-xl md:text-2xl mb-2'>
              البريد الإلكتروني
            </p>
            <p className='Styled text-white text-2xl md:text-3xl lg:text-4xl'>
              contact@aljiyad.school
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, type: 'spring' }}
            whileHover={{ scale: 1.05, x: -10 }}
            className='cursor-pointer text-center'
          >
            <p className='Normal text-white/60 text-xl md:text-2xl mb-2'>
              العنوان
            </p>
            <p className='Styled text-white text-2xl md:text-3xl lg:text-4xl'>
              بشار، الجزائر
            </p>
          </motion.div>

        </div>

      </div>
    </div>
  )
}

export default Contact