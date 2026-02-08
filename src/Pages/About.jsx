import React from 'react'

const About = () => {
  return (
    <div className='h-screen w-screen flex items-center justify-between bg-black'> 
      <div className='h-screen w-[50vw] p-10'>
          <h1 className='Styled text-7xl text-white'>
          طاقمنا التدريسي
          </h1>
          {/* Cards */}
          <div className='flex items-center justify-center gap-[1vw] overflow-visible'>
          <div className='h-[50vh] w-[20vw] rounded-2xl shadow-2xl overflow-hidden mt-[10vh] bg-grey-400 flex flex-col items-end'>
            <div className='h-[40vh] w-full hover:blur-xl hover:transition-all bg-white'>

            </div>
            <h1 className='text-white Styled text-4xl'>
              الاستاذ خالد الدوسري
            </h1>

          </div>
          <div className='h-[50vh] w-[20vw] rounded-2xl shadow-2xl overflow-hidden mt-[10vh] bg-grey-400 flex flex-col items-end'>
            <div className='h-[40vh] w-full hover:blur-xl hover:transition-all bg-white'>

            </div>
            <h1 className='text-white Styled text-4xl'>
              الاستاذ خالد الدوسري
            </h1>

          </div>
      </div>
      </div>
         <div className='h-screen w-[50vw] flex flex-col items-center justify-start'>
          <h1 className='Styled text-7xl text-white'>
             +3 مدرسين
          </h1>
           <h1 className='Styled text-7xl text-white'>
             +20 طالب
          </h1>
          <div className=''>

          </div>
      </div>
    </div>
  )
}

export default About