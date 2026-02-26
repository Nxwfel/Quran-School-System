import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const TeacherAuthPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ phone_number: '', password: '' })
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
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
      className='min-h-screen w-screen bg-black flex items-center justify-center overflow-hidden relative'
      dir='rtl'
    >
      {/* Ambient background */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-700/10 rounded-full blur-[120px]' />
        <div className='absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-purple-700/10 rounded-full blur-[120px]' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-700/5 rounded-full blur-[80px]' />
      </div>

      {/* Dot grid */}
      <div
        className='absolute inset-0 pointer-events-none opacity-20'
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 80 }}
        className='relative z-10 w-full max-w-md mx-4'
      >
        <div className='bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl'>

          {/* Icon + Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className='text-center mb-10'
          >
            <div className='w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-blue-500/20 flex items-center justify-center text-4xl shadow-lg'>
              👨‍🏫
            </div>
            <h1 className='Styled text-3xl md:text-4xl text-white mb-2'>بوابة الأستاذ</h1>
            <p className='Normal text-white/50 text-base'>سجّل الدخول لإدارة طلابك ومتابعة تقدمهم</p>
          </motion.div>

          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* Phone */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <label className='block Normal text-white/60 text-sm mb-2 text-right'>رقم الهاتف</label>
              <div className='relative'>
                <input
                  type='tel' name='phone_number' value={formData.phone_number}
                  onChange={handleChange} placeholder='05xxxxxxxx' required dir='ltr'
                  className='w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3.5 Normal text-base text-right placeholder:text-white/25 focus:border-blue-500/50 focus:outline-none transition-all'
                />
                <span className='absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-lg'>📱</span>
              </div>
            </motion.div>

            {/* Password */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label className='block Normal text-white/60 text-sm mb-2 text-right'>كلمة المرور</label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'} name='password'
                  value={formData.password} onChange={handleChange} placeholder='••••••••' required
                  className='w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3.5 Normal text-base placeholder:text-white/25 focus:border-blue-500/50 focus:outline-none transition-all pr-12'
                />
                <button type='button' onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors text-lg' tabIndex={-1}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </motion.div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className='bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-center'
                >
                  <p className='Normal text-red-400 text-sm'>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <motion.button
                type='submit' disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}} whileTap={!loading ? { scale: 0.98 } : {}}
                className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-blue-800 disabled:to-purple-800 disabled:opacity-50 text-white rounded-xl py-4 Styled text-xl transition-all shadow-lg shadow-blue-900/30 mt-2'
              >
                {loading ? (
                  <span className='flex items-center justify-center gap-3'>
                    <motion.span
                      animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                      className='inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full'
                    />
                    جاري الدخول...
                  </span>
                ) : 'دخول'}
              </motion.button>
            </motion.div>
          </form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className='text-center mt-8'>
            <button onClick={() => navigate('/')}
              className='Normal text-white/40 text-sm hover:text-white/70 transition-colors flex items-center gap-2 mx-auto'>
              <span>←</span> العودة للصفحة الرئيسية
            </button>
          </motion.div>
        </div>

        <p className='Normal text-center text-white/20 text-xs mt-6'>مدرسة القرآن الكريم · بوابة الأساتذة</p>
      </motion.div>
    </div>
  )
}

export default TeacherAuthPage