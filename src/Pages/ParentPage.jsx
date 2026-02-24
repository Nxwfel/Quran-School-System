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
      try { t = JSON.parse(t) } catch {}
    }
    return t
  }

  const headers = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  })

  const request = async (method, path, body, params) => {
    const url = params ? `${API}${path}?${new URLSearchParams(params)}` : `${API}${path}`
    const res = await fetch(url, {
      method,
      headers: headers(),
      body: body ? JSON.stringify(body) : undefined,
    })
    if (res.status === 401) {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      window.location.href = '/parentlogin'
      return
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || `خطأ ${res.status}`)
    }
    return res.json()
  }

  return {
    get: (path, params) => request('GET', path, null, params),
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────
const scoreColor = (s) => s >= 90 ? '#86efac' : s >= 75 ? '#fde68a' : '#fca5a5'
const scoreBg    = (s) => s >= 90 ? 'rgba(34,197,94,0.1)' : s >= 75 ? 'rgba(234,179,8,0.1)' : 'rgba(239,68,68,0.1)'
const scoreBorder= (s) => s >= 90 ? 'rgba(34,197,94,0.3)' : s >= 75 ? 'rgba(234,179,8,0.3)' : 'rgba(239,68,68,0.3)'
const typeIcon   = (t) => t === 'حفظ' ? '📚' : t === 'مراجعة' ? '🔄' : '📖'

// ─── Shared UI ─────────────────────────────────────────────────────────────
const Toast = ({ message, type }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.95 }}
    className='fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-2xl text-sm Normal'
    style={{
      background: type === 'error' ? 'rgba(20,5,5,0.97)' : 'rgba(5,15,10,0.97)',
      border: `1px solid ${type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.4)'}`,
      color: type === 'error' ? '#fca5a5' : '#86efac',
      backdropFilter: 'blur(20px)',
      boxShadow: `0 8px 32px ${type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)'}`,
    }}
  >
    {type === 'error' ? '✕' : '✓'} {message}
  </motion.div>
)

const Spin = () => (
  <motion.span
    animate={{ rotate: 360 }}
    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    className='inline-block w-5 h-5 rounded-full border-2 border-transparent'
    style={{ borderTopColor: 'rgba(168,85,247,0.8)' }}
  />
)

const Empty = ({ label }) => (
  <div className='py-16 flex flex-col items-center gap-3'>
    <div className='text-4xl opacity-20'>◌</div>
    <p className='Normal text-sm' style={{ color: 'rgba(255,255,255,0.25)' }}>{label}</p>
  </div>
)

const Section = ({ children, className = '' }) => (
  <div
    className={`rounded-2xl p-6 md:p-8 ${className}`}
    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
  >
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

const ScoreBadge = ({ score }) => (
  <span
    className='Normal text-xs px-2.5 py-1 rounded-full'
    style={{ background: scoreBg(score), border: `1px solid ${scoreBorder(score)}`, color: scoreColor(score) }}
  >
    {score}
  </span>
)

const StatCard = ({ icon, value, label, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: 'spring', stiffness: 80 }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className='rounded-2xl p-6 flex flex-col gap-3'
    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
  >
    <div className='text-3xl'>{icon}</div>
    <div className='Styled text-4xl' style={{ color }}>{value}</div>
    <div className='Normal text-sm' style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
  </motion.div>
)

const ProgressBar = ({ value, color, delay = 0 }) => (
  <div className='w-full rounded-full h-2' style={{ background: 'rgba(255,255,255,0.07)' }}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ delay, duration: 1, ease: 'easeOut' }}
      className='h-2 rounded-full'
      style={{ background: color }}
    />
  </div>
)

// ─── ChildCard (compact) ───────────────────────────────────────────────────
const ChildCard = ({ child, onClick }) => (
  <motion.div
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    onClick={onClick}
    className='rounded-2xl p-5 cursor-pointer flex flex-col gap-4'
    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
  >
    <div className='flex items-center gap-3'>
      <div
        className='w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0'
        style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(236,72,153,0.25))' }}
      >
        👤
      </div>
      <div className='flex-1 min-w-0'>
        <p className='Styled text-base text-white truncate'>{child.name}</p>
        <p className='Normal text-xs mt-0.5 truncate' style={{ color: 'rgba(255,255,255,0.35)' }}>
          {child.teacher_name || `المعلم #${child.teacher_id}`}
        </p>
      </div>
    </div>
    <div className='grid grid-cols-2 gap-2'>
      <div className='rounded-xl p-3' style={{ background: 'rgba(0,0,0,0.2)' }}>
        <p className='Normal text-xs mb-1' style={{ color: 'rgba(255,255,255,0.35)' }}>الحزب</p>
        <p className='Styled text-lg text-white'>{child.hizb ?? '—'}</p>
      </div>
      <div className='rounded-xl p-3' style={{ background: 'rgba(0,0,0,0.2)' }}>
        <p className='Normal text-xs mb-1' style={{ color: 'rgba(255,255,255,0.35)' }}>طالب #{child.id}</p>
        <p className='Styled text-sm' style={{ color: '#c084fc' }}>{child.surah || '—'}</p>
      </div>
    </div>
  </motion.div>
)

// ─── TABS ──────────────────────────────────────────────────────────────────

const DashboardTab = ({ children, attendanceMap, progressMap }) => {
  const totalPresent = Object.values(attendanceMap).flat().filter(a => a.present).length
  const totalSessions = Object.values(progressMap).flat().length

  return (
    <motion.div key='dashboard' initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className='flex flex-col gap-6'>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
        <StatCard icon='👨‍👩‍👧‍👦' value={children.length} label='عدد الأبناء'   color='#c084fc' delay={0}    />
        <StatCard icon='✓'          value={totalPresent}    label='إجمالي الحضور' color='#86efac' delay={0.07} />
        <StatCard icon='📖'         value={totalSessions}   label='جلسات التقدم'  color='#7dd3fc' delay={0.14} />
      </div>

      <Section>
        <SectionTitle icon='👨‍👩‍👧‍👦'>نظرة عامة على الأبناء</SectionTitle>
        {children.length === 0
          ? <Empty label='لا يوجد أبناء مسجلون' />
          : <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {children.map((child, i) => {
                const lastProgress = (progressMap[child.id] || [])[0]
                return (
                  <motion.div
                    key={child.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className='flex items-center gap-4 p-4 rounded-xl'
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <div className='w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0'
                      style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.3))' }}>
                      👤
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='Styled text-sm text-white truncate'>{child.name}</p>
                      {lastProgress && (
                        <p className='Normal text-xs mt-0.5' style={{ color: 'rgba(255,255,255,0.35)' }}>
                          آخر جلسة: {lastProgress.surah} — {lastProgress.type}
                        </p>
                      )}
                    </div>
                    {lastProgress && <ScoreBadge score={lastProgress.score} />}
                  </motion.div>
                )
              })}
            </div>
        }
      </Section>

      {/* Recent progress across all children */}
      <Section>
        <SectionTitle icon='🔔'>التحديثات الأخيرة</SectionTitle>
        {Object.values(progressMap).flat().length === 0
          ? <Empty label='لا توجد جلسات مسجلة بعد' />
          : <div className='flex flex-col gap-3'>
              {Object.entries(progressMap).flatMap(([childId, records]) =>
                records.slice(0, 2).map(p => ({
                  ...p,
                  childName: children.find(c => String(c.id) === String(childId))?.name || `#${childId}`,
                }))
              ).sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 6).map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className='flex items-center gap-4 p-4 rounded-xl'
                  style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <span className='text-xl flex-shrink-0'>{typeIcon(p.type)}</span>
                  <div className='flex-1 min-w-0'>
                    <p className='Styled text-sm text-white'>{p.childName}</p>
                    <p className='Normal text-xs mt-0.5' style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {p.surah} · آيات {p.from_ayah}–{p.to_ayah} · {p.type}
                    </p>
                  </div>
                  <ScoreBadge score={p.score} />
                </motion.div>
              ))}
            </div>
        }
      </Section>
    </motion.div>
  )
}

const ChildrenTab = ({ children, searchQuery, setSearchQuery, loading, setActiveTab, setSelectedChild }) => {
  const filtered = children.filter(c => c.name?.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <motion.div key='children' initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className='flex flex-col gap-5'>
      <div className='relative max-w-md mx-auto w-full'>
        <input
          type='text' value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          placeholder='ابحث عن ابن أو ابنة...'
          className='w-full rounded-2xl px-5 py-3.5 pr-12 Normal text-sm outline-none text-white transition-all'
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          onFocus={e => e.target.style.borderColor = 'rgba(168,85,247,0.4)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
        />
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor'
          className='w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2' style={{ color: 'rgba(255,255,255,0.25)' }}>
          <path strokeLinecap='round' strokeLinejoin='round' d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z' />
        </svg>
      </div>

      {loading ? (
        <div className='flex justify-center py-20'><Spin /></div>
      ) : filtered.length === 0 ? (
        <Empty label={searchQuery ? 'لا توجد نتائج' : 'لا يوجد أبناء مسجلون'} />
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filtered.map((child, i) => (
            <motion.div key={child.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <ChildCard child={child} onClick={() => { setSelectedChild(child); setActiveTab('progress') }} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

const AttendanceTab = ({ children, attendanceMap, loadingAttendance }) => (
  <motion.div key='attendance' initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className='flex flex-col gap-5'>
    <Section>
      <SectionTitle icon='📅'>سجل الحضور</SectionTitle>
      {loadingAttendance ? (
        <div className='flex justify-center py-10'><Spin /></div>
      ) : children.length === 0 ? (
        <Empty label='لا يوجد أبناء' />
      ) : (
        <div className='flex flex-col gap-6'>
          {children.map((child, ci) => {
            const records = attendanceMap[child.id] || []
            const presentCount = records.filter(r => r.present).length
            return (
              <motion.div key={child.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.08 }}>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0'
                    style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.3))' }}>
                    👤
                  </div>
                  <div>
                    <p className='Styled text-base text-white'>{child.name}</p>
                    <p className='Normal text-xs mt-0.5' style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {presentCount} حضور من {records.length} جلسة
                    </p>
                  </div>
                </div>

                {records.length === 0 ? (
                  <p className='Normal text-xs' style={{ color: 'rgba(255,255,255,0.25)' }}>لا توجد سجلات حضور</p>
                ) : (
                  <div className='grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2'>
                    {records.slice(0, 14).map((r, i) => (
                      <div key={i} className='rounded-xl p-2.5 text-center'
                        style={{
                          background: r.present ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                          border: `1px solid ${r.present ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                        }}>
                        <p className='Styled text-base' style={{ color: r.present ? '#86efac' : '#fca5a5' }}>
                          {r.present ? '✓' : '✗'}
                        </p>
                        <p className='Normal text-xs mt-1' style={{ color: 'rgba(255,255,255,0.3)' }}>
                          {r.date ? new Date(r.date).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }) : `#${i + 1}`}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {ci < children.length - 1 && (
                  <div className='mt-6 h-px' style={{ background: 'rgba(255,255,255,0.05)' }} />
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </Section>
  </motion.div>
)

const ProgressTab = ({ children, progressMap, loadingProgress, selectedChild, setSelectedChild }) => {
  const activeChild = selectedChild || children[0] || null

  return (
    <motion.div key='progress' initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className='flex flex-col gap-5'>
      {/* Child selector */}
      {children.length > 1 && (
        <div className='flex gap-2 flex-wrap'>
          {children.map(child => (
            <motion.button
              key={child.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedChild(child)}
              className='px-4 py-2 rounded-xl Normal text-sm transition-all'
              style={{
                background: activeChild?.id === child.id ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${activeChild?.id === child.id ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.07)'}`,
                color: activeChild?.id === child.id ? '#c084fc' : 'rgba(255,255,255,0.5)',
              }}
            >
              {child.name}
            </motion.button>
          ))}
        </div>
      )}

      {!activeChild ? <Empty label='لا يوجد أبناء' /> : (() => {
        const records = progressMap[activeChild.id] || []
        return (
          <Section>
            <div className='flex items-center gap-4 mb-6 pb-6' style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className='w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0'
                style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(236,72,153,0.25))' }}>
                👤
              </div>
              <div>
                <h3 className='Styled text-2xl text-white'>{activeChild.name}</h3>
                <p className='Normal text-sm mt-1' style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {activeChild.teacher_name || `المعلم #${activeChild.teacher_id}`}
                </p>
              </div>
            </div>

            {loadingProgress ? (
              <div className='flex justify-center py-10'><Spin /></div>
            ) : records.length === 0 ? (
              <Empty label='لا توجد جلسات تقدم مسجلة بعد' />
            ) : (
              <div className='flex flex-col gap-3'>
                {records.map((p, i) => (
                  <motion.div
                    key={p.id || i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className='flex items-start gap-4 p-4 rounded-xl'
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <span className='text-xl mt-0.5 flex-shrink-0'>{typeIcon(p.type)}</span>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between gap-2 mb-1'>
                        <span className='Styled text-sm text-white'>{p.surah}</span>
                        <ScoreBadge score={p.score} />
                      </div>
                      <p className='Normal text-xs' style={{ color: 'rgba(255,255,255,0.4)' }}>
                        آيات {p.from_ayah}–{p.to_ayah} · {p.type} · حزب {p.hizb}
                      </p>
                      {p.notes && (
                        <p className='Normal text-xs mt-2 leading-relaxed' style={{ color: 'rgba(255,255,255,0.55)' }}>
                          💬 {p.notes}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Section>
        )
      })()}
    </motion.div>
  )
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────
const TABS = [
  { id: 'dashboard',  label: 'لوحة التحكم', icon: '◈' },
  { id: 'children',   label: 'الأبناء',      icon: '👨‍👩‍👧‍👦' },
  { id: 'attendance', label: 'الحضور',       icon: '📅' },
  { id: 'progress',   label: 'التقدم',       icon: '📈' },
]

const ParentPage = () => {
  const navigate = useNavigate()
  const api = useApi()

  const [activeTab, setActiveTab]           = useState('dashboard')
  const [children, setChildren]             = useState([])
  const [attendanceMap, setAttendanceMap]   = useState({})
  const [progressMap, setProgressMap]       = useState({})
  const [loadingChildren, setLoadingChildren]   = useState(true)
  const [loadingAttendance, setLoadingAttendance] = useState(false)
  const [loadingProgress, setLoadingProgress]   = useState(false)
  const [searchQuery, setSearchQuery]       = useState('')
  const [selectedChild, setSelectedChild]   = useState(null)
  const [toastState, setToastState]         = useState(null)

  const showToast = (message, type = 'success') => {
    setToastState({ message, type })
    setTimeout(() => setToastState(null), 3500)
  }

  // Load children
  const fetchChildren = useCallback(async () => {
    setLoadingChildren(true)
    try {
      const data = await api.get('/students/')
      const list = Array.isArray(data) ? data : []
      setChildren(list)
      // Load attendance + progress for all children in parallel
      if (list.length > 0) {
        fetchAllAttendance(list)
        fetchAllProgress(list)
      }
    } catch (err) {
      showToast(err.message || 'فشل تحميل بيانات الأبناء', 'error')
    }
    setLoadingChildren(false)
  }, [])

  const fetchAllAttendance = async (list) => {
    setLoadingAttendance(true)
    const map = {}
    await Promise.all(list.map(async child => {
      try {
        const data = await api.get('/attendances/', { student_id: child.id })
        map[child.id] = Array.isArray(data) ? data : []
      } catch { map[child.id] = [] }
    }))
    setAttendanceMap(map)
    setLoadingAttendance(false)
  }

  const fetchAllProgress = async (list) => {
    setLoadingProgress(true)
    const map = {}
    await Promise.all(list.map(async child => {
      try {
        const data = await api.get('/progresses/', { student_id: child.id })
        map[child.id] = Array.isArray(data) ? data : []
      } catch { map[child.id] = [] }
    }))
    setProgressMap(map)
    setLoadingProgress(false)
  }

  useEffect(() => { fetchChildren() }, [])

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/parentlogin')
  }

  const tabProps = {
    children, attendanceMap, progressMap,
    loadingAttendance, loadingProgress,
    loading: loadingChildren,
    searchQuery, setSearchQuery,
    selectedChild, setSelectedChild,
    setActiveTab,
  }

  return (
    <div className='min-h-screen w-screen text-white overflow-x-hidden' style={{ background: '#0a0a0f' }} dir='rtl'>
      {/* Background */}
      <div className='fixed inset-0 pointer-events-none'>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', borderRadius: '9999px', background: 'rgba(168,85,247,0.04)', filter: 'blur(100px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '600px', height: '600px', borderRadius: '9999px', background: 'rgba(236,72,153,0.04)', filter: 'blur(100px)' }} />
        <div className='absolute inset-0 opacity-[0.15]'
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className='relative px-6 md:px-12 pt-8 pb-6 flex items-start justify-between gap-4'
      >
        <div>
          <h1 className='Styled text-4xl md:text-5xl text-white leading-tight'>فضاء ولي الأمر</h1>
          <p className='Normal text-sm mt-2' style={{ color: 'rgba(255,255,255,0.35)' }}>
            {loadingChildren ? 'جاري التحميل...' : `${children.length} ${children.length === 1 ? 'ابن مسجل' : 'أبناء مسجلون'}`}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={logout}
          className='Normal text-xs px-4 py-2 rounded-xl flex items-center gap-2 mt-1 transition-all'
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: 'rgba(252,165,165,0.6)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#fca5a5' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; e.currentTarget.style.color = 'rgba(252,165,165,0.6)' }}
        >
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-3.5 h-3.5'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9' />
          </svg>
          خروج
        </motion.button>
      </motion.div>

      {/* Tab Bar */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className='sticky top-0 z-30 px-6 md:px-12 py-3'
        style={{ background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className='flex gap-1.5 max-w-lg'>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileTap={{ scale: 0.96 }}
                className='flex items-center gap-2 px-4 py-2 rounded-xl Normal text-sm transition-all'
                style={{
                  background: isActive ? 'rgba(168,85,247,0.15)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(168,85,247,0.35)' : 'transparent'}`,
                  color: isActive ? '#c084fc' : 'rgba(255,255,255,0.35)',
                }}
              >
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
          {activeTab === 'children'   && <ChildrenTab   key='children'   {...tabProps} />}
          {activeTab === 'attendance' && <AttendanceTab key='attendance' {...tabProps} />}
          {activeTab === 'progress'   && <ProgressTab   key='progress'   {...tabProps} />}
        </AnimatePresence>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toastState && <Toast message={toastState.message} type={toastState.type} />}
      </AnimatePresence>
    </div>
  )
}

export default ParentPage