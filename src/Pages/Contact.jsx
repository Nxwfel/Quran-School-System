import React, { useState } from 'react'
import { motion } from 'framer-motion'

const Contact = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const contactItems = [
    {
      label: 'الهاتف',
      value: '+213 123 456 789',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
      ),
      note: 'متاح من ٨ صباحاً حتى ٦ مساءً'
    },
    {
      label: 'البريد الإلكتروني',
      value: 'contact@aljiyad.school',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
      note: 'نرد في غضون ٢٤ ساعة'
    },
    {
      label: 'العنوان',
      value: 'بشار، الجزائر',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      ),
      note: 'حي الجياد، الحي التعليمي'
    },
  ]

  return (
    <div
      style={{
        background:
          "radial-gradient(circle at 50% 20%, #1a150aff 0%, #0c0804 60%, #050302 100%)",
      }}
      className='min-h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden bg-black'
    >


      {/* Large radial glow center */}
      <div
        className='absolute inset-0 pointer-events-none'
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,163,79,0.07) 0%, transparent 70%)' }}
      />

      {/* Floating ornamental circles */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-3xl max-h-3xl rounded-full pointer-events-none opacity-[0.04]'
        style={{ border: '1px solid #d4a34f' }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] max-w-2xl max-h-2xl rounded-full pointer-events-none opacity-[0.06]'
        style={{ border: '1px dashed #d4a34f' }}
      />

      <div className='w-full max-w-3xl flex flex-col items-center justify-center gap-0 px-6 py-16 z-10'>

        {/* Top ornament */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className='text-4xl mb-4'
          style={{ color: '#d4a34f', textShadow: '0 0 30px rgba(212,163,79,0.5)' }}
        >
          ✦
        </motion.div>

        {/* Horizontal rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className='w-40 h-px mb-8'
          style={{ background: 'linear-gradient(to right, transparent, #d4a34f, transparent)' }}
        />

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
          className='Styled text-center mb-3'
          style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            color: '#fff',
            textShadow: '0 4px 60px rgba(212,163,79,0.25)',
            lineHeight: 1.1
          }}
        >
          تواصلوا معنا
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className='Normal text-center text-lg mb-14 text-white/40'
        >
          يسعدنا الرد على استفساراتكم
        </motion.p>

        {/* Contact Cards */}
        <div className='w-full flex flex-col gap-5'>
          {contactItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.15, type: 'spring', stiffness: 100 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              whileHover={{ scale: 1.02 }}
              className='relative flex items-center gap-5 rounded-2xl px-7 py-6 cursor-pointer overflow-hidden'
              style={{
                background: hoveredIndex === index
                  ? 'linear-gradient(135deg, rgba(212,163,79,0.14) 0%, rgba(212,163,79,0.06) 100%)'
                  : 'linear-gradient(135deg, rgba(212,163,79,0.07) 0%, rgba(212,163,79,0.03) 100%)',
                border: '1px solid rgba(212,163,79,0.2)',
                transition: 'background 0.4s ease'
              }}
            >
              {/* Glow on hover */}
              {hoveredIndex === index && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='absolute inset-0 pointer-events-none'
                  style={{ background: 'radial-gradient(circle at 80% 50%, rgba(212,163,79,0.1) 0%, transparent 60%)' }}
                />
              )}

              {/* Icon */}
              <div
                className='flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center'
                style={{
                  background: 'rgba(212,163,79,0.12)',
                  border: '1px solid rgba(212,163,79,0.25)',
                  color: '#d4a34f'
                }}
              >
                {item.icon}
              </div>

              {/* Vertical divider */}
              <div className='h-12 w-px flex-shrink-0' style={{ background: 'rgba(212,163,79,0.2)' }} />

              {/* Text */}
              <div className='flex flex-col flex-1 items-end'>
                <span className='Normal text-sm mb-1 text-white'>
                  {item.label}
                </span>
                <span
                  className='Normal text-white text-xl md:text-2xl lg:text-3xl'
                  style={{
                    transition: 'color 0.3s ease',
                    direction: index === 0 ? 'ltr' : 'rtl'
                  }}
                >
                  {item.value}
                </span>
                <span className='Normal text-xs mt-1 text-white/40'>
                  {item.note}
                </span>
              </div>

              {/* Right bar indicator */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: hoveredIndex === index ? 1 : 0 }}
                className='absolute right-0 top-1/2 -translate-y-1/2 w-1 rounded-full'
                style={{
                  height: '60%',
                  background: 'linear-gradient(to bottom, transparent, #d4a34f, transparent)',
                  transformOrigin: 'center'
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom ornament */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className='w-40 h-px mt-12 mb-4'
          style={{ background: 'linear-gradient(to right, transparent, #d4a34f, transparent)' }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className='text-2xl'
          style={{ color: '#d4a34f', opacity: 0.6 }}
        >
          ✦
        </motion.div>
      </div>
    </div>
  )
}

export default Contact