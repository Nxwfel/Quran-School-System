import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const API = 'https://quranicshooldkjudsadup9ewidu79poadwjaiok.onrender.com'

// ─── Token helper ─────────────────────────────────────────────────────────
// Module-level — no closure issues, always reads fresh from localStorage.
const getToken = () => {
  let t = localStorage.getItem('token') || ''
  // Strip accidental double-encoding: '"eyJ..."' → 'eyJ...'
  if (t.startsWith('"') && t.endsWith('"')) {
    try { t = JSON.parse(t) } catch { /* keep as-is */ }
  }
  // Fallback: pull from user object
  if (!t) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      t = user.token || ''
    } catch { /* ignore */ }
  }
  return t
}

// ─── API Hook ─────────────────────────────────────────────────────────────
// Returns a single stable object (via useRef).
// getToken() is invoked at *request time* — always reads the latest token.
const useApi = () => {
  const apiRef = useRef(null)
  if (!apiRef.current) {
    const request = async (method, path, body, params) => {
      const url = params
        ? `${API}${path}?${new URLSearchParams(params)}`
        : `${API}${path}`
      const token = getToken()
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      })
      if (res.status === 401) {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        window.location.href = '/teacherlogin'
        return
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        const msg = Array.isArray(err.detail)
          ? err.detail.map(d => d.msg).join(', ')
          : err.detail || 'حدث خطأ في الطلب'
        throw new Error(msg)
      }
      return res.json()
    }
    apiRef.current = {
      get:  (path, params) => request('GET',  path, null, params),
      post: (path, body)   => request('POST', path, body),
    }
  }
  return apiRef.current
}

// ─── Toast ────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.95 }}
    onClick={onClose}
    className='fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-2xl text-sm cursor-pointer select-none'
    style={{
      background: type === 'error' ? 'rgba(20,5,5,0.97)' : 'rgba(5,15,10,0.97)',
      border: `1px solid ${type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.4)'}`,
      color: type === 'error' ? '#fca5a5' : '#86efac',
      backdropFilter: 'blur(20px)',
      boxShadow: `0 8px 32px ${type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)'}`,
    }}
  >
    <span className='text-base'>{type === 'error' ? '✕' : '✓'}</span>
    <span className='Normal'>{message}</span>
    <span className='text-xs opacity-40 mr-2'>اضغط للإغلاق</span>
  </motion.div>
)

// ─── Stat Card ────────────────────────────────────────────────────────────
const StatCard = ({ icon, value, label, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: 'spring', stiffness: 80 }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className='rounded-2xl p-6 flex flex-col gap-3'
    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
  >
    <div className='text-3xl'>{icon}</div>
    <div className='Styled text-4xl' style={{ color }}>{value}</div>
    <div className='Normal text-sm' style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</div>
  </motion.div>
)

// ─── Empty State ──────────────────────────────────────────────────────────
const Empty = ({ label }) => (
  <div className='py-16 flex flex-col items-center gap-3'>
    <div className='text-4xl opacity-20'>◌</div>
    <p className='Normal text-sm' style={{ color: 'rgba(255,255,255,0.25)' }}>{label}</p>
  </div>
)

// ─── Spinner ──────────────────────────────────────────────────────────────
const Spin = ({ color = 'rgba(99,102,241,0.8)' }) => (
  <motion.span
    animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    className='inline-block w-4 h-4 rounded-full border-2 border-transparent'
    style={{ borderTopColor: color }}
  />
)

// ─── Score Badge ──────────────────────────────────────────────────────────
const ScoreBadge = ({ score }) => {
  const color  = score >= 85 ? '#86efac' : score >= 60 ? '#fde68a' : '#fca5a5'
  const bg     = score >= 85 ? 'rgba(34,197,94,0.1)'  : score >= 60 ? 'rgba(234,179,8,0.1)'  : 'rgba(239,68,68,0.1)'
  const border = score >= 85 ? 'rgba(34,197,94,0.3)'  : score >= 60 ? 'rgba(234,179,8,0.3)'  : 'rgba(239,68,68,0.3)'
  return (
    <span className='Normal text-xs px-2.5 py-1 rounded-full'
      style={{ background: bg, border: `1px solid ${border}`, color }}>
      {score}
    </span>
  )
}

// ─── Form fields ──────────────────────────────────────────────────────────
const Input = ({ label, value, onChange, type = 'text', placeholder = '', required = false, min, max }) => (
  <div className='flex flex-col gap-1.5'>
    {label && (
      <label className='Normal text-xs text-right' style={{ color: 'rgba(255,255,255,0.35)' }}>
        {label}{required && <span style={{ color: '#818cf8' }}> *</span>}
      </label>
    )}
    <input type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} min={min} max={max}
      className='w-full rounded-xl px-4 py-2.5 text-right Normal outline-none text-sm transition-all duration-200'
      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', color: 'white' }}
      onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.background = 'rgba(99,102,241,0.04)' }}
      onBlur={e  => { e.target.style.borderColor = 'rgba(255,255,255,0.07)'; e.target.style.background = 'rgba(0,0,0,0.3)' }}
    />
  </div>
)

const SelectField = ({ label, value, onChange, options, placeholder = 'اختر...' }) => (
  <div className='flex flex-col gap-1.5'>
    {label && <label className='Normal text-xs text-right' style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</label>}
    <select value={value} onChange={e => onChange(e.target.value)}
      className='w-full rounded-xl px-4 py-2.5 text-right Normal outline-none text-sm appearance-none cursor-pointer'
      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', color: value ? 'white' : 'rgba(255,255,255,0.3)' }}
      onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
      onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
    >
      <option value='' style={{ background: '#0a0a0f', color: 'rgba(255,255,255,0.3)' }}>{placeholder}</option>
      {options.map(o => (
        <option key={o.value} value={o.value} style={{ background: '#0a0a0f', color: 'white' }}>{o.label}</option>
      ))}
    </select>
  </div>
)

const Textarea = ({ label, value, onChange, placeholder = '', rows = 4 }) => (
  <div className='flex flex-col gap-1.5'>
    {label && <label className='Normal text-xs text-right' style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</label>}
    <textarea value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} rows={rows}
      className='w-full rounded-xl px-4 py-3 text-right Normal outline-none text-sm resize-none transition-all duration-200'
      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', color: 'white' }}
      onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.background = 'rgba(99,102,241,0.04)' }}
      onBlur={e  => { e.target.style.borderColor = 'rgba(255,255,255,0.07)'; e.target.style.background = 'rgba(0,0,0,0.3)' }}
    />
  </div>
)

// ─── Layout ───────────────────────────────────────────────────────────────
const Section = ({ children }) => (
  <div className='rounded-2xl p-6 md:p-8'
    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
    {children}
  </div>
)

const SectionTitle = ({ icon, children }) => (
  <div className='flex items-center gap-3 mb-6'>
    <span className='text-lg'>{icon}</span>
    <h3 className='Styled text-xl text-white'>{children}</h3>
    <div className='flex-1 h-px' style={{ background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.06))' }} />
  </div>
)

const tabAnim = {
  initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },   transition: { duration: 0.25 },
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────
const DashboardTab = ({ students, loadingStudents }) => (
  <motion.div key='dashboard' {...tabAnim} className='flex flex-col gap-6'>
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
      <StatCard icon='👥' value={loadingStudents ? '...' : students.length} label='إجمالي الطلاب' color='#818cf8' delay={0} />
      <StatCard icon='📖' value={loadingStudents ? '...' : students.length > 0 ? 'نشط' : '—'} label='حالة الفصل' color='#86efac' delay={0.07} />
      <StatCard icon='🕌'
        value={new Date().toLocaleDateString('ar-SA', { weekday: 'long' })}
        label={new Date().toLocaleDateString('ar-SA')} color='#fde68a' delay={0.14} />
    </div>
    <Section>
      <SectionTitle icon='👥'>نظرة على الطلاب</SectionTitle>
      {loadingStudents ? (
        <div className='flex justify-center py-16'><Spin /></div>
      ) : students.length === 0 ? (
        <Empty label='لا يوجد طلاب مسجلون' />
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          {students.map((s, i) => (
            <motion.div key={s.id}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className='flex items-center gap-4 p-4 rounded-xl'
              style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className='w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0'
                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(147,51,234,0.3))' }}>👤</div>
              <div className='flex-1 min-w-0'>
                <p className='Styled text-sm text-white truncate'>{s.name}</p>
                <p className='Normal text-xs mt-0.5' style={{ color: 'rgba(255,255,255,0.35)' }}>طالب #{s.id}</p>
              </div>
              <span className='Normal text-xs px-2.5 py-1 rounded-full flex-shrink-0'
                style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc' }}>
                مسجل
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </Section>
  </motion.div>
)

// ─── Students Tab ─────────────────────────────────────────────────────────
const StudentsTab = ({ students, loading, searchQuery, setSearchQuery }) => {
  const filtered = students.filter(s => s.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  return (
    <motion.div key='students' {...tabAnim} className='flex flex-col gap-5'>
      <div className='relative max-w-md mx-auto w-full'>
        <input type='text' value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          placeholder='ابحث عن طالب...'
          className='w-full rounded-2xl px-5 py-3.5 pr-12 Normal text-sm outline-none transition-all text-white'
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.4)'}
          onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor'
          className='w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2' style={{ color: 'rgba(255,255,255,0.25)' }}>
          <path strokeLinecap='round' strokeLinejoin='round' d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z' />
        </svg>
      </div>
      {loading ? (
        <div className='flex justify-center py-20'><Spin /></div>
      ) : filtered.length === 0 ? (
        <Empty label={searchQuery ? 'لا توجد نتائج' : 'لا يوجد طلاب مسجلون'} />
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filtered.map((student, i) => (
            <motion.div key={student.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className='rounded-2xl p-5 flex flex-col gap-4'
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className='flex items-center justify-between'>
                <div className='w-12 h-12 rounded-xl flex items-center justify-center text-2xl'
                  style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(147,51,234,0.25))' }}>👤</div>
                <span className='Normal text-xs px-2 py-1 rounded-full'
                  style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc' }}>
                  #{student.id}
                </span>
              </div>
              <div>
                <h3 className='Styled text-lg text-white'>{student.name}</h3>
                <p className='Normal text-xs mt-1' style={{ color: 'rgba(255,255,255,0.35)' }}>
                  المشرف: {student.supervisor_id || '—'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Attendance Tab ───────────────────────────────────────────────────────
const AttendanceTab = ({ students, api, toast }) => {
  const [attendance, setAttendance] = useState({})
  const [saving,     setSaving]     = useState(false)
  const [saved,      setSaved]      = useState({})

  const toggle  = (id, value) => setAttendance(prev => ({ ...prev, [id]: value }))
  const markAll = (present) => {
    const all = {}
    students.forEach(s => { all[s.id] = present })
    setAttendance(all)
  }

  const saveAll = async () => {
    const entries = Object.entries(attendance)
    if (entries.length === 0) { toast('لم تقم بتحديد حضور أي طالب', 'error'); return }
    setSaving(true)
    let ok = 0, fail = 0
    for (const [studentId, present] of entries) {
      try {
        await api.post('/attendances/', { student_id: Number(studentId), present })
        setSaved(prev => ({ ...prev, [studentId]: true }))
        ok++
      } catch { fail++ }
    }
    setSaving(false)
    if (fail === 0) toast(`تم حفظ حضور ${ok} طالب بنجاح ✓`)
    else toast(`تم حفظ ${ok}، فشل ${fail}`, 'error')
  }

  const markedCount  = Object.keys(attendance).length
  const presentCount = Object.values(attendance).filter(Boolean).length
  const absentCount  = Object.values(attendance).filter(v => v === false).length

  return (
    <motion.div key='attendance' {...tabAnim} className='flex flex-col gap-5'>
      <Section>
        <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6'>
          <div>
            <h2 className='Styled text-2xl text-white'>تسجيل الحضور</h2>
            <p className='Normal text-xs mt-1' style={{ color: 'rgba(255,255,255,0.35)' }}>
              {markedCount} من {students.length} · حاضر: {presentCount} · غائب: {absentCount}
            </p>
          </div>
          {students.length > 0 && (
            <div className='flex gap-2'>
              <button onClick={() => markAll(true)}
                className='Normal text-xs px-3 py-1.5 rounded-lg transition-all'
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: 'rgba(134,239,172,0.7)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,197,94,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(34,197,94,0.08)'}>
                الكل حاضر ✓
              </button>
              <button onClick={() => markAll(false)}
                className='Normal text-xs px-3 py-1.5 rounded-lg transition-all'
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'rgba(252,165,165,0.7)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}>
                الكل غائب ✗
              </button>
            </div>
          )}
        </div>

        {students.length === 0 ? <Empty label='لا يوجد طلاب' /> : (
          <div className='flex flex-col gap-3'>
            {students.map((student, i) => {
              const status  = attendance[student.id]
              const isSaved = saved[student.id]
              return (
                <motion.div key={student.id}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl'
                  style={{
                    background: isSaved ? 'rgba(34,197,94,0.04)' : 'rgba(0,0,0,0.2)',
                    border: `1px solid ${isSaved ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)'}`,
                    transition: 'all 0.3s',
                  }}
                >
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full flex items-center justify-center text-base flex-shrink-0'
                      style={{ background: 'rgba(99,102,241,0.15)' }}>👤</div>
                    <div>
                      <p className='Styled text-sm text-white'>{student.name}</p>
                      <p className='Normal text-xs' style={{ color: 'rgba(255,255,255,0.3)' }}>#{student.id}</p>
                    </div>
                    {isSaved && <span className='Normal text-xs' style={{ color: '#86efac' }}>✓ محفوظ</span>}
                  </div>
                  <div className='flex gap-2 w-full sm:w-auto'>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => toggle(student.id, true)}
                      className='flex-1 sm:flex-none px-5 py-2 rounded-xl Normal text-sm transition-all'
                      style={{
                        background: status === true ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.06)',
                        border: `1px solid ${status === true ? 'rgba(34,197,94,0.5)' : 'rgba(34,197,94,0.15)'}`,
                        color: status === true ? '#86efac' : 'rgba(134,239,172,0.5)',
                      }}>حاضر ✓</motion.button>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => toggle(student.id, false)}
                      className='flex-1 sm:flex-none px-5 py-2 rounded-xl Normal text-sm transition-all'
                      style={{
                        background: status === false ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.06)',
                        border: `1px solid ${status === false ? 'rgba(239,68,68,0.5)' : 'rgba(239,68,68,0.15)'}`,
                        color: status === false ? '#fca5a5' : 'rgba(252,165,165,0.5)',
                      }}>غائب ✗</motion.button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {students.length > 0 && (
          <motion.button
            whileHover={!saving ? { scale: 1.01 } : {}} whileTap={!saving ? { scale: 0.99 } : {}}
            onClick={saveAll} disabled={saving}
            className='w-full mt-6 py-3.5 rounded-xl Styled text-base flex items-center justify-center gap-2'
            style={{
              background: saving ? 'rgba(99,102,241,0.08)' : 'linear-gradient(135deg, rgba(59,130,246,0.6), rgba(99,102,241,0.6))',
              border: '1px solid rgba(99,102,241,0.3)',
              color: saving ? 'rgba(255,255,255,0.3)' : 'white',
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? <><Spin /> جاري الحفظ...</> : 'حفظ الحضور'}
          </motion.button>
        )}
      </Section>
    </motion.div>
  )
}

// ─── Progress Tab ─────────────────────────────────────────────────────────
const EMPTY_FORM = {
  student_id: '', hizb: '', thomn: '', surah: '',
  from_ayah: '', to_ayah: '', type: 'حفظ', score: '', notes: '',
}

const ProgressTab = ({ students, api, toast }) => {
  const [form,           setForm]           = useState(EMPTY_FORM)
  const [saving,         setSaving]         = useState(false)
  const [history,        setHistory]        = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  // FIX: Correct endpoint per OpenAPI spec is GET /progresses/student?student_id=X
  const loadHistory = useCallback(async (id) => {
    if (!id) return
    setLoadingHistory(true)
    setHistory([])
    try {
      const data = await api.get('/progresses/student', { student_id: id })
      setHistory(Array.isArray(data) ? [...data].reverse() : [])  // newest first
    } catch {
      setHistory([])
    }
    setLoadingHistory(false)
  }, [api])

  const handleStudentChange = (id) => {
    setForm(f => ({ ...f, student_id: id }))
    loadHistory(id)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const required = ['student_id','hizb','thomn','surah','from_ayah','to_ayah','score','notes']
    if (required.some(k => !String(form[k]).trim())) {
      toast('يرجى ملء جميع الحقول المطلوبة', 'error')
      return
    }
    const scoreNum = Number(form.score)
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      toast('الدرجة يجب أن تكون بين 0 و 100', 'error')
      return
    }
    setSaving(true)
    try {
      await api.post('/progresses/', {
        ...form,
        student_id: Number(form.student_id),
        score: scoreNum,
      })
      toast('تم تسجيل التقدم بنجاح ✓')
      setForm(f => ({ ...EMPTY_FORM, student_id: f.student_id, type: f.type }))
      loadHistory(form.student_id)
    } catch (err) {
      toast(err.message, 'error')
    }
    setSaving(false)
  }

  const typeIcons = { حفظ: '📚', مراجعة: '🔄', تلاوة: '📖' }

  return (
    <motion.div key='progress' {...tabAnim} className='flex flex-col gap-5'>
      <Section>
        <SectionTitle icon='📖'>تسجيل تقدم جديد</SectionTitle>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <SelectField label='الطالب *' value={form.student_id} onChange={handleStudentChange}
            options={students.map(s => ({ value: s.id, label: s.name }))} placeholder='اختر طالباً' />
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
            <Input label='الحزب *'  value={form.hizb}  onChange={v => setForm(f => ({ ...f, hizb: v }))}  placeholder='مثال: ١٢' />
            <Input label='الثمن *'  value={form.thomn} onChange={v => setForm(f => ({ ...f, thomn: v }))} placeholder='الأول' />
            <Input label='السورة *' value={form.surah} onChange={v => setForm(f => ({ ...f, surah: v }))} placeholder='البقرة' />
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <Input label='من الآية *' type='number' value={form.from_ayah} onChange={v => setForm(f => ({ ...f, from_ayah: v }))} placeholder='١' min={1} />
            <Input label='إلى الآية *' type='number' value={form.to_ayah}  onChange={v => setForm(f => ({ ...f, to_ayah: v }))}  placeholder='١٠' min={1} />
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <SelectField label='النوع' value={form.type} onChange={v => setForm(f => ({ ...f, type: v }))}
              options={[{ value: 'حفظ', label: '📚 حفظ' }, { value: 'مراجعة', label: '🔄 مراجعة' }, { value: 'تلاوة', label: '📖 تلاوة' }]} />
            <Input label='الدرجة (0–100) *' type='number' value={form.score}
              onChange={v => setForm(f => ({ ...f, score: v }))} placeholder='٩٥' min={0} max={100} />
          </div>
          <Textarea label='ملاحظات المعلم *' value={form.notes}
            onChange={v => setForm(f => ({ ...f, notes: v }))}
            placeholder='أداء الطالب، نقاط القوة والضعف...' rows={3} />
          <motion.button type='submit' disabled={saving}
            whileHover={!saving ? { scale: 1.01 } : {}} whileTap={!saving ? { scale: 0.99 } : {}}
            className='w-full py-3.5 rounded-xl Styled text-base flex items-center justify-center gap-2 mt-1'
            style={{
              background: saving ? 'rgba(99,102,241,0.08)' : 'linear-gradient(135deg, rgba(59,130,246,0.6), rgba(99,102,241,0.6))',
              border: '1px solid rgba(99,102,241,0.3)',
              color: saving ? 'rgba(255,255,255,0.3)' : 'white',
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? <><Spin /> جاري الحفظ...</> : 'حفظ التقدم'}
          </motion.button>
        </form>
      </Section>

      {form.student_id && (
        <Section>
          <SectionTitle icon='📊'>
            سجل {students.find(s => String(s.id) === String(form.student_id))?.name || ''}
          </SectionTitle>
          {loadingHistory ? (
            <div className='flex justify-center py-10'><Spin /></div>
          ) : history.length === 0 ? (
            <Empty label='لا توجد سجلات تقدم لهذا الطالب بعد' />
          ) : (
            <div className='flex flex-col gap-3'>
              {history.map((p, i) => (
                <motion.div key={p.id || i}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className='flex items-start gap-4 p-4 rounded-xl'
                  style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <span className='text-xl mt-0.5 flex-shrink-0'>{typeIcons[p.type] || '📝'}</span>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center justify-between gap-2 mb-1'>
                      <span className='Styled text-sm text-white'>{p.surah}</span>
                      <ScoreBadge score={p.score} />
                    </div>
                    <p className='Normal text-xs' style={{ color: 'rgba(255,255,255,0.4)' }}>
                      آيات {p.from_ayah}–{p.to_ayah} · {p.type} · حزب {p.hizb}
                    </p>
                    {p.notes && (
                      <p className='Normal text-xs mt-1.5 leading-relaxed' style={{ color: 'rgba(255,255,255,0.55)' }}>
                        {p.notes}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Section>
      )}
    </motion.div>
  )
}

// ─── Tabs config ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'dashboard',  label: 'لوحة التحكم', icon: '◈' },
  { id: 'students',   label: 'الطلاب',      icon: '👥' },
  { id: 'attendance', label: 'الحضور',      icon: '📅' },
  { id: 'progress',   label: 'التقدم',      icon: '📈' },
]

// ─── Main Page ────────────────────────────────────────────────────────────
const TeacherPage = () => {
  const navigate = useNavigate()
  const api      = useApi()

  const [activeTab,       setActiveTab]       = useState('dashboard')
  const [students,        setStudents]        = useState([])
  const [loadingStudents, setLoadingStudents] = useState(true)
  const [searchQuery,     setSearchQuery]     = useState('')
  const [toastState,      setToastState]      = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    setToastState({ message, type })
    setTimeout(() => setToastState(null), 3500)
  }, [])

  const fetchStudents = useCallback(async () => {
    setLoadingStudents(true)
    try {
      // GET /students/teacher returns students assigned to the logged-in teacher
      const data = await api.get("/students/teacher")
      setStudents(Array.isArray(data) ? data : [])
    } catch (err) {
      // Fallback: if /students/teacher fails (404/422), try /students/
      try {
        const data = await api.get("/students/")
        setStudents(Array.isArray(data) ? data : [])
      } catch (err2) {
        showToast(err2.message || err.message || "فشل تحميل الطلاب", "error")
      }
    }
    setLoadingStudents(false)
  }, [api, showToast])

  useEffect(() => { fetchStudents() }, [fetchStudents])

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/teacherlogin')
  }

  const tabProps = {
    students, api, toast: showToast,
    loading: loadingStudents, loadingStudents,
    searchQuery, setSearchQuery,
  }

  return (
    <div className='min-h-screen w-screen text-white overflow-x-hidden' style={{ background: '#0a0a0f' }} dir='rtl'>
      {/* Background blobs */}
      <div className='fixed inset-0 pointer-events-none'>
        <div style={{ position:'absolute', top:'-20%', right:'-10%', width:'600px', height:'600px', borderRadius:'9999px', background:'rgba(59,130,246,0.04)', filter:'blur(100px)' }} />
        <div style={{ position:'absolute', bottom:'-20%', left:'-10%', width:'600px', height:'600px', borderRadius:'9999px', background:'rgba(147,51,234,0.04)', filter:'blur(100px)' }} />
        <div className='absolute inset-0 opacity-[0.15]'
          style={{ backgroundImage:'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize:'40px 40px' }} />
      </div>

      {/* Header */}
      <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
        className='relative px-6 md:px-12 pt-8 pb-6 flex items-start justify-between gap-4'>
        <div>
          <h1 className='Styled text-4xl md:text-5xl text-white leading-tight'>فضاء الأستاذ</h1>
          <p className='Normal text-sm mt-2' style={{ color:'rgba(255,255,255,0.35)' }}>
            {loadingStudents ? 'جاري التحميل...' : `${students.length} طالب مسجل`}
          </p>
        </div>
        <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} onClick={logout}
          className='Normal text-xs px-4 py-2 rounded-xl flex items-center gap-2 mt-1'
          style={{ background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.15)', color:'rgba(252,165,165,0.6)' }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.1)'; e.currentTarget.style.color='#fca5a5' }}
          onMouseLeave={e => { e.currentTarget.style.background='rgba(239,68,68,0.06)'; e.currentTarget.style.color='rgba(252,165,165,0.6)' }}
        >
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-3.5 h-3.5'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9' />
          </svg>
          خروج
        </motion.button>
      </motion.div>

      {/* Tab Bar */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.15 }}
        className='sticky top-0 z-30 px-6 md:px-12 py-3'
        style={{ background:'rgba(10,10,15,0.85)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
        <div className='flex gap-1.5 max-w-lg'>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)} whileTap={{ scale:0.96 }}
                className='flex items-center gap-2 px-4 py-2 rounded-xl Normal text-sm transition-all'
                style={{
                  background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(99,102,241,0.3)' : 'transparent'}`,
                  color: isActive ? '#a5b4fc' : 'rgba(255,255,255,0.35)',
                }}>
                <span className='text-base'>{tab.icon}</span>
                <span className='hidden sm:inline'>{tab.label}</span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Content */}
      <div className='relative px-4 md:px-12 py-6 max-w-5xl mx-auto'>
        <AnimatePresence mode='wait'>
          {activeTab === 'dashboard'  && <DashboardTab  key='dashboard'  {...tabProps} />}
          {activeTab === 'students'   && <StudentsTab   key='students'   {...tabProps} />}
          {activeTab === 'attendance' && <AttendanceTab key='attendance' {...tabProps} />}
          {activeTab === 'progress'   && <ProgressTab   key='progress'   {...tabProps} />}
        </AnimatePresence>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toastState && <Toast message={toastState.message} type={toastState.type} onClose={() => setToastState(null)} />}
      </AnimatePresence>
    </div>
  )
}

export default TeacherPage