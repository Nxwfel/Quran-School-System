import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const API = 'https://quranicshooldkjudsadup9ewidu79poadwjaiok.onrender.com'

// ─── API Hook ───────────────────────────────────────────────────────────────
const useApi = () =>
  useMemo(() => {
    const getToken = () => localStorage.getItem('token') || ''
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
    return { get: (path, params) => request('GET', path, null, params) }
  }, [])

// ─── Helpers ────────────────────────────────────────────────────────────────
const scoreColor = s => s >= 90 ? '#4ade80' : s >= 75 ? '#fbbf24' : '#f87171'
const scoreLabel = s => s >= 90 ? 'ممتاز' : s >= 75 ? 'جيد' : 'يحتاج تحسين'
const typeIcon = t => t === 'حفظ' ? '📚' : t === 'مراجعة' ? '🔄' : '📖'
const typeColor = t => t === 'حفظ' ? '#818cf8' : t === 'مراجعة' ? '#34d399' : '#f472b6'

// ─── Toast ──────────────────────────────────────────────────────────────────
const Toast = ({ message, type }) => (
  <motion.div
    initial={{ opacity: 0, y: 32, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 32, scale: 0.9 }}
    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    style={{
      position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 24px', borderRadius: 16,
      background: type === 'error' ? 'rgba(15,3,3,0.97)' : 'rgba(3,12,8,0.97)',
      border: `1px solid ${type === 'error' ? 'rgba(248,113,113,0.35)' : 'rgba(74,222,128,0.35)'}`,
      color: type === 'error' ? '#f87171' : '#4ade80',
      fontSize: 13, fontFamily: 'var(--font-body)',
      backdropFilter: 'blur(24px)',
      boxShadow: `0 16px 40px ${type === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}`,
      whiteSpace: 'nowrap',
    }}
  >
    <span style={{ fontSize: 15 }}>{type === 'error' ? '✕' : '✓'}</span>
    {message}
  </motion.div>
)

// ─── Score Ring ──────────────────────────────────────────────────────────────
const ScoreRing = ({ score, size = 56 }) => {
  const r = (size - 6) / 2
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  const color = scoreColor(score)
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size < 50 ? 11 : 14, fontFamily: 'var(--font-display)', color, fontWeight: 700,
      }}>
        {score}
      </div>
    </div>
  )
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ icon, value, label, accent, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: 'spring', stiffness: 100 }}
    whileHover={{ y: -3, transition: { duration: 0.18 } }}
    style={{
      borderRadius: 20, padding: '20px 24px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}
  >
    <div style={{ fontSize: 26 }}>{icon}</div>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: accent, lineHeight: 1 }}>{value}</div>
    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>{label}</div>
  </motion.div>
)

// ─── Empty ───────────────────────────────────────────────────────────────────
const Empty = ({ label }) => (
  <div style={{ padding: '52px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
    <div style={{ fontSize: 36, opacity: 0.15 }}>⌀</div>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.22)' }}>{label}</p>
  </div>
)

const Spin = () => (
  <motion.div
    animate={{ rotate: 360 }} transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
    style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid rgba(129,140,248,0.2)', borderTopColor: '#818cf8' }}
  />
)

// ─── DASHBOARD TAB ───────────────────────────────────────────────────────────
const DashboardTab = ({ children, attendanceMap, progressMap }) => {
  const totalPresent = Object.values(attendanceMap).flat().filter(a => a.present).length
  const totalSessions = Object.values(progressMap).flat().length
  const allProgress = Object.entries(progressMap)
    .flatMap(([childId, recs]) => recs.slice(0, 2).map(p => ({
      ...p,
      childName: children.find(c => String(c.id) === String(childId))?.name || `#${childId}`,
    })))
    .sort((a, b) => (b.id || 0) - (a.id || 0))
    .slice(0, 6)

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
        <StatCard icon="👨‍👩‍👧‍👦" value={children.length} label="عدد الأبناء" accent="#818cf8" delay={0} />
        <StatCard icon="✓" value={totalPresent} label="إجمالي الحضور" accent="#4ade80" delay={0.06} />
        <StatCard icon="📖" value={totalSessions} label="جلسات التقدم" accent="#38bdf8" delay={0.12} />
      </div>

      {/* Children overview */}
      <div style={{ borderRadius: 24, padding: '28px 32px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <SectionHeader icon="👨‍👩‍👧‍👦" title="أبنائي" />
        {children.length === 0 ? <Empty label="لا يوجد أبناء مسجلون" /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {children.map((child, i) => {
              const last = (progressMap[child.id] || [])[0]
              return (
                <motion.div key={child.id}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', borderRadius: 16, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <Avatar name={child.name} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: '#fff', margin: 0 }}>{child.name}</p>
                    {last && <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '3px 0 0' }}>
                      آخر جلسة: {last.surah} — {last.type}
                    </p>}
                  </div>
                  {last && <ScoreRing score={last.score} size={48} />}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Recent activity */}
      <div style={{ borderRadius: 24, padding: '28px 32px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <SectionHeader icon="🔔" title="آخر النشاطات" />
        {allProgress.length === 0 ? <Empty label="لا توجد جلسات مسجلة بعد" /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {allProgress.map((p, i) => (
              <ActivityRow key={p.id ?? i} p={p} delay={i * 0.05} showChild />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── CHILDREN TAB ────────────────────────────────────────────────────────────
const ChildrenTab = ({ children, searchQuery, setSearchQuery, loading, setActiveTab, setSelectedChild }) => {
  const filtered = children.filter(c => c.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  return (
    <motion.div key="children"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="ابحث عن ابن أو ابنة..." />
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}><Spin /></div>
      ) : filtered.length === 0 ? (
        <Empty label={searchQuery ? 'لا توجد نتائج' : 'لا يوجد أبناء مسجلون'} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {filtered.map((child, i) => (
            <motion.div key={child.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.18 } }}
              onClick={() => { setSelectedChild(child); setActiveTab('progress') }}
              style={{
                borderRadius: 20, padding: 22, cursor: 'pointer',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', flexDirection: 'column', gap: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <Avatar name={child.name} size={48} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: '#fff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{child.name}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.33)', margin: '4px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {child.teacher_name || `المعلم #${child.teacher_id}`}
                  </p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Chip label="الحزب" value={child.hizb ?? '—'} />
                <Chip label={`طالب #${child.id}`} value={child.surah || '—'} accent="#a78bfa" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── ATTENDANCE TAB ──────────────────────────────────────────────────────────
const AttendanceTab = ({ children, attendanceMap, loadingAttendance }) => (
  <motion.div key="attendance"
    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
    style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
  >
    <div style={{ borderRadius: 24, padding: '28px 32px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <SectionHeader icon="📅" title="سجل الحضور" />
      {loadingAttendance ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}><Spin /></div>
      ) : children.length === 0 ? (
        <Empty label="لا يوجد أبناء" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
          {children.map((child, ci) => {
            const records = attendanceMap[child.id] || []
            const presentCount = records.filter(r => r.present).length
            const pct = records.length ? Math.round((presentCount / records.length) * 100) : 0
            return (
              <motion.div key={child.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.08 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <Avatar name={child.name} size={44} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: '#fff', margin: 0 }}>{child.name}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '3px 0 0' }}>
                      {presentCount} حضور من {records.length} جلسة
                    </p>
                  </div>
                  {/* Attendance bar */}
                  <div style={{ textAlign: 'left', minWidth: 80 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: pct >= 75 ? '#4ade80' : '#f87171' }}>{pct}%</div>
                    <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.07)', marginTop: 6, overflow: 'hidden', width: 80 }}>
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                        style={{ height: '100%', borderRadius: 4, background: pct >= 75 ? '#4ade80' : '#f87171' }}
                      />
                    </div>
                  </div>
                </div>
                {records.length === 0 ? (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.22)' }}>لا توجد سجلات حضور</p>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {records.slice(0, 21).map((r, i) => (
                      <div key={r.id ?? i}
                        style={{
                          borderRadius: 12, padding: '8px 12px', textAlign: 'center', minWidth: 64,
                          background: r.present ? 'rgba(74,222,128,0.07)' : 'rgba(248,113,113,0.07)',
                          border: `1px solid ${r.present ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`,
                        }}
                      >
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: r.present ? '#4ade80' : '#f87171', margin: 0 }}>
                          {r.present ? '✓' : '✗'}
                        </p>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(255,255,255,0.28)', margin: '4px 0 0' }}>
                          {r.date ? new Date(r.date).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }) : `#${i + 1}`}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {ci < children.length - 1 && (
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginTop: 28 }} />
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  </motion.div>
)

// ─── PROGRESS TAB ────────────────────────────────────────────────────────────
const ProgressTab = ({ children, progressMap, loadingProgress, selectedChild, setSelectedChild }) => {
  const active = selectedChild ?? (children.length === 1 ? children[0] : null)
  const records = active ? (progressMap[active.id] || []) : []

  const avg = records.length
    ? Math.round(records.reduce((s, r) => s + (r.score || 0), 0) / records.length)
    : null

  return (
    <motion.div key="progress"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      {children.length > 1 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {children.map(child => (
            <motion.button key={child.id} whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedChild(child)}
              style={{
                padding: '8px 18px', borderRadius: 12, cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: 13,
                background: active?.id === child.id ? 'rgba(129,140,248,0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active?.id === child.id ? 'rgba(129,140,248,0.45)' : 'rgba(255,255,255,0.07)'}`,
                color: active?.id === child.id ? '#a5b4fc' : 'rgba(255,255,255,0.45)',
                transition: 'all 0.18s',
              }}
            >{child.name}</motion.button>
          ))}
        </div>
      )}

      {!active && children.length > 1 ? (
        <Empty label="اختر ابناً من القائمة أعلاه لعرض تقدمه" />
      ) : !active ? (
        <Empty label="لا يوجد أبناء" />
      ) : (
        <div style={{ borderRadius: 24, overflow: 'hidden', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Header */}
          <div style={{ padding: '28px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
            <Avatar name={active.name} size={56} />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#fff', margin: 0 }}>{active.name}</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: '5px 0 0' }}>
                {active.teacher_name || `المعلم #${active.teacher_id}`}
              </p>
            </div>
            {avg !== null && (
              <div style={{ textAlign: 'center' }}>
                <ScoreRing score={avg} size={64} />
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 6 }}>المتوسط</p>
              </div>
            )}
          </div>

          {/* Records */}
          <div style={{ padding: '20px 32px 28px' }}>
            {loadingProgress ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}><Spin /></div>
            ) : records.length === 0 ? (
              <Empty label="لا توجد جلسات تقدم مسجلة بعد" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {records.map((p, i) => (
                  <ActivityRow key={p.id ?? i} p={p} delay={i * 0.04} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ─── Shared small components ─────────────────────────────────────────────────
const Avatar = ({ name, size = 44 }) => {
  const initials = (name || '؟').slice(0, 1)
  return (
    <div style={{
      width: size, height: size, borderRadius: Math.round(size * 0.38),
      background: 'linear-gradient(135deg, rgba(129,140,248,0.28), rgba(244,114,182,0.28))',
      border: '1px solid rgba(255,255,255,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontSize: size * 0.38, color: 'rgba(255,255,255,0.8)',
      flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

const Chip = ({ label, value, accent = 'rgba(255,255,255,0.65)' }) => (
  <div style={{ borderRadius: 12, padding: '10px 14px', background: 'rgba(0,0,0,0.22)' }}>
    <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>{label}</p>
    <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: accent, margin: '3px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</p>
  </div>
)

const SectionHeader = ({ icon, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
    <span style={{ fontSize: 18 }}>{icon}</span>
    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#fff', margin: 0 }}>{title}</h3>
    <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.06))' }} />
  </div>
)

const SearchInput = ({ value, onChange, placeholder }) => (
  <div style={{ position: 'relative', maxWidth: 400 }}>
    <input
      type="text" value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', padding: '12px 20px 12px 44px',
        borderRadius: 16, fontFamily: 'var(--font-body)', fontSize: 14,
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        color: '#fff', outline: 'none', boxSizing: 'border-box',
        transition: 'border-color 0.2s',
      }}
      onFocus={e => e.target.style.borderColor = 'rgba(129,140,248,0.45)'}
      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
    />
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
      strokeWidth={2} stroke="currentColor"
      style={{ width: 16, height: 16, position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)', pointerEvents: 'none' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  </div>
)

const ActivityRow = ({ p, delay = 0, showChild = false }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}
    style={{
      display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 18px',
      borderRadius: 16, background: 'rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.05)',
    }}
  >
    <div style={{
      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
      background: `${typeColor(p.type)}18`,
      border: `1px solid ${typeColor(p.type)}30`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, marginTop: 1,
    }}>
      {typeIcon(p.type)}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      {showChild && p.childName && (
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: '#a5b4fc', margin: '0 0 3px' }}>{p.childName}</p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#fff' }}>{p.surah}</span>
        <ScoreRing score={p.score} size={38} />
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.38)', margin: '4px 0 0' }}>
        آيات {p.from_ayah}–{p.to_ayah} ·{' '}
        <span style={{ color: typeColor(p.type) }}>{p.type}</span>
        {' '}· حزب {p.hizb}
      </p>
      {p.notes && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: '6px 0 0', lineHeight: 1.5 }}>
          💬 {p.notes}
        </p>
      )}
    </div>
  </motion.div>
)

// ─── TABS CONFIG ─────────────────────────────────────────────────────────────
const TABS = [
  { id: 'dashboard', label: 'الرئيسية', icon: '◈' },
  { id: 'children', label: 'الأبناء', icon: '👨‍👩‍👧‍👦' },
  { id: 'attendance', label: 'الحضور', icon: '📅' },
  { id: 'progress', label: 'التقدم', icon: '📈' },
]

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const ParentPage = () => {
  const navigate = useNavigate()
  const api = useApi()

  const [activeTab, setActiveTab] = useState('dashboard')
  const [children, setChildren] = useState([])
  const [attendanceMap, setAttendanceMap] = useState({})
  const [progressMap, setProgressMap] = useState({})
  const [loadingChildren, setLoadingChildren] = useState(true)
  const [loadingAttendance, setLoadingAttendance] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChild, setSelectedChild] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), [])

  const fetchAllAttendance = useCallback(async (list) => {
    setLoadingAttendance(true)
    const map = {}
    await Promise.all(list.map(async child => {
      try { map[child.id] = (await api.get('/attendances/student', { student_id: child.id })) || [] }
      catch { map[child.id] = [] }
    }))
    setAttendanceMap(map)
    setLoadingAttendance(false)
  }, [api])

  const fetchAllProgress = useCallback(async (list) => {
    setLoadingProgress(true)
    const map = {}
    await Promise.all(list.map(async child => {
      try { map[child.id] = (await api.get('/progresses/student', { student_id: child.id })) || [] }
      catch { map[child.id] = [] }
    }))
    setProgressMap(map)
    setLoadingProgress(false)
  }, [api])

  const fetchChildren = useCallback(async () => {
    if (!localStorage.getItem('token')) { setLoadingChildren(false); return }
    setLoadingChildren(true)
    try {
      // ✅ Use the supervisor-specific endpoint — no 403, no client-side filter needed
      const data = await api.get('/supervisors/supervisor')
      const list = Array.isArray(data) ? data : []
      setChildren(list)
      if (list.length > 0) {
        fetchAllAttendance(list)
        fetchAllProgress(list)
      }
    } catch (err) {
      showToast(err.message || 'فشل تحميل بيانات الأبناء', 'error')
    }
    setLoadingChildren(false)
  }, [api, fetchAllAttendance, fetchAllProgress, showToast])

  useEffect(() => { fetchChildren() }, [fetchChildren])

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
    selectedChild, setSelectedChild, setActiveTab,
  }

  return (
    <>
      {/* Global font + style injection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500&display=swap');
        :root {
          --font-display: 'Amiri', serif;
          --font-body: 'IBM Plex Sans Arabic', sans-serif;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080810; }
        input::placeholder { color: rgba(255,255,255,0.22); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
        button { border: none; background: none; cursor: pointer; }
      `}</style>

      <div style={{ minHeight: '100vh', width: '100vw', background: '#080810', color: '#fff', overflowX: 'hidden', direction: 'rtl', position: 'relative' }}>

        {/* Background */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-15%', right: '-8%', width: 640, height: 640, borderRadius: '50%', background: 'rgba(99,102,241,0.05)', filter: 'blur(120px)' }} />
          <div style={{ position: 'absolute', bottom: '-15%', left: '-8%', width: 640, height: 640, borderRadius: '50%', background: 'rgba(244,114,182,0.04)', filter: 'blur(120px)' }} />
          <div style={{ position: 'absolute', inset: 0, opacity: 0.12, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        </div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ position: 'relative', zIndex: 10, padding: '36px 40px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, maxWidth: 1100, margin: '0 auto' }}
        >
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 46px)', color: '#fff', lineHeight: 1.2 }}>
              فضاء ولي الأمر
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.32)', marginTop: 8 }}>
              {loadingChildren ? 'جاري التحميل...' : `${children.length} ${children.length === 1 ? 'ابن مسجل' : 'أبناء مسجلون'}`}
            </p>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={logout}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 18px', borderRadius: 12, marginTop: 4,
              fontFamily: 'var(--font-body)', fontSize: 12,
              background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.14)',
              color: 'rgba(252,165,165,0.6)', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.color = '#fca5a5' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; e.currentTarget.style.color = 'rgba(252,165,165,0.6)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" style={{ width: 14, height: 14 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            خروج
          </motion.button>
        </motion.header>

        {/* Tab Bar */}
        <motion.nav
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          style={{
            position: 'sticky', top: 0, zIndex: 30,
            background: 'rgba(8,8,16,0.88)', backdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            padding: '10px 40px',
          }}
        >
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 6 }}>
            {TABS.map(tab => {
              const active = activeTab === tab.id
              return (
                <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)} whileTap={{ scale: 0.95 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 16px', borderRadius: 12,
                    fontFamily: 'var(--font-body)', fontSize: 13,
                    background: active ? 'rgba(129,140,248,0.14)' : 'transparent',
                    border: `1px solid ${active ? 'rgba(129,140,248,0.38)' : 'transparent'}`,
                    color: active ? '#a5b4fc' : 'rgba(255,255,255,0.32)',
                    transition: 'all 0.18s',
                  }}
                >
                  <span style={{ fontSize: 15 }}>{tab.icon}</span>
                  <span style={{ display: window.innerWidth < 480 ? 'none' : 'inline' }}>{tab.label}</span>
                </motion.button>
              )
            })}
          </div>
        </motion.nav>

        {/* Content */}
        <main style={{ position: 'relative', zIndex: 5, padding: '28px 40px 60px', maxWidth: 1100, margin: '0 auto' }}>
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <DashboardTab key="dashboard"  {...tabProps} />}
            {activeTab === 'children' && <ChildrenTab key="children"   {...tabProps} />}
            {activeTab === 'attendance' && <AttendanceTab key="attendance" {...tabProps} />}
            {activeTab === 'progress' && <ProgressTab key="progress"   {...tabProps} />}
          </AnimatePresence>
        </main>

        {/* Toast */}
        <AnimatePresence>
          {toast && <Toast key="toast" message={toast.message} type={toast.type} />}
        </AnimatePresence>
      </div>
    </>
  )
}

export default ParentPage