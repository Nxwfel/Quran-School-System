import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const G = {
  gold: '#d4a34f',
  goldLight: '#f0deb0',
  goldDim: 'rgba(212,163,79,0.5)',
  goldFaint: 'rgba(212,163,79,0.08)',
  goldBorder: 'rgba(212,163,79,0.2)',
  goldBorderHover: 'rgba(212,163,79,0.5)',
  bg: '#13100a',
}

const AdminAuthPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ phone_number: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!form.phone_number || !form.password) {
      setError('يرجى إدخال رقم الهاتف وكلمة المرور')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('https://quranicshooldkjudsadup9ewidu79poadwjaiok.onrender.com/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'فشل تسجيل الدخول')

      const token = data.access_token || data.token || data
      localStorage.setItem('token', typeof token === 'string' ? token : JSON.stringify(token))
      localStorage.setItem('role', 'admin')

      navigate('/admin')
    } catch (err) {
      setError(err.message || 'حدث خطأ، حاول مجدداً')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className='min-h-screen w-screen flex items-center justify-center overflow-hidden relative'
      style={{ background: G.bg }}
      dir='rtl'
    >
      {/* Background texture */}
      <div
        className='absolute inset-0 pointer-events-none opacity-[0.03]'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' stroke='%23d4a34f' stroke-width='0.4' opacity='0.3'%3E%3Cpolygon points='30,2 58,15 58,45 30,58 2,45 2,15'/%3E%3Cpolygon points='30,10 50,20 50,40 30,50 10,40 10,20'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Ambient radial glow */}
      <div
        className='absolute inset-0 pointer-events-none'
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(212,163,79,0.07), transparent)' }}
      />

      {/* Slow rotating rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full pointer-events-none'
        style={{ border: `1px solid rgba(212,163,79,0.06)` }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 130, repeat: Infinity, ease: 'linear' }}
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full pointer-events-none'
        style={{ border: `1px dashed rgba(212,163,79,0.08)` }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 80 }}
        className='relative z-10 w-full max-w-sm mx-4'
      >
        <div
          className='rounded-3xl overflow-hidden'
          style={{
            background: 'rgba(10,8,4,0.85)',
            border: `1px solid ${G.goldBorder}`,
            backdropFilter: 'blur(24px)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(212,163,79,0.1)',
          }}
        >
          {/* Inner top border accent */}
          <div className='h-px w-full' style={{ background: `linear-gradient(to left, transparent, ${G.gold}, transparent)`, opacity: 0.3 }} />

          <div className='px-8 pt-10 pb-10 flex flex-col items-center gap-8'>
            {/* Emblem */}
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.25, type: 'spring', stiffness: 120 }}
              className='flex flex-col items-center gap-3'
            >
              <div
                className='w-16 h-16 rounded-2xl flex items-center justify-center'
                style={{
                  background: G.goldFaint,
                  border: `1px solid ${G.goldBorder}`,
                  boxShadow: `0 0 40px rgba(212,163,79,0.12)`,
                }}
              >
                <span className='text-3xl' style={{ color: G.gold }}>✦</span>
              </div>
              <div className='flex flex-col items-center gap-1'>
                <h1 className='Styled text-3xl' style={{ color: G.goldLight, textShadow: '0 2px 20px rgba(212,163,79,0.2)' }}>
                  لوحة الإدارة
                </h1>
                <div className='h-px w-20' style={{ background: `linear-gradient(to left, transparent, ${G.gold}, transparent)` }} />
                <p className='Normal text-xs' style={{ color: G.goldDim }}>تسجيل دخول المشرف</p>
              </div>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4'>
              {/* Phone */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className='flex flex-col gap-1.5'
              >
                <label className='Normal text-xs text-right' style={{ color: G.goldDim }}>
                  رقم الهاتف
                </label>
                <input
                  type='tel'
                  value={form.phone_number}
                  onChange={e => { setForm({ ...form, phone_number: e.target.value }); setError('') }}
                  placeholder='+213 ...'
                  dir='ltr'
                  className='w-full rounded-xl px-4 py-3 text-right Normal outline-none transition-all duration-200 text-sm'
                  style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${G.goldBorder}`, color: G.goldLight }}
                  onFocus={e => { e.target.style.borderColor = G.goldBorderHover; e.target.style.background = 'rgba(212,163,79,0.04)' }}
                  onBlur={e => { e.target.style.borderColor = G.goldBorder; e.target.style.background = 'rgba(0,0,0,0.4)' }}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.42 }}
                className='flex flex-col gap-1.5'
              >
                <label className='Normal text-xs text-right' style={{ color: G.goldDim }}>
                  كلمة المرور
                </label>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => { setForm({ ...form, password: e.target.value }); setError('') }}
                    placeholder='••••••••'
                    className='w-full rounded-xl px-4 py-3 Normal outline-none transition-all duration-200 text-sm pr-11'
                    style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${G.goldBorder}`, color: G.goldLight }}
                    onFocus={e => { e.target.style.borderColor = G.goldBorderHover; e.target.style.background = 'rgba(212,163,79,0.04)' }}
                    onBlur={e => { e.target.style.borderColor = G.goldBorder; e.target.style.background = 'rgba(0,0,0,0.4)' }}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  />
                  <button
                    type='button'
                    tabIndex={-1}
                    onClick={() => setShowPassword(v => !v)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 transition-colors text-base'
                    style={{ color: G.goldDim }}
                    onMouseEnter={e => e.currentTarget.style.color = G.goldLight}
                    onMouseLeave={e => e.currentTarget.style.color = G.goldDim}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </motion.div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className='px-4 py-2.5 rounded-xl Normal text-xs text-center'
                    style={{ background: 'rgba(229,115,115,0.08)', border: '1px solid rgba(229,115,115,0.25)', color: '#ef9a9a' }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  type='submit'
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.97 } : {}}
                  className='w-full py-3.5 rounded-xl Styled text-base mt-1 flex items-center justify-center gap-2'
                  style={{
                    background: loading
                      ? 'rgba(212,163,79,0.08)'
                      : 'linear-gradient(135deg, rgba(212,163,79,0.28), rgba(212,163,79,0.12))',
                    border: `1px solid ${loading ? G.goldBorder : 'rgba(212,163,79,0.45)'}`,
                    color: loading ? G.goldDim : G.goldLight,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: loading ? 'none' : '0 4px 24px rgba(212,163,79,0.08)',
                    transition: 'all 0.2s',
                  }}
                >
                  {loading ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                      className='inline-block w-4 h-4 rounded-full border-2 border-transparent'
                      style={{ borderTopColor: G.gold }}
                    />
                  ) : (
                    'دخول'
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Back */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              onClick={() => navigate('/')}
              className='Normal text-xs flex items-center gap-1.5 transition-colors'
              style={{ color: 'rgba(212,163,79,0.3)' }}
              onMouseEnter={e => e.currentTarget.style.color = G.goldDim}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(212,163,79,0.3)'}
            >
              <span>←</span> العودة للصفحة الرئيسية
            </motion.button>
          </div>

          {/* Inner bottom border accent */}
          <div className='h-px w-full' style={{ background: `linear-gradient(to left, transparent, ${G.gold}, transparent)`, opacity: 0.1 }} />
        </div>

        <p className='Normal text-center text-xs mt-5' style={{ color: 'rgba(212,163,79,0.18)' }}>
          مدرسة الجياد للقرآن الكريم · بوابة الإدارة
        </p>
      </motion.div>
    </div>
  )
}

export default AdminAuthPage