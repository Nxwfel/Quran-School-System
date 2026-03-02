import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const TeacherAuthPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ phone_number: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        'https://quranicshooldkjudsadup9ewidu79poadwjaiok.onrender.com/users/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        const msg = Array.isArray(data?.detail)
          ? data.detail.map(d => d.msg).join(', ')
          : data?.detail || 'فشل تسجيل الدخول. تحقق من بياناتك.'
        throw new Error(msg)
      }

      // ── Extract token ────────────────────────────────────────────────────
      // The API may return:
      //   • A plain string  (the token itself)
      //   • { access_token: "..." }   (OAuth2 standard)
      //   • { token: "..." }           (common alternative)
      let tokenStr =
        (typeof data === 'string' ? data : null) ??
        data?.access_token ??
        data?.token ??
        data?.jwt ??
        null

      if (!tokenStr || typeof tokenStr !== 'string') {
        throw new Error('لم يتم استلام رمز المصادقة من الخادم.')
      }

      // Strip accidental double-encoding: '"eyJ..."' → 'eyJ...'
      if (tokenStr.startsWith('"') && tokenStr.endsWith('"')) {
        try { tokenStr = JSON.parse(tokenStr) } catch { /* keep as-is */ }
      }

      const user = {
        role: 'teacher',
        token: tokenStr,
        phone_number: formData.phone_number,
        ...(typeof data === 'object' ? (data.user || {}) : {}),
      }

      // Store raw string — NOT JSON.stringify'd — so getToken() reads it cleanly
      localStorage.setItem('token', tokenStr)
      localStorage.setItem('user', JSON.stringify(user))

      navigate('/teacher')
    } catch (err) {
      setError(err.message || 'حدث خطأ ما، حاول مجدداً')
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
            بوابة الأستاذ
          </h1>
          <p className='Arabic-Sans text-sm' style={{ color: 'var(--color-arch-accent)' }}>
            سجّل الدخول لإدارة طلابك ومتابعة تقدمهم
          </p>
        </div>

        <div className='p-8 md:p-10' style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)' }}>
          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* Phone */}
            <div>
              <label className='block Arabic-Sans text-xs mb-2 text-right' style={{ color: 'var(--color-arch-accent)' }}>رقم الهاتف</label>
              <input
                type='tel' name='phone_number' value={formData.phone_number}
                onChange={handleChange} placeholder='05xxxxxxxx' required dir='ltr'
                className='w-full border text-right Arabic-Sans text-base outline-none transition-all'
                style={{ padding: '12px 16px', borderColor: 'rgba(0,0,0,0.1)', background: 'var(--color-arch-bg)', color: 'var(--color-arch-dark)' }}
                onFocus={e => e.target.style.borderColor = 'var(--color-arch-dark)'}
                onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
              />
            </div>

            {/* Password */}
            <div>
              <label className='block Arabic-Sans text-xs mb-2 text-right' style={{ color: 'var(--color-arch-accent)' }}>كلمة المرور</label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'} name='password'
                  value={formData.password} onChange={handleChange} placeholder='••••••••' required
                  className='w-full border Arabic-Sans text-base outline-none transition-all'
                  style={{ padding: '12px 40px 12px 16px', borderColor: 'rgba(0,0,0,0.1)', background: 'var(--color-arch-bg)', color: 'var(--color-arch-dark)' }}
                  onFocus={e => e.target.style.borderColor = 'var(--color-arch-dark)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
                />
                <button type='button' onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 transition-colors text-base'
                  style={{ color: 'var(--color-arch-accent)' }} tabIndex={-1}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className='border px-4 py-3 text-center'
                  style={{ borderColor: 'rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.05)' }}
                >
                  <p className='Arabic-Sans text-sm' style={{ color: '#f87171' }}>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type='submit' disabled={loading}
              whileHover={!loading ? { opacity: 0.85 } : {}} whileTap={!loading ? { scale: 0.98 } : {}}
              className='w-full py-4 Arabic-Sans text-lg transition-all mt-2 flex items-center justify-center gap-3'
              style={{ background: 'var(--color-arch-dark)', color: 'var(--color-arch-bg)', opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className='inline-block w-5 h-5 border-2 rounded-full'
                    style={{ borderColor: 'rgba(243,239,231,0.3)', borderTopColor: 'var(--color-arch-bg)' }}
                  />
                  جاري الدخول...
                </>
              ) : 'دخول'}
            </motion.button>
          </form>
        </div>

        {/* Back */}
        <div className='text-center mt-8'>
          <button
            onClick={() => navigate('/')}
            className='Arabic-Sans text-sm transition-colors flex items-center gap-2 mx-auto'
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

export default TeacherAuthPage