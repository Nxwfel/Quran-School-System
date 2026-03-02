import React, { useState, useEffect } from 'react'
import Background from '../assets/Bg.jpg'
import { Link as Scroll } from 'react-scroll'
import { Link as Redirect } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, Menu, X, ArrowUpRight } from 'lucide-react'

const navItems = [
  { label: 'الرئيسية', to: 'hero' },
  { label: 'معلومات عنا', to: 'about' },
  { label: 'البوابات', to: 'portals' },
]

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const { scrollY } = useScroll()
  const yImage = useTransform(scrollY, [0, 1000], [0, 200])
  const yText = useTransform(scrollY, [0, 1000], [0, -100])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className='Styled bg-[var(--color-arch-bg)] min-h-screen text-[var(--color-arch-dark)] font-sans overflow-x-hidden selection:bg-[var(--color-arch-dark)] selection:text-[var(--color-arch-bg)]'>

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[var(--color-arch-bg)]/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}
      >
        <div className='max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between'>
          {/* Logo */}
          <div className='Styled text-2xl md:text-3xl tracking-wide font-medium cursor-pointer'>
            <Scroll to="hero" smooth={true} duration={800}>
              موسى بن نصير
            </Scroll>
          </div>

          {/* Desktop Links */}
          <div className='hidden md:flex items-center Styled gap-10'>
            {navItems.map((item, i) => (
              <Scroll key={i} to={item.to} smooth={true} duration={800} offset={-80} className='cursor-pointer text-sm tracking-wider uppercase opacity-70 hover:opacity-100 transition-opacity flex items-center gap-2 group Arabic-Sans'>
                {item.label}
              </Scroll>
            ))}
            <Scroll to="portals" smooth={true} duration={800} offset={-80}>
              <button className='text-xs uppercase tracking-widest border border-[var(--color-arch-dark)] px-5 py-2 hover:bg-[var(--color-arch-dark)] hover:text-[var(--color-arch-bg)] transition-colors duration-500 Styled'>
                دخول
              </button>
            </Scroll>
          </div>

          {/* Mobile Menu Toggle */}
          <button className='md:hidden z-50 text-[var(--color-arch-dark)]' onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className='fixed inset-0 bg-[var(--color-arch-bg)] z-40 flex flex-col items-center justify-center gap-8'
          >
            {navItems.map((item, i) => (
              <Scroll
                key={i}
                to={item.to}
                smooth={true}
                duration={800}
                onClick={() => setMenuOpen(false)}
                className='text-3xl Styled text-[var(--color-arch-dark)] cursor-pointer hover:opacity-60 transition-opacity'
              >
                {item.label}
              </Scroll>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── HERO SECTION ─────────────────────────────────────────────────── */}
      <section id="hero" className='relative h-screen w-full flex flex-col md:flex-row overflow-hidden pt-20 md:pt-0'>
        {/* Left Side (Beige Background + Text) */}
        <div className='w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 z-10 relative bg-[var(--color-arch-bg)]'>
          <motion.div
            style={{ y: yText }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            <p className='text-sm tracking-[0.2em] font-light uppercase opacity-60 mb-6'>مدرسة قرآنية نموذجية</p>
            <h1 className='font-serif text-[4rem] md:text-[6rem] lg:text-[8rem] leading-[0.85] tracking-tight Arabic-Serif'>
              موسى<br /> بن نصير
            </h1>
            <p className='mt-8 text-lg md:text-xl font-light opacity-80 max-w-md leading-relaxed Arabic-Sans border-l border-[var(--color-arch-accent)] pl-4 ml-2'>
              وَهَٰذَا كِتَابٌ أَنزَلْنَاهُ مُبَارَكٌ فَاتَّبِعُوهُ وَاتَّقُوا لَعَلَّكُمْ تُرْحَمُونَ
            </p>
            <div className='mt-12 flex items-center gap-6'>
              <Scroll to="portals" smooth={true} duration={800} className='group cursor-pointer flex items-center gap-3 text-sm tracking-widest uppercase border-b border-[var(--color-arch-dark)] pb-1 hover:text-[var(--color-arch-accent)] hover:border-[var(--color-arch-accent)] transition-colors Arabic-Sans'>
                ابدأ
                <ArrowUpRight size={16} className='group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform' />
              </Scroll>
            </div>
          </motion.div>
        </div>

        {/* Right Side (Image + Overlay) */}
        <div className='w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden'>
          <motion.div
            style={{ y: yImage }}
            className='absolute inset-0 w-full h-[120%]'
          >
            <div className='absolute inset-0 bg-black/20 z-10' /> {/* Subtle darken for contrast */}
            <img
              src={Background}
              alt="Arch Vision Architecture"
              className='w-full h-full object-cover object-center transform scale-105'
            />
          </motion.div>
          {/* Aesthetic Text Overlay on Image */}
          <div className='absolute inset-0 z-20 flex items-center justify-center md:justify-start pointer-events-none opacity-10 md:opacity-30 mix-blend-overlay'>
            <h1 className='text-[8rem] md:text-[14rem] font-serif text-white tracking-tighter whitespace-nowrap ml-0 md:-ml-32 Arabic-Serif'>
              الجياد
            </h1>
          </div>
        </div>
      </section>

      {/* ─── ABOUT SECTION ────────────────────────────────────────────────── */}
      <section id="about" className='py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto'>
        <div className='flex flex-col md:flex-row gap-16 lg:gap-24 items-center'>
          <div className='w-full md:w-5/12 aspect-[3/4] overflow-hidden relative'>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className='w-full h-full'
            >
              <img src={Background} alt="About Architecture" className='w-full h-full object-cover' />
            </motion.div>
            <div className='absolute inset-0 border border-[var(--color-arch-dark)]/10 m-4 pointer-events-none' />
          </div>
          <div className='w-full md:w-7/12'>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className='text-3xl md:text-5xl font-serif mb-8 leading-tight Arabic-Serif'>
                <br />انضم لأزيد من
              </h2>
              <p className='text-lg font-light opacity-75 leading-relaxed max-w-xl Arabic-Sans'>
                70 + طالب
              </p>
              <h2 className='text-3xl md:text-5xl font-serif mb-8 leading-tight Arabic-Serif'>
                <br /> مؤطرين من طرف
              </h2>
              <p className='text-lg font-light opacity-75  leading-relaxed max-w-xl Arabic-Sans'>
                الأستاذ أسماعيل فخوري
                <br />
                الأستاذ بوزيان هواري
              </p>
              <h2 className='text-3xl md:text-5xl font-serif mb-8 leading-tight Arabic-Serif'>
                <br /> يوميا ما عدا الخميس و الجمعة
              </h2>
              <p className='text-lg font-light opacity-75 mb-10 leading-relaxed max-w-xl Arabic-Sans'>
                الفوج الأول:  14-16 زوالا               <br />

                الفوج الثاني:  17-18
                <br />
                أناث :  15-16:30 زوالا
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── PORTALS SECTION ──────────────────────────────────────────────── */}
      <section id="portals" className='py-24 md:py-32 bg-[var(--color-arch-gray)] px-6 md:px-12'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16 md:mb-24'>
            <h2 className='text-4xl md:text-5xl font-serif mb-4 Arabic-Serif'>بوابات الدخول</h2>
            <p className='text-lg font-light opacity-75 Arabic-Sans'>اختر الفضاء المناسب لك للمتابعة</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12'>
            {/* Teacher Portal Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className='group bg-[var(--color-arch-bg)] p-10 md:p-14 border border-[var(--color-arch-dark)]/10 hover:border-[var(--color-arch-dark)]/30 transition-colors relative overflow-hidden flex flex-col items-start'
            >
              <div className='mb-8 p-4 bg-[var(--color-arch-gray)] rounded-full text-[var(--color-arch-accent)]'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
              </div>
              <h3 className='text-3xl font-serif mb-4 Arabic-Serif'>فضاء الأساتذة</h3>
              <p className='text-base font-light opacity-75 mb-10 leading-relaxed Arabic-Sans'>
                مساحة مخصصة للمعلمين لإدارة الفصول، تتبع تقدم الطلاب، وتنظيم الجداول بكل سهولة ويسر.
              </p>
              <Redirect to="/teacherlogin" className='mt-auto w-full'>
                <button className='w-full py-4 border border-[var(--color-arch-accent)] text-[var(--color-arch-accent)] group-hover:bg-[var(--color-arch-accent)] group-hover:text-white transition-colors duration-300 Arabic-Sans flex justify-center items-center gap-2'>
                  تسجيل الدخول <ArrowLeft size={16} />
                </button>
              </Redirect>
            </motion.div>

            {/* Parent Portal Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='group bg-[var(--color-arch-bg)] p-10 md:p-14 border border-[var(--color-arch-dark)]/10 hover:border-[var(--color-arch-dark)]/30 transition-colors relative overflow-hidden flex flex-col items-start'
            >
              <div className='mb-8 p-4 bg-[var(--color-arch-gray)] rounded-full text-[var(--color-arch-accent)]'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
              </div>
              <h3 className='text-3xl font-serif mb-4 Arabic-Serif'>فضاء الأولياء</h3>
              <p className='text-base font-light opacity-75 mb-10 leading-relaxed Arabic-Sans'>
                نافذتك لمتابعة تطور أبنائك، والاطلاع على حضورهم وتقييماتهم والتواصل الفعال مع الإدارة.
              </p>
              <Redirect to="/parentlogin" className='mt-auto w-full'>
                <button className='w-full py-4 border border-[var(--color-arch-accent)] text-[var(--color-arch-accent)] group-hover:bg-[var(--color-arch-accent)] group-hover:text-white transition-colors duration-300 Arabic-Sans flex justify-center items-center gap-2'>
                  تسجيل الدخول <ArrowLeft size={16} />
                </button>
              </Redirect>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ─── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className='py-8 border-t border-[var(--color-arch-dark)]/10 text-center px-6'>
        <p className='text-sm font-light opacity-60 Arabic-Sans'>
          © {new Date().getFullYear()} مدرسة موسى بن نصير . جميع الحقوق محفوظة.
        </p>
      </footer>

    </div>
  )
}

export default LandingPage