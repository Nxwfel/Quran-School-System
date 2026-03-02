import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const API = 'https://quranicshooldkjudsadup9ewidu79poadwjaiok.onrender.com'

// ─── API Hook ──────────────────────────────────────────────────────────────
const useApi = () => {
  const getToken = () => {
    let t = localStorage.getItem('token')
    if (!t) {
      try { t = JSON.parse(localStorage.getItem('user') || '{}').token || '' } catch { t = '' }
    }
    if (t && t.startsWith('"') && t.endsWith('"')) {
      try { t = JSON.parse(t) } catch { }
    }
    return t
  }

  const getHeaders = (auth = true) => {
    const base = { 'Content-Type': 'application/json' }
    return auth ? { ...base, Authorization: `Bearer ${getToken()}` } : base
  }

  const request = async (method, path, body, params, auth = true) => {
    const url = params
      ? `${API}${path}?${new URLSearchParams(params)}`
      : `${API}${path}`
    const res = await fetch(url, {
      method,
      headers: getHeaders(auth),
      body: body ? JSON.stringify(body) : undefined,
    })
    if (res.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      window.location.href = '/adminlogin'
      return
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || 'حدث خطأ في الطلب')
    }
    return res.json()
  }

  return {
    get: (path, params) => request('GET', path, null, params),
    post: (path, body, auth) => request('POST', path, body, null, auth),
    put: (path, body, params) => request('PUT', path, body, params),
  }
}

// ─── Design Tokens ────────────────────────────────────────────────────────
const G = {
  // Arch Vision palette
  bg: 'var(--color-arch-bg)',
  dark: 'var(--color-arch-dark)',
  accent: 'var(--color-arch-accent)',
  gray: 'var(--color-arch-gray)',
  // keep semantic aliases used throughout
  gold: 'var(--color-arch-accent)',
  goldLight: 'var(--color-arch-dark)',
  goldDim: 'var(--color-arch-accent)',
  goldFaint: 'rgba(34,34,34,0.05)',
  goldBorder: 'rgba(0,0,0,0.08)',
  goldBorderHover: 'rgba(0,0,0,0.25)',
  bgCard: 'white',
  bgCardHover: 'rgba(34,34,34,0.03)',
  red: '#f87171',
  green: 'var(--color-arch-accent)',
  amber: 'var(--color-arch-dark)',
}

// ─── Reusable UI ──────────────────────────────────────────────────────────

const Divider = ({ label }) => (
  <div className='flex items-center gap-3 my-1'>
    <div className='flex-1 h-px' style={{ background: 'rgba(0,0,0,0.07)' }} />
    {label && <span className='Arabic-Sans text-xs' style={{ color: G.goldDim }}>{label}</span>}
    <div className='flex-1 h-px' style={{ background: 'rgba(0,0,0,0.07)' }} />
  </div>
)

const Card = ({ children, className = '', hover = false }) => (
  <motion.div
    whileHover={hover ? { borderColor: G.goldBorderHover } : {}}
    className={`p-6 ${className}`}
    style={{ background: G.bgCard, border: `1px solid ${G.goldBorder}`, transition: 'border-color 0.2s' }}
  >
    {children}
  </motion.div>
)

const SectionTitle = ({ icon, children }) => (
  <div className='flex items-center gap-3 mb-5'>
    <span className='text-xl'>{icon}</span>
    <h3 className='Styled text-2xl' style={{ color: G.goldLight }}>{children}</h3>
    <div className='flex-1 h-px' style={{ background: 'rgba(0,0,0,0.07)' }} />
  </div>
)

const Input = ({ label, value, onChange, type = 'text', placeholder = '', required = false }) => (
  <div className='flex flex-col gap-1.5'>
    {label && (
      <label className='Arabic-Sans text-xs text-right' style={{ color: G.goldDim }}>
        {label}{required && <span style={{ color: G.dark }}> *</span>}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className='w-full px-4 py-2.5 text-right Arabic-Sans outline-none transition-all duration-200 text-sm'
      style={{ background: 'white', border: `1px solid ${G.goldBorder}`, color: G.goldLight }}
      onFocus={e => { e.target.style.borderColor = G.dark }}
      onBlur={e => { e.target.style.borderColor = G.goldBorder }}
    />
  </div>
)

const SelectInput = ({ label, value, onChange, options, placeholder = 'اختر...', required = false }) => (
  <div className='flex flex-col gap-1.5'>
    {label && (
      <label className='Arabic-Sans text-xs text-right' style={{ color: G.goldDim }}>
        {label}{required && <span style={{ color: G.dark }}> *</span>}
      </label>
    )}
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
      className='w-full px-4 py-2.5 text-right Arabic-Sans outline-none text-sm appearance-none cursor-pointer'
      style={{ background: 'white', border: `1px solid ${G.goldBorder}`, color: value ? G.goldLight : G.goldDim }}
      onFocus={e => e.target.style.borderColor = G.dark}
      onBlur={e => e.target.style.borderColor = G.goldBorder}
    >
      <option value='' style={{ background: 'white', color: G.goldDim }}>{placeholder}</option>
      {options.map(o => (
        <option key={o.value} value={o.value} style={{ background: 'white', color: G.goldLight }}>{o.label}</option>
      ))}
    </select>
  </div>
)

const Btn = ({ onClick, children, variant = 'primary', disabled = false, size = 'md', type = 'button' }) => {
  const variants = {
    primary: { bg: 'var(--color-arch-dark)', border: '1px solid var(--color-arch-dark)', color: 'var(--color-arch-bg)' },
    danger: { bg: 'transparent', border: '1px solid rgba(248,113,113,0.4)', color: '#f87171' },
    ghost: { bg: 'transparent', border: `1px solid ${G.goldBorder}`, color: G.goldDim },
    success: { bg: 'transparent', border: '1px solid var(--color-arch-accent)', color: 'var(--color-arch-accent)' },
  }
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3.5 text-base' }
  const s = variants[variant]
  return (
    <motion.button
      type={type}
      whileHover={!disabled ? { opacity: 0.85 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      onClick={disabled ? undefined : onClick}
      className={`Arabic-Sans ${sizes[size]} flex items-center justify-center gap-2 transition-opacity`}
      style={{ background: s.bg, border: s.border, color: s.color, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1 }}
    >
      {children}
    </motion.button>
  )
}

const Badge = ({ children, color = 'gold' }) => {
  const colors = {
    gold: { bg: 'var(--color-arch-gray)', border: 'rgba(0,0,0,0.07)', text: 'var(--color-arch-dark)' },
    green: { bg: 'rgba(122,114,101,0.08)', border: 'rgba(122,114,101,0.2)', text: 'var(--color-arch-accent)' },
    red: { bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)', text: '#f87171' },
    amber: { bg: 'rgba(34,34,34,0.05)', border: 'rgba(34,34,34,0.12)', text: 'var(--color-arch-dark)' },
  }
  const c = colors[color]
  return (
    <span className='px-2.5 py-0.5 Arabic-Sans text-xs' style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
      {children}
    </span>
  )
}

const Toast = ({ message, type }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.95 }}
    className='fixed bottom-6 left-6 z-50 flex items-center gap-3 px-5 py-3.5 Arabic-Sans text-sm'
    style={{
      background: 'white',
      border: `1px solid ${type === 'error' ? 'rgba(248,113,113,0.35)' : 'var(--color-arch-accent)'}`,
      color: type === 'error' ? '#f87171' : 'var(--color-arch-dark)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    }}
  >
    <span className='text-lg'>{type === 'error' ? '✕' : '✓'}</span>
    {message}
  </motion.div>
)

// Table components
const Th = ({ children }) => (
  <th className='py-3 px-4 Arabic-Sans text-xs font-normal text-right whitespace-nowrap' style={{ color: G.goldDim, borderBottom: `1px solid ${G.goldBorder}` }}>
    {children}
  </th>
)
const Td = ({ children, highlight }) => (
  <td className='py-3.5 px-4 Arabic-Sans text-sm text-right' style={{ color: highlight || G.goldLight, borderBottom: `1px solid rgba(0,0,0,0.04)` }}>
    {children}
  </td>
)
const Tr = ({ children, i }) => (
  <motion.tr
    initial={{ opacity: 0, x: 15 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: i * 0.04 }}
    className='transition-colors'
    style={{ cursor: 'default' }}
    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-arch-gray)'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
  >
    {children}
  </motion.tr>
)

const EmptyState = ({ label }) => (
  <div className='py-12 flex flex-col items-center gap-3'>
    <div className='text-3xl opacity-20' style={{ color: 'var(--color-arch-dark)' }}>⌀</div>
    <p className='Arabic-Sans text-sm' style={{ color: 'var(--color-arch-accent)', opacity: 0.7 }}>{label}</p>
  </div>
)

const Spinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
    className='w-4 h-4 rounded-full border-2'
    style={{ borderColor: 'var(--color-arch-gray)', borderTopColor: 'var(--color-arch-accent)' }}
  />
)

// ─── Dashboard Stats ───────────────────────────────────────────────────────
const DashboardSection = ({ api }) => {
  const [data, setData] = useState({ teachers: [], supervisors: [], students: [], books: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [teachers, supervisors, students, books] = await Promise.all([
          api.get('/teachers/').catch(() => []),
          api.get('/supervisors/').catch(() => []),
          api.get('/students/').catch(() => []),
          api.get('/books/').catch(() => []),
        ])
        setData({ teachers, supervisors, students, books })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const stats = [
    { label: 'الأساتذة', value: Array.isArray(data.teachers) ? data.teachers.length : '—', icon: '👨‍🏫', color: '#ffd54f' },
    { label: 'المشرفون', value: Array.isArray(data.supervisors) ? data.supervisors.length : '—', icon: '🧑‍💼', color: '#80deea' },
    { label: 'الطلاب', value: Array.isArray(data.students) ? data.students.length : '—', icon: '🎓', color: '#a5d6a7' },
    { label: 'الكتب', value: Array.isArray(data.books) ? data.books.length : '—', icon: '📚', color: '#ce93d8' },
  ]

  return (
    <div className='flex flex-col gap-6' dir='rtl'>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className='rounded-2xl p-5 flex flex-col gap-2'
            style={{ background: G.bgCard, border: `1px solid ${G.goldBorder}` }}
          >
            <span className='text-2xl'>{s.icon}</span>
            <div className='Styled text-3xl' style={{ color: s.color }}>
              {loading ? <Spinner /> : s.value}
            </div>
            <div className='Normal text-xs' style={{ color: G.goldDim }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Latest teachers */}
        <Card>
          <SectionTitle icon='👨‍🏫'>آخر الأساتذة المضافين</SectionTitle>
          {loading ? <EmptyState label='جاري التحميل...' /> : (
            <div className='flex flex-col gap-2'>
              {(Array.isArray(data.teachers) ? data.teachers : []).slice(-4).reverse().map((t, i) => (
                <div key={t.id || i} className='flex items-center justify-between py-2.5 px-3 rounded-xl' style={{ background: 'rgba(0,0,0,0.2)' }}>
                  <Badge color='gold'>{t.location || 'غير محدد'}</Badge>
                  <span className='Normal text-sm' style={{ color: G.goldLight }}>{t.name}</span>
                </div>
              ))}
              {(!Array.isArray(data.teachers) || !data.teachers.length) && <EmptyState label='لا يوجد أساتذة بعد' />}
            </div>
          )}
        </Card>

        {/* Latest students */}
        <Card>
          <SectionTitle icon='🎓'>آخر الطلاب المضافين</SectionTitle>
          {loading ? <EmptyState label='جاري التحميل...' /> : (
            <div className='flex flex-col gap-2'>
              {(Array.isArray(data.students) ? data.students : []).slice(-4).reverse().map((s, i) => (
                <div key={s.id || i} className='flex items-center justify-between py-2.5 px-3 rounded-xl' style={{ background: 'rgba(0,0,0,0.2)' }}>
                  <Badge color='green'>طالب</Badge>
                  <span className='Normal text-sm' style={{ color: G.goldLight }}>{s.name}</span>
                </div>
              ))}
              {(!Array.isArray(data.students) || !data.students.length) && <EmptyState label='لا يوجد طلاب بعد' />}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

// ─── Teachers Section ──────────────────────────────────────────────────────
const TeachersSection = ({ api, toast }) => {
  const [teachers, setTeachers] = useState([])
  const [form, setForm] = useState({ name: '', location: '', phone_number: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const load = useCallback(async () => {
    setFetching(true)
    try { setTeachers(await api.get('/teachers/')) } catch (e) { toast(e.message, 'error') }
    setFetching(false)
  }, [])

  useEffect(() => { load() }, [])

  const create = async () => {
    if (!form.name || !form.phone_number || !form.password) return toast('يرجى ملء جميع الحقول المطلوبة', 'error')
    setLoading(true)
    try {
      await api.post('/teachers/', form)
      toast('تم إضافة الأستاذ بنجاح ✓')
      setForm({ name: '', location: '', phone_number: '', password: '' })
      load()
    } catch (e) { toast(e.message, 'error') }
    setLoading(false)
  }

  const remove = async (id) => {
    try {
      await api.put('/teachers/', null, { teacher_id: id })
      toast('تم حذف الأستاذ')
      load()
    } catch (e) { toast(e.message, 'error') }
  }

  return (
    <div className='flex flex-col gap-5' dir='rtl'>
      <Card>
        <SectionTitle icon='➕'>إضافة أستاذ جديد</SectionTitle>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <Input label='الاسم الكامل' value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder='اسم الأستاذ' required />
          <Input label='الموقع / المنطقة' value={form.location} onChange={v => setForm({ ...form, location: v })} placeholder='مثال: الجزائر العاصمة' />
          <Input label='رقم الهاتف' value={form.phone_number} onChange={v => setForm({ ...form, phone_number: v })} placeholder='05xxxxxxxx' required />
          <Input label='كلمة المرور' type='password' value={form.password} onChange={v => setForm({ ...form, password: v })} placeholder='••••••••' required />
        </div>
        <div className='mt-5 flex justify-end'>
          <Btn onClick={create} disabled={loading} size='md'>
            {loading ? <Spinner /> : null} إضافة الأستاذ
          </Btn>
        </div>
      </Card>

      <Card>
        <SectionTitle icon='📋'>قائمة الأساتذة</SectionTitle>
        {fetching ? <EmptyState label='جاري التحميل...' /> : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr><Th>الاسم</Th><Th>الموقع</Th><Th>الهاتف</Th><Th>إجراء</Th></tr>
              </thead>
              <tbody>
                {(Array.isArray(teachers) ? teachers : []).map((t, i) => (
                  <Tr key={t.id || i} i={i}>
                    <Td>{t.name}</Td>
                    <Td highlight={G.goldDim}>{t.location || '—'}</Td>
                    <Td highlight={G.goldDim}>{t.phone_number}</Td>
                    <td className='py-3 px-4' style={{ borderBottom: 'rgba(212,163,79,0.06) 1px solid' }}>
                      <Btn onClick={() => remove(t.id)} variant='danger' size='sm'>حذف</Btn>
                    </td>
                  </Tr>
                ))}
              </tbody>
            </table>
            {(!Array.isArray(teachers) || !teachers.length) && <EmptyState label='لا يوجد أساتذة مسجلون' />}
          </div>
        )}
      </Card>
    </div>
  )
}

// ─── Supervisors Section ───────────────────────────────────────────────────
const SupervisorsSection = ({ api, toast }) => {
  const [supervisors, setSupervisors] = useState([])
  const [form, setForm] = useState({ name: '', phone_number: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const load = useCallback(async () => {
    setFetching(true)
    try { setSupervisors(await api.get('/supervisors/')) } catch (e) { toast(e.message, 'error') }
    setFetching(false)
  }, [])

  useEffect(() => { load() }, [])

  const create = async () => {
    if (!form.name || !form.phone_number || !form.password) return toast('يرجى ملء جميع الحقول المطلوبة', 'error')
    setLoading(true)
    try {
      await api.post('/supervisors/', form)
      toast('تم إضافة المشرف بنجاح ✓')
      setForm({ name: '', phone_number: '', password: '' })
      load()
    } catch (e) { toast(e.message, 'error') }
    setLoading(false)
  }

  const remove = async (id) => {
    try {
      await api.put('/supervisors/', null, { supervisor_id: id })
      toast('تم حذف المشرف')
      load()
    } catch (e) { toast(e.message, 'error') }
  }

  return (
    <div className='flex flex-col gap-5' dir='rtl'>
      <Card>
        <SectionTitle icon='➕'>إضافة مشرف جديد</SectionTitle>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
          <Input label='الاسم الكامل' value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder='اسم المشرف' required />
          <Input label='رقم الهاتف' value={form.phone_number} onChange={v => setForm({ ...form, phone_number: v })} placeholder='05xxxxxxxx' required />
          <Input label='كلمة المرور' type='password' value={form.password} onChange={v => setForm({ ...form, password: v })} placeholder='••••••••' required />
        </div>
        <div className='mt-5 flex justify-end'>
          <Btn onClick={create} disabled={loading}>{loading ? <Spinner /> : null} إضافة المشرف</Btn>
        </div>
      </Card>

      <Card>
        <SectionTitle icon='📋'>قائمة المشرفين</SectionTitle>
        {fetching ? <EmptyState label='جاري التحميل...' /> : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead><tr><Th>الاسم</Th><Th>الهاتف</Th><Th>إجراء</Th></tr></thead>
              <tbody>
                {(Array.isArray(supervisors) ? supervisors : []).map((s, i) => (
                  <Tr key={s.id || i} i={i}>
                    <Td>{s.name}</Td>
                    <Td highlight={G.goldDim}>{s.phone_number}</Td>
                    <td className='py-3 px-4' style={{ borderBottom: 'rgba(212,163,79,0.06) 1px solid' }}>
                      <Btn onClick={() => remove(s.id)} variant='danger' size='sm'>حذف</Btn>
                    </td>
                  </Tr>
                ))}
              </tbody>
            </table>
            {(!Array.isArray(supervisors) || !supervisors.length) && <EmptyState label='لا يوجد مشرفون مسجلون' />}
          </div>
        )}
      </Card>
    </div>
  )
}

// ─── Students Section ──────────────────────────────────────────────────────
const StudentsSection = ({ api, toast }) => {
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [supervisors, setSupervisors] = useState([])
  const [form, setForm] = useState({ name: '', teacher_id: '', supervisor_id: '' })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    setFetching(true)
    try {
      const [s, t, sv] = await Promise.all([
        api.get('/students/').catch(() => []),
        api.get('/teachers/').catch(() => []),
        api.get('/supervisors/').catch(() => []),
      ])
      setStudents(s); setTeachers(t); setSupervisors(sv)
    } catch (e) { toast(e.message, 'error') }
    setFetching(false)
  }, [])

  useEffect(() => { load() }, [])

  const create = async () => {
    if (!form.name || !form.teacher_id || !form.supervisor_id) return toast('يرجى ملء جميع الحقول المطلوبة', 'error')
    setLoading(true)
    try {
      await api.post('/students/', { name: form.name, teacher_id: Number(form.teacher_id), supervisor_id: Number(form.supervisor_id) })
      toast('تم إضافة الطالب بنجاح ✓')
      setForm({ name: '', teacher_id: '', supervisor_id: '' })
      load()
    } catch (e) { toast(e.message, 'error') }
    setLoading(false)
  }

  const remove = async (id) => {
    try {
      await api.put('/students/', null, { student_id: id })
      toast('تم حذف الطالب')
      load()
    } catch (e) { toast(e.message, 'error') }
  }

  const filtered = (Array.isArray(students) ? students : []).filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  )

  const teacherMap = Object.fromEntries((Array.isArray(teachers) ? teachers : []).map(t => [t.id, t.name]))
  const supervisorMap = Object.fromEntries((Array.isArray(supervisors) ? supervisors : []).map(s => [s.id, s.name]))

  return (
    <div className='flex flex-col gap-5' dir='rtl'>
      <Card>
        <SectionTitle icon='➕'>إضافة طالب جديد</SectionTitle>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
          <Input label='اسم الطالب' value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder='اسم الطالب' required />
          <SelectInput
            label='الأستاذ'
            value={form.teacher_id}
            onChange={v => setForm({ ...form, teacher_id: v })}
            options={(Array.isArray(teachers) ? teachers : []).map(t => ({ value: t.id, label: t.name }))}
            placeholder='اختر أستاذاً'
            required
          />
          <SelectInput
            label='المشرف'
            value={form.supervisor_id}
            onChange={v => setForm({ ...form, supervisor_id: v })}
            options={(Array.isArray(supervisors) ? supervisors : []).map(s => ({ value: s.id, label: s.name }))}
            placeholder='اختر مشرفاً'
            required
          />
        </div>
        <div className='mt-5 flex justify-end'>
          <Btn onClick={create} disabled={loading}>{loading ? <Spinner /> : null} إضافة الطالب</Btn>
        </div>
      </Card>

      <Card>
        <div className='flex items-center justify-between mb-5'>
          <div className='flex items-center gap-3'>
            <span>🎓</span>
            <h3 className='Styled text-xl' style={{ color: G.goldLight }}>قائمة الطلاب</h3>
          </div>
          <div className='relative'>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='بحث...'
              className='Normal text-sm rounded-xl px-4 py-2 pr-9 outline-none w-48'
              style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${G.goldBorder}`, color: G.goldLight }}
            />
            <span className='absolute right-3 top-1/2 -translate-y-1/2 text-sm' style={{ color: G.goldDim }}>🔍</span>
          </div>
        </div>
        {fetching ? <EmptyState label='جاري التحميل...' /> : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead><tr><Th>الاسم</Th><Th>الأستاذ</Th><Th>المشرف</Th><Th>إجراء</Th></tr></thead>
              <tbody>
                {filtered.map((s, i) => (
                  <Tr key={s.id || i} i={i}>
                    <Td>{s.name}</Td>
                    <Td highlight={G.goldDim}>{teacherMap[s.teacher_id] || s.teacher_id || '—'}</Td>
                    <Td highlight={G.goldDim}>{supervisorMap[s.supervisor_id] || s.supervisor_id || '—'}</Td>
                    <td className='py-3 px-4' style={{ borderBottom: 'rgba(212,163,79,0.06) 1px solid' }}>
                      <Btn onClick={() => remove(s.id)} variant='danger' size='sm'>حذف</Btn>
                    </td>
                  </Tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && <EmptyState label={search ? 'لا توجد نتائج للبحث' : 'لا يوجد طلاب مسجلون'} />}
          </div>
        )}
      </Card>
    </div>
  )
}

// ─── Books Section ─────────────────────────────────────────────────────────
const BooksSection = ({ api, toast }) => {
  const [books, setBooks] = useState([])
  const [form, setForm] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const load = useCallback(async () => {
    setFetching(true)
    try { setBooks(await api.get('/books/')) } catch (e) { toast(e.message, 'error') }
    setFetching(false)
  }, [])

  useEffect(() => { load() }, [])

  const create = async () => {
    if (!form.name || !form.description) return toast('يرجى ملء جميع الحقول', 'error')
    setLoading(true)
    try {
      await api.post('/books/', form)
      toast('تم إضافة الكتاب بنجاح ✓')
      setForm({ name: '', description: '' })
      load()
    } catch (e) { toast(e.message, 'error') }
    setLoading(false)
  }

  const remove = async (id) => {
    try {
      await api.put('/books/', null, { book_id: id })
      toast('تم حذف الكتاب')
      load()
    } catch (e) { toast(e.message, 'error') }
  }

  return (
    <div className='flex flex-col gap-5' dir='rtl'>
      <Card>
        <SectionTitle icon='➕'>إضافة كتاب</SectionTitle>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <Input label='اسم الكتاب' value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder='اسم الكتاب' required />
          <Input label='الوصف' value={form.description} onChange={v => setForm({ ...form, description: v })} placeholder='وصف مختصر' required />
        </div>
        <div className='mt-5 flex justify-end'>
          <Btn onClick={create} disabled={loading}>{loading ? <Spinner /> : null} إضافة الكتاب</Btn>
        </div>
      </Card>

      <Card>
        <SectionTitle icon='📚'>الكتب المتاحة</SectionTitle>
        {fetching ? <EmptyState label='جاري التحميل...' /> : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead><tr><Th>الاسم</Th><Th>الوصف</Th><Th>إجراء</Th></tr></thead>
              <tbody>
                {(Array.isArray(books) ? books : []).map((b, i) => (
                  <Tr key={b.id || i} i={i}>
                    <Td>{b.name}</Td>
                    <Td highlight={G.goldDim}>{b.description}</Td>
                    <td className='py-3 px-4' style={{ borderBottom: 'rgba(212,163,79,0.06) 1px solid' }}>
                      <Btn onClick={() => remove(b.id)} variant='danger' size='sm'>حذف</Btn>
                    </td>
                  </Tr>
                ))}
              </tbody>
            </table>
            {(!Array.isArray(books) || !books.length) && <EmptyState label='لا يوجد كتب مضافة' />}
          </div>
        )}
      </Card>
    </div>
  )
}

// ─── Attendance Section ────────────────────────────────────────────────────
const AttendanceSection = ({ api, toast }) => {
  const [students, setStudents] = useState([])
  const [form, setForm] = useState({ student_id: '', present: 'true' })
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [fetchingHistory, setFetchingHistory] = useState(false)

  useEffect(() => {
    api.get('/students/').then(s => setStudents(s)).catch(() => { })
  }, [])

  const fetchHistory = async (id) => {
    if (!id) return
    setFetchingHistory(true)
    try {
      const data = await api.get('/attendances/', { student_id: id })
      setHistory(Array.isArray(data) ? data : [])
    } catch { setHistory([]) }
    setFetchingHistory(false)
  }

  const handleStudentChange = (id) => {
    setForm({ ...form, student_id: id })
    fetchHistory(id)
  }

  const create = async () => {
    if (!form.student_id) return toast('يرجى اختيار طالب', 'error')
    setLoading(true)
    try {
      await api.post('/attendances/', { student_id: Number(form.student_id), present: form.present === 'true' })
      toast('تم تسجيل الحضور بنجاح ✓')
      fetchHistory(form.student_id)
    } catch (e) { toast(e.message, 'error') }
    setLoading(false)
  }

  const studentMap = Object.fromEntries((Array.isArray(students) ? students : []).map(s => [s.id, s.name]))

  return (
    <div className='flex flex-col gap-5' dir='rtl'>
      <Card>
        <SectionTitle icon='📅'>تسجيل حضور</SectionTitle>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <SelectInput
            label='الطالب'
            value={form.student_id}
            onChange={handleStudentChange}
            options={(Array.isArray(students) ? students : []).map(s => ({ value: s.id, label: s.name }))}
            placeholder='اختر طالباً'
            required
          />
          <SelectInput
            label='الحالة'
            value={form.present}
            onChange={v => setForm({ ...form, present: v })}
            options={[{ value: 'true', label: '✓ حاضر' }, { value: 'false', label: '✗ غائب' }]}
          />
        </div>
        <div className='mt-5 flex justify-end'>
          <Btn onClick={create} disabled={loading}>{loading ? <Spinner /> : null} تسجيل</Btn>
        </div>
      </Card>

      {form.student_id && (
        <Card>
          <SectionTitle icon='📊'>
            سجل حضور {studentMap[form.student_id] || ''}
          </SectionTitle>
          {fetchingHistory ? <EmptyState label='جاري التحميل...' /> : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead><tr><Th>التاريخ</Th><Th>الحالة</Th></tr></thead>
                <tbody>
                  {history.map((a, i) => (
                    <Tr key={a.id || i} i={i}>
                      <Td>{a.date ? new Date(a.date).toLocaleDateString('ar-DZ') : '—'}</Td>
                      <Td>
                        <Badge color={a.present ? 'green' : 'red'}>{a.present ? '✓ حاضر' : '✗ غائب'}</Badge>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </table>
              {!history.length && <EmptyState label='لا توجد سجلات حضور لهذا الطالب' />}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

// ─── Progress Section ──────────────────────────────────────────────────────
const ProgressSection = ({ api, toast }) => {
  const [students, setStudents] = useState([])
  const [form, setForm] = useState({
    student_id: '', hizb: '', thomn: '', surah: '',
    from_ayah: '', to_ayah: '', type: 'حفظ', score: '', notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [fetchingHistory, setFetchingHistory] = useState(false)

  useEffect(() => {
    api.get('/students/').then(s => setStudents(s)).catch(() => { })
  }, [])

  const fetchHistory = async (id) => {
    if (!id) return
    setFetchingHistory(true)
    try {
      const data = await api.get('/progresses/', { student_id: id })
      setHistory(Array.isArray(data) ? data : [])
    } catch { setHistory([]) }
    setFetchingHistory(false)
  }

  const handleStudentChange = (id) => {
    setForm({ ...form, student_id: id })
    fetchHistory(id)
  }

  const create = async () => {
    const required = ['student_id', 'hizb', 'thomn', 'surah', 'from_ayah', 'to_ayah', 'score', 'notes']
    if (required.some(k => !form[k])) return toast('يرجى ملء جميع الحقول المطلوبة', 'error')
    setLoading(true)
    try {
      await api.post('/progresses/', { ...form, student_id: Number(form.student_id), score: Number(form.score) })
      toast('تم تسجيل التقدم بنجاح ✓')
      setForm({ ...form, hizb: '', thomn: '', surah: '', from_ayah: '', to_ayah: '', score: '', notes: '' })
      fetchHistory(form.student_id)
    } catch (e) { toast(e.message, 'error') }
    setLoading(false)
  }

  const scoreColor = (s) => s >= 85 ? G.green : s >= 60 ? G.amber : G.red

  return (
    <div className='flex flex-col gap-5' dir='rtl'>
      <Card>
        <SectionTitle icon='📖'>تسجيل تقدم الطالب</SectionTitle>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
          <div className='sm:col-span-2 md:col-span-1'>
            <SelectInput
              label='الطالب'
              value={form.student_id}
              onChange={handleStudentChange}
              options={(Array.isArray(students) ? students : []).map(s => ({ value: s.id, label: s.name }))}
              placeholder='اختر طالباً'
              required
            />
          </div>
          <Input label='الحزب' value={form.hizb} onChange={v => setForm({ ...form, hizb: v })} placeholder='مثال: ١٢' required />
          <Input label='الثمن' value={form.thomn} onChange={v => setForm({ ...form, thomn: v })} placeholder='مثال: الأول' required />
          <Input label='السورة' value={form.surah} onChange={v => setForm({ ...form, surah: v })} placeholder='مثال: البقرة' required />
          <Input label='من الآية' value={form.from_ayah} onChange={v => setForm({ ...form, from_ayah: v })} placeholder='١' required />
          <Input label='إلى الآية' value={form.to_ayah} onChange={v => setForm({ ...form, to_ayah: v })} placeholder='١٠' required />
          <SelectInput
            label='النوع'
            value={form.type}
            onChange={v => setForm({ ...form, type: v })}
            options={[{ value: 'حفظ', label: '📚 حفظ' }, { value: 'مراجعة', label: '🔄 مراجعة' }, { value: 'تلاوة', label: '📖 تلاوة' }]}
          />
          <Input label='الدرجة (0–100)' type='number' value={form.score} onChange={v => setForm({ ...form, score: v })} placeholder='مثال: 95' required />
          <div className='sm:col-span-2 md:col-span-3'>
            <Input label='ملاحظات المعلم' value={form.notes} onChange={v => setForm({ ...form, notes: v })} placeholder='أداء الطالب، نقاط القوة والضعف...' required />
          </div>
        </div>
        <div className='mt-5 flex justify-end'>
          <Btn onClick={create} disabled={loading}>{loading ? <Spinner /> : null} حفظ التقدم</Btn>
        </div>
      </Card>

      {form.student_id && (
        <Card>
          <SectionTitle icon='📊'>سجل تقدم الطالب</SectionTitle>
          {fetchingHistory ? <EmptyState label='جاري التحميل...' /> : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead><tr><Th>السورة</Th><Th>الآيات</Th><Th>النوع</Th><Th>الدرجة</Th><Th>ملاحظات</Th></tr></thead>
                <tbody>
                  {history.map((p, i) => (
                    <Tr key={p.id || i} i={i}>
                      <Td>{p.surah}</Td>
                      <Td highlight={G.goldDim}>{p.from_ayah} – {p.to_ayah}</Td>
                      <Td><Badge>{p.type}</Badge></Td>
                      <Td highlight={scoreColor(p.score)}>{p.score}</Td>
                      <Td highlight={G.goldDim}>{p.notes}</Td>
                    </Tr>
                  ))}
                </tbody>
              </table>
              {!history.length && <EmptyState label='لا توجد سجلات تقدم لهذا الطالب' />}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}

// ─── Settings Section ──────────────────────────────────────────────────────
const SettingsSection = ({ api, toast }) => {
  const [updateForm, setUpdateForm] = useState({ phone_number: '', password: '' })
  const [newAdminForm, setNewAdminForm] = useState({ phone_number: '', password: '' })
  const [loading, setLoading] = useState({ update: false, create: false })

  const updateAdmin = async () => {
    if (!updateForm.phone_number && !updateForm.password) return toast('أدخل بياناً واحداً على الأقل للتحديث', 'error')
    setLoading(l => ({ ...l, update: true }))
    try {
      await api.put('/admins/', { phone_number: updateForm.phone_number || null, password: updateForm.password || null })
      toast('تم تحديث بيانات الإدارة ✓')
      setUpdateForm({ phone_number: '', password: '' })
    } catch (e) { toast(e.message, 'error') }
    setLoading(l => ({ ...l, update: false }))
  }

  const createAdmin = async () => {
    if (!newAdminForm.phone_number || !newAdminForm.password) return toast('يرجى ملء جميع الحقول', 'error')
    setLoading(l => ({ ...l, create: true }))
    try {
      await api.post('/admins/', newAdminForm, false)
      toast('تم إنشاء حساب المشرف الجديد ✓')
      setNewAdminForm({ phone_number: '', password: '' })
    } catch (e) { toast(e.message, 'error') }
    setLoading(l => ({ ...l, create: false }))
  }

  return (
    <div className='flex flex-col gap-5 max-w-xl' dir='rtl'>
      <Card>
        <SectionTitle icon='🔐'>تحديث بيانات الحساب</SectionTitle>
        <p className='Normal text-xs mb-4' style={{ color: G.goldDim }}>اترك الحقل فارغاً إذا لم ترد تغييره</p>
        <div className='flex flex-col gap-3'>
          <Input label='رقم الهاتف الجديد' value={updateForm.phone_number} onChange={v => setUpdateForm({ ...updateForm, phone_number: v })} placeholder='05xxxxxxxx' />
          <Input label='كلمة المرور الجديدة' type='password' value={updateForm.password} onChange={v => setUpdateForm({ ...updateForm, password: v })} placeholder='••••••••' />
        </div>
        <div className='mt-5 flex justify-end'>
          <Btn onClick={updateAdmin} disabled={loading.update}>{loading.update ? <Spinner /> : null} تحديث</Btn>
        </div>
      </Card>

      <Card>
        <SectionTitle icon='👤'>إضافة مشرف جديد</SectionTitle>
        <div className='flex flex-col gap-3'>
          <Input label='رقم الهاتف' value={newAdminForm.phone_number} onChange={v => setNewAdminForm({ ...newAdminForm, phone_number: v })} placeholder='05xxxxxxxx' required />
          <Input label='كلمة المرور' type='password' value={newAdminForm.password} onChange={v => setNewAdminForm({ ...newAdminForm, password: v })} placeholder='••••••••' required />
        </div>
        <div className='mt-5 flex justify-end'>
          <Btn onClick={createAdmin} disabled={loading.create}>{loading.create ? <Spinner /> : null} إنشاء حساب</Btn>
        </div>
      </Card>
    </div>
  )
}

// ─── Navigation Config ─────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'dashboard', label: 'نظرة عامة', icon: '◈' },
  { id: 'teachers', label: 'الأساتذة', icon: '👨‍🏫' },
  { id: 'supervisors', label: 'المشرفون', icon: '🧑‍💼' },
  { id: 'students', label: 'الطلاب', icon: '🎓' },
  { id: 'books', label: 'الكتب', icon: '📚' },
  { id: 'attendance', label: 'الحضور', icon: '📅' },
  { id: 'progress', label: 'التقدم', icon: '📈' },
  { id: 'settings', label: 'الإعدادات', icon: '⚙️' },
]

// ─── Main Component ────────────────────────────────────────────────────────
const AdminPage = () => {
  const [active, setActive] = useState('dashboard')
  const [toastState, setToastState] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const api = useApi()

  const showToast = (message, type = 'success') => {
    setToastState({ message, type })
    setTimeout(() => setToastState(null), 3500)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/adminlogin')
  }

  const renderSection = () => {
    const props = { api, toast: showToast }
    const map = {
      dashboard: <DashboardSection {...props} />,
      teachers: <TeachersSection {...props} />,
      supervisors: <SupervisorsSection {...props} />,
      students: <StudentsSection {...props} />,
      books: <BooksSection {...props} />,
      attendance: <AttendanceSection {...props} />,
      progress: <ProgressSection {...props} />,
      settings: <SettingsSection {...props} />,
    }
    return map[active] || null
  }

  const current = SECTIONS.find(s => s.id === active)

  return (
    <div
      className='min-h-screen w-screen flex overflow-hidden'
      style={{ background: 'var(--color-arch-bg)' }}
      dir='rtl'
    >

      {/* ── Sidebar ── */}
      <motion.aside
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='fixed right-0 top-0 h-screen w-60 z-30 hidden md:flex flex-col'
        style={{ background: 'var(--color-arch-bg)', borderLeft: '1px solid rgba(0,0,0,0.08)' }}
      >
        {/* Logo */}
        <div className='px-6 pt-8 pb-6 flex flex-col items-center gap-2' style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <h1 className='Styled text-xl text-center leading-tight' style={{ color: 'var(--color-arch-dark)' }}>مدرسة موسى بن نصير</h1>
          <span className='Arabic-Sans text-xs' style={{ color: 'var(--color-arch-accent)' }}>لوحة الإدارة</span>
        </div>

        {/* Nav */}
        <nav className='flex-1 px-3 py-4 overflow-y-auto flex flex-col gap-0.5'>
          {SECTIONS.map((s, i) => {
            const isActive = active === s.id
            return (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setActive(s.id)}
                className='relative flex items-center gap-3 px-4 py-2.5 w-full text-right Arabic-Sans text-sm transition-all duration-200'
                style={{
                  background: isActive ? 'var(--color-arch-dark)' : 'transparent',
                  border: '1px solid transparent',
                  color: isActive ? 'var(--color-arch-bg)' : 'var(--color-arch-accent)',
                }}
              >
                <span className='text-base'>{s.icon}</span>
                <span>{s.label}</span>
              </motion.button>
            )
          })}
        </nav>

        {/* Logout */}
        <div className='p-4' style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={logout}
            className='w-full flex items-center justify-center gap-2 py-2.5 Arabic-Sans text-sm transition-colors'
            style={{ background: 'transparent', border: '1px solid var(--color-arch-dark)', color: 'var(--color-arch-dark)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-arch-dark)'; e.currentTarget.style.color = 'var(--color-arch-bg)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-arch-dark)' }}
          >
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-4 h-4'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9' />
            </svg>
            تسجيل الخروج
          </motion.button>
        </div>
      </motion.aside>

      {/* ── Mobile Top Bar ── */}
      <div
        className='fixed top-0 right-0 left-0 z-20 flex md:hidden items-center justify-between px-4 py-3'
        style={{ background: 'var(--color-arch-bg)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}
      >
        <button onClick={logout} style={{ color: 'var(--color-arch-accent)' }}>
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9' />
          </svg>
        </button>
        <h1 className='Styled text-lg' style={{ color: 'var(--color-arch-dark)' }}>مدرسة موسى بن نصير</h1>
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ color: 'var(--color-arch-accent)' }}>
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-5 h-5'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className='fixed inset-0 z-40 md:hidden'
            style={{ background: 'var(--color-arch-bg)' }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className='absolute top-5 left-5 Arabic-Sans text-lg'
              style={{ color: 'var(--color-arch-accent)' }}
            >✕</button>
            <div className='flex flex-col items-center justify-center h-full gap-3'>
              {SECTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setActive(s.id); setMobileOpen(false) }}
                  className='flex items-center gap-3 px-8 py-3 Arabic-Sans text-lg w-56 justify-center'
                  style={{
                    color: active === s.id ? 'var(--color-arch-bg)' : 'var(--color-arch-dark)',
                    background: active === s.id ? 'var(--color-arch-dark)' : 'transparent',
                    border: `1px solid ${active === s.id ? 'var(--color-arch-dark)' : 'rgba(0,0,0,0.08)'}`,
                  }}
                >
                  <span>{s.icon}</span><span>{s.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <main className='flex-1 md:mr-60 min-h-screen flex flex-col'>
        {/* Page header */}
        <div
          className='sticky top-0 z-10 px-6 md:px-10 py-4 flex items-center justify-between'
          style={{ background: 'var(--color-arch-bg)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}
        >
          <div className='flex items-center gap-3'>
            <span className='text-xl'>{current?.icon}</span>
            <div>
              <h2 className='Styled text-2xl' style={{ color: 'var(--color-arch-dark)' }}>{current?.label}</h2>
              <div className='h-px mt-1 w-16' style={{ background: 'var(--color-arch-accent)' }} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='flex-1 p-5 md:p-8 mt-14 md:mt-0 overflow-y-auto'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Toast */}
      <AnimatePresence>
        {toastState && <Toast message={toastState.message} type={toastState.type} />}
      </AnimatePresence>
    </div>
  )
}

export default AdminPage