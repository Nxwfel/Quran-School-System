import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

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
      className='min-h-screen w-full flex items-center justify-center overflow-hidden'
      style={{ background: 'var(--color-arch-bg)' }}
      dir='rtl'
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 90 }}
        className='w-full max-w-md mx-4'
      >
        {/* Header */}
        <div className='text-center mb-10'>
          <h1 className='Styled mb-2' style={{ fontSize: 'clamp(2rem,6vw,3rem)', color: 'var(--color-arch-dark)', lineHeight: 1.15 }}>
            لوحة الإدارة
          </h1>
          <p className='Arabic-Sans text-sm' style={{ color: 'var(--color-arch-accent)' }}>
            تسجيل دخول المشرف
          </p>
        </div>

        <div className='p-8 md:p-10' style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)' }}>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            {/* Phone */}
            <div className='flex flex-col gap-1.5'>
              <label className='Arabic-Sans text-xs text-right' style={{ color: 'var(--color-arch-accent)' }}>
                رقم الهاتف
              </label>
              <input
                type='tel'
                value={form.phone_number}
                onChange={e => { setForm({ ...form, phone_number: e.target.value }); setError('') }}
                placeholder='+213 ...'
                dir='ltr'
                className='w-full border text-right Arabic-Sans outline-none transition-all duration-200 text-sm'
                style={{ padding: '12px 16px', borderColor: 'rgba(0,0,0,0.1)', background: 'var(--color-arch-bg)', color: 'var(--color-arch-dark)' }}
                onFocus={e => e.target.style.borderColor = 'var(--color-arch-dark)'}
                onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            {/* Password */}
            <div className='flex flex-col gap-1.5'>
              <label className='Arabic-Sans text-xs text-right' style={{ color: 'var(--color-arch-accent)' }}>
                كلمة المرور
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => { setForm({ ...form, password: e.target.value }); setError('') }}
                  placeholder='••••••••'
                  className='w-full border Arabic-Sans outline-none transition-all duration-200 text-sm'
                  style={{ padding: '12px 40px 12px 16px', borderColor: 'rgba(0,0,0,0.1)', background: 'var(--color-arch-bg)', color: 'var(--color-arch-dark)' }}
                  onFocus={e => e.target.style.borderColor = 'var(--color-arch-dark)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
                <button
                  type='button'
                  tabIndex={-1}
                  onClick={() => setShowPassword(v => !v)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 transition-colors text-base'
                  style={{ color: 'var(--color-arch-accent)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-arch-dark)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--color-arch-accent)'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className='px-4 py-2.5 Arabic-Sans text-xs text-center'
                  style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.25)', color: '#f87171' }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type='submit'
              disabled={loading}
              whileHover={!loading ? { opacity: 0.85 } : {}}
              whileTap={!loading ? { scale: 0.97 } : {}}
              className='w-full py-4 Arabic-Sans text-lg mt-1 flex items-center justify-center gap-2'
              style={{
                background: 'var(--color-arch-dark)',
                color: 'var(--color-arch-bg)',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.2s',
              }}
            >
              {loading ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                  className='inline-block w-4 h-4 rounded-full border-2'
                  style={{ borderColor: 'rgba(243,239,231,0.3)', borderTopColor: 'var(--color-arch-bg)' }}
                />
              ) : 'دخول'}
            </motion.button>
          </form>
        </div>

        {/* Back */}
        <div className='text-center mt-8'>
          <button
            onClick={() => navigate('/')}
            className='Arabic-Sans text-xs flex items-center gap-1.5 transition-colors mx-auto'
            style={{ color: 'var(--color-arch-accent)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-arch-dark)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-arch-accent)'}
          >
            <span>←</span> العودة للصفحة الرئيسية
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminAuthPage