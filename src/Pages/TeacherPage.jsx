import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const API = 'https://quranicshooldkjudsadup9ewidu79poadwjaiok.onrender.com';

// ─── Token helper ────────────────────────────────────────────────────────────
const getToken = () => {
  let t = localStorage.getItem('token') || '';
  if (t.startsWith('"') && t.endsWith('"')) {
    try { t = JSON.parse(t); } catch { }
  }
  if (!t) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      t = user.token || '';
    } catch { }
  }
  return t;
};

// ─── API client ──────────────────────────────────────────────────────────────
const useApi = () => {
  const apiRef = useRef(null);

  if (!apiRef.current) {
    const request = async (method, path, body = null, params = null) => {
      let url = `${API}${path}`;
      if (params) url += `?${new URLSearchParams(params)}`;

      const token = getToken();
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (res.status === 401) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/teacherlogin';
        return null;
      }

      if (!res.ok) {
        let err;
        try { err = await res.json(); } catch { }
        const msg = err?.detail
          ? (Array.isArray(err.detail) ? err.detail.map(d => d.msg).join(', ') : err.detail)
          : `خطأ ${res.status}`;
        throw new Error(msg);
      }

      return res.json();
    };

    apiRef.current = {
      get: (path, params) => request('GET', path, null, params),
      post: (path, body) => request('POST', path, body),
    };
  }

  return apiRef.current;
};

// ─── Toast ───────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 32, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 32, scale: 0.9 }}
    onClick={onClose}
    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 cursor-pointer flex items-center gap-3 Arabic-Sans"
    style={{
      background: 'white',
      border: `1px solid ${type === 'error' ? 'rgba(239,68,68,0.4)' : 'var(--color-arch-accent)'}`,
      color: type === 'error' ? '#fca5a5' : 'var(--color-arch-dark)',
      boxShadow: `0 8px 32px rgba(0,0,0,0.05)`,
    }}
  >
    <span className="text-base">{type === 'error' ? '✕' : '✓'}</span>
    <span className='text-sm'>{message}</span>
    <span className="text-xs opacity-40 mr-2">اضغط للإغلاق</span>
  </motion.div>
);

// ─── Spinner ─────────────────────────────────────────────────────────────────
const Spin = () => (
  <motion.span
    animate={{ rotate: 360 }}
    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    className="inline-block w-5 h-5 rounded-full border-2 border-[var(--color-arch-gray)] border-t-[var(--color-arch-accent)]"
  />
);

// ─── Empty state ─────────────────────────────────────────────────────────────
const Empty = ({ label }) => (
  <div className="py-16 flex flex-col items-center gap-3">
    <div className="text-5xl text-[var(--color-arch-dark)] opacity-15">⌀</div>
    <p className='Arabic-Sans text-sm text-[var(--color-arch-accent)] opacity-70'>{label}</p>
  </div>
);

// ─── Input ───────────────────────────────────────────────────────────────────
const Input = ({ label, value, onChange, type = 'text', placeholder, required, min, max }) => (
  <div className="flex flex-col gap-1.5 Arabic-Sans">
    {label && <label className="text-xs text-[var(--color-arch-accent)] text-right">{label}{required && <span className="text-[var(--color-arch-dark)]"> *</span>}</label>}
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
      className="w-full px-4 py-2.5 bg-white border border-black/10 text-[var(--color-arch-dark)] text-right outline-none focus:border-[var(--color-arch-dark)] transition"
    />
  </div>
);

// ─── Select ──────────────────────────────────────────────────────────────────
const Select = ({ label, value, onChange, options, placeholder }) => (
  <div className="flex flex-col gap-1.5 Arabic-Sans">
    {label && <label className="text-xs text-[var(--color-arch-accent)] text-right">{label}</label>}
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-4 py-2.5 bg-white border border-black/10 text-[var(--color-arch-dark)] text-right appearance-none cursor-pointer focus:border-[var(--color-arch-dark)] transition"
    >
      <option value="" className="bg-white text-[var(--color-arch-accent)]">{placeholder || 'اختر...'}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value} className="bg-white text-[var(--color-arch-dark)]">{opt.label}</option>
      ))}
    </select>
  </div>
);

// ─── Tabs ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'dashboard', label: 'الرئيسية', icon: '◈' },
  { id: 'students', label: 'الطلاب', icon: '👥' },
  { id: 'attendance', label: 'الحضور', icon: '📅' },
  { id: 'progress', label: 'التقدم', icon: '📈' },
];

// ─── Main Component ──────────────────────────────────────────────────────────
const TeacherPage = () => {
  const navigate = useNavigate();
  const api = useApi();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toastState, setToastState] = useState(null);

  const showToast = useCallback((msg, type = 'success') => {
    setToastState({ message: msg, type });
    setTimeout(() => setToastState(null), 4000);
  }, []);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get('/students/teacher');
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast(err.message || 'تعذر تحميل الطلاب', 'error');
    } finally {
      setLoading(false);
    }
  }, [api, showToast]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/teacherlogin');
  };

  const filteredStudents = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[var(--color-arch-bg)] text-[var(--color-arch-dark)] overflow-x-hidden selection:bg-[var(--color-arch-dark)] selection:text-[var(--color-arch-bg)]" style={{ direction: 'rtl' }}>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{ padding: '36px 40px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, maxWidth: 1100, margin: '0 auto' }}
      >
        <div>
          <h1 className='Styled' style={{ fontSize: 'clamp(28px, 5vw, 46px)', color: 'var(--color-arch-dark)', lineHeight: 1.2 }}>
            فضاء الأستاذ
          </h1>
          <p className='Arabic-Sans' style={{ fontSize: 13, color: 'var(--color-arch-accent)', marginTop: 8 }}>
            {loading ? 'جاري التحميل...' : `${students.length} طالب مسجل`}
          </p>
        </div>
        <motion.button className='Arabic-Sans' whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '9px 18px', marginTop: 4,
            fontSize: 12,
            background: 'transparent', border: '1px solid var(--color-arch-dark)',
            color: 'var(--color-arch-dark)', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-arch-dark)'; e.currentTarget.style.color = 'var(--color-arch-bg)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-arch-dark)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 14, height: 14 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          خروج
        </motion.button>
      </motion.header>

      {/* Tabs */}
      <motion.nav
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        style={{
          position: 'sticky', top: 0, zIndex: 30,
          background: 'var(--color-arch-bg)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          padding: '10px 40px',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 6 }}>
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileTap={{ scale: 0.95 }}
                className='Arabic-Sans'
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 16px',
                  fontSize: 13,
                  background: active ? 'var(--color-arch-dark)' : 'transparent',
                  border: `1px solid ${active ? 'var(--color-arch-dark)' : 'transparent'}`,
                  color: active ? 'var(--color-arch-bg)' : 'var(--color-arch-accent)',
                  transition: 'all 0.18s',
                }}
              >
                <span style={{ fontSize: 15 }}>{tab.icon}</span>
                <span style={{ display: window.innerWidth < 480 ? 'none' : 'inline' }}>{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.nav>

      {/* Content */}
      <main style={{ position: 'relative', zIndex: 5, padding: '28px 40px 60px', maxWidth: 1100, margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-black/10 p-6 flex flex-col gap-3">
                  <div className="text-3xl text-[var(--color-arch-accent)]">👥</div>
                  <div className="Styled text-4xl">{students.length}</div>
                  <div className="Arabic-Sans text-sm text-[var(--color-arch-accent)]">إجمالي الطلاب</div>
                </div>
              </div>

              <div className="bg-[var(--color-arch-gray)] border border-black/5 p-8">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                  <span style={{ fontSize: 18 }}>👨‍🎓</span>
                  <h3 className='Styled text-2xl m-0'>الطلاب المسجلون</h3>
                  <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.05)' }} />
                </div>
                {loading ? <div className='flex justify-center py-8'><Spin /></div> : filteredStudents.length === 0 ? <Empty label="لا يوجد طلاب" /> : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredStudents.map(s => (
                      <div key={s.id} className="p-4 bg-white border border-black/5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-[var(--color-arch-dark)] font-serif text-lg">
                          {(s.name || '؟').slice(0, 1)}
                        </div>
                        <div>
                          <div className="Styled text-lg">{s.name}</div>
                          <div className="Arabic-Sans text-xs text-[var(--color-arch-accent)]">#{s.id}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'students' && (
            <motion.div key="students" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="relative max-w-md mx-auto mb-8">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="ابحث عن طالب..."
                  className="Arabic-Sans w-full px-5 py-3.5 bg-white border border-black/10 focus:border-[var(--color-arch-dark)] transition outline-none text-[var(--color-arch-dark)] pr-12"
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  strokeWidth={1.5} stroke="currentColor"
                  className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-arch-accent)] pointer-events-none"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>

              {loading ? <div className="text-center py-20"><Spin /></div> : filteredStudents.length === 0 ? (
                <Empty label={search ? 'لا توجد نتائج' : 'لا يوجد طلاب'} />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredStudents.map(s => (
                    <div key={s.id} className="bg-white border border-black/10 p-6 hover:border-[var(--color-arch-dark)] transition cursor-pointer flex flex-col gap-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center text-[var(--color-arch-dark)] font-serif text-xl bg-[var(--color-arch-bg)]">
                          {(s.name || '؟').slice(0, 1)}
                        </div>
                        <span className="Arabic-Sans text-xs bg-[var(--color-arch-gray)] px-3 py-1 text-[var(--color-arch-dark)]">#{s.id}</span>
                      </div>
                      <h3 className="Styled text-2xl">{s.name}</h3>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'attendance' && <AttendanceTab students={students} api={api} toast={showToast} loading={loading} />}
          {activeTab === 'progress' && <ProgressTab students={students} api={api} toast={showToast} loading={loading} />}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {toastState && <Toast message={toastState.message} type={toastState.type} onClose={() => setToastState(null)} />}
      </AnimatePresence>
    </div>
  );
};

// ─── Attendance Tab ──────────────────────────────────────────────────────────
const AttendanceTab = ({ students, api, toast, loading }) => {
  const [marks, setMarks] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState({});

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const toggle = (id, val) => setMarks(p => ({ ...p, [id]: val }));

  const markAll = present => {
    const all = {};
    students.forEach(s => all[s.id] = present);
    setMarks(all);
  };

  const save = async () => {
    const entries = Object.entries(marks);
    if (!entries.length) return toast('لم يتم تحديد حضور', 'error');

    setSaving(true);
    let ok = 0, fail = 0;

    for (const [id, present] of entries) {
      try {
        await api.post('/attendances/', { student_id: Number(id), present });
        setSaved(p => ({ ...p, [id]: true }));
        ok++;
      } catch {
        fail++;
      }
    }

    setSaving(false);
    toast(
      fail === 0 ? `تم حفظ حضور ${ok} طالب` : `نجح ${ok} • فشل ${fail}`,
      fail > 0 ? 'error' : 'success'
    );
  };

  const loadHistory = useCallback(async id => {
    if (!id) {
      setHistory([]);
      return;
    }
    setLoadingHistory(true);
    try {
      const data = await api.get('/attendances/student', { student_id: id });
      setHistory(Array.isArray(data) ? data : []);
    } catch {
      setHistory([]);
      toast('تعذر تحميل سجل الحضور', 'error');
    }
    setLoadingHistory(false);
  }, [api, toast]);

  useEffect(() => { loadHistory(selectedStudentId); }, [selectedStudentId, loadHistory]);

  const presentCount = Object.values(marks).filter(v => v === true).length;
  const absentCount = Object.values(marks).filter(v => v === false).length;
  const markedCount = presentCount + absentCount;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
      {/* Today's attendance */}
      <div className="bg-[var(--color-arch-gray)] border border-black/5 p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span className='text-xl'>📝</span>
              <h3 className='Styled text-2xl m-0'>تسجيل الحضور اليوم</h3>
            </div>
            <p className="Arabic-Sans text-sm text-[var(--color-arch-accent)] mt-2">
              {markedCount}/{students.length} مسجل • حاضر: {presentCount} • غائب: {absentCount}
            </p>
          </div>
          <div className="flex gap-3 flex-wrap Arabic-Sans">
            <button onClick={() => markAll(true)} className="px-5 py-2 bg-[var(--color-arch-bg)] border border-[rgba(122,114,101,0.2)] text-[var(--color-arch-dark)] hover:border-[var(--color-arch-accent)] transition text-sm">الكل حاضر</button>
            <button onClick={() => markAll(false)} className="px-5 py-2 bg-[var(--color-arch-bg)] border border-[rgba(248,113,113,0.2)] text-[#f87171] hover:border-[#f87171] transition text-sm">الكل غائب</button>
          </div>
        </div>

        {loading ? <div className='flex justify-center py-8'><Spin /></div> : students.length === 0 ? <Empty label="لا يوجد طلاب" /> : (
          <div className="space-y-3">
            {students.map(s => {
              const status = marks[s.id];
              const isSaved = saved[s.id];
              return (
                <div key={s.id} className={`p-4 bg-white border ${isSaved ? 'border-[var(--color-arch-dark)]' : 'border-black/5'} flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between`}>
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-[var(--color-arch-dark)] font-serif text-lg bg-[var(--color-arch-bg)]">
                      {(s.name || '؟').slice(0, 1)}
                    </div>
                    <div>
                      <div className="Styled text-lg">{s.name}</div>
                      <div className="Arabic-Sans text-xs text-[var(--color-arch-accent)]">#{s.id}</div>
                    </div>
                    {isSaved && <span className="Arabic-Sans text-[var(--color-arch-accent)] text-xs mr-4 px-2 py-1 bg-[var(--color-arch-gray)]">✓ محفوظ</span>}
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto Arabic-Sans">
                    <button
                      onClick={() => toggle(s.id, true)}
                      className={`flex-1 sm:flex-none px-6 py-2.5 text-sm transition ${status === true ? 'bg-[var(--color-arch-dark)] text-white' : 'bg-[var(--color-arch-bg)] text-[var(--color-arch-dark)] border border-black/10 hover:border-black/30'}`}
                    >حاضر</button>
                    <button
                      onClick={() => toggle(s.id, false)}
                      className={`flex-1 sm:flex-none px-6 py-2.5 text-sm transition ${status === false ? 'bg-[#f87171] text-white' : 'bg-[var(--color-arch-bg)] text-[#f87171] border border-black/10 hover:border-[#f87171]'}`}
                    >غائب</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {students.length > 0 && (
          <button
            onClick={save}
            disabled={saving || markedCount === 0}
            className={`mt-6 w-full py-4 text-center Arabic-Sans text-sm transition flex items-center justify-center gap-2 ${saving ? 'bg-[var(--color-arch-gray)] text-[var(--color-arch-accent)] cursor-not-allowed border border-black/5' : 'bg-[var(--color-arch-dark)] text-[var(--color-arch-bg)] hover:bg-black'}`}
          >
            {saving ? <>جاري الحفظ <Spin /></> : 'حفظ الحضور'}
          </button>
        )}
      </div>

      {/* Attendance history */}
      <div className="bg-[var(--color-arch-gray)] border border-black/5 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8 border-b border-black/5 pb-6">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className='text-xl'>🕒</span>
            <h3 className='Styled text-2xl m-0'>سجل الحضور</h3>
          </div>
          <div className='w-full sm:w-64'>
            <Select
              value={selectedStudentId}
              onChange={setSelectedStudentId}
              options={students.map(s => ({ value: String(s.id), label: s.name }))}
              placeholder="اختر طالبًا لعرض سجله"
            />
          </div>
        </div>

        {loadingHistory ? (
          <div className="text-center py-12"><Spin /></div>
        ) : !selectedStudentId ? (
          <Empty label="اختر طالبًا لعرض سجل حضوره" />
        ) : history.length === 0 ? (
          <Empty label="لا توجد سجلات حضور بعد" />
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {history.map((rec, i) => (
              <div
                key={i}
                className={`p-4 bg-white border border-black/5 flex justify-between items-center`}
              >
                <div>
                  <div className="Arabic-Sans text-[var(--color-arch-dark)] text-sm">
                    {new Date(rec.created_at || Date.now()).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                <span className={`Arabic-Sans px-4 py-1 text-xs ${rec.present ? 'text-[var(--color-arch-dark)] bg-black/5' : 'text-[#f87171] bg-[#f87171]/10'}`}>
                  {rec.present ? 'حاضر' : 'غائب'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Progress Tab ────────────────────────────────────────────────────────────
const ProgressTab = ({ students, api, toast, loading }) => {
  const EMPTY_FORM = {
    student_id: '',
    hizb: '',
    thomn: '',
    surah: '',
    from_ayah: '',
    to_ayah: '',
    type: 'حفظ',
    score: '',
    notes: '',
  };

  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const loadHistory = useCallback(async (studentId) => {
    if (!studentId) {
      setHistory([]);
      return;
    }
    setLoadingHistory(true);
    try {
      const data = await api.get('/progresses/student', { student_id: studentId });
      setHistory(Array.isArray(data) ? [...data].reverse() : []);
    } catch {
      setHistory([]);
      toast('تعذر تحميل سجل التقدم', 'error');
    }
    setLoadingHistory(false);
  }, [api, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = ['student_id', 'hizb', 'thomn', 'surah', 'from_ayah', 'to_ayah', 'score'];
    if (required.some(k => !form[k]?.toString().trim())) {
      return toast('يرجى ملء جميع الحقول المطلوبة', 'error');
    }
    const scoreNum = Number(form.score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      return toast('الدرجة يجب أن تكون بين 0 و 100', 'error');
    }

    setSaving(true);
    try {
      await api.post('/progresses/', {
        ...form,
        student_id: Number(form.student_id),
        score: scoreNum,
      });
      toast('تم تسجيل التقدم بنجاح ✓');
      setForm({ ...EMPTY_FORM, student_id: form.student_id });
      loadHistory(form.student_id);
    } catch (err) {
      toast(err.message || 'حدث خطأ أثناء الحفظ', 'error');
    }
    setSaving(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid gap-8 lg:grid-cols-2 lg:items-start">
      {/* Form */}
      <div className="bg-[var(--color-arch-gray)] border border-black/5 p-6 md:p-8">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <span className='text-xl'>✍️</span>
          <h3 className='Styled text-2xl m-0'>تسجيل تقدم جديد</h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Select
            label="الطالب *"
            value={form.student_id}
            onChange={v => {
              setForm(p => ({ ...p, student_id: v }));
              loadHistory(v);
            }}
            options={students.map(s => ({ value: String(s.id), label: s.name }))}
            placeholder="اختر طالبًا"
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="الحزب *" value={form.hizb} onChange={v => setForm(p => ({ ...p, hizb: v }))} />
            <Input label="الثمن *" value={form.thomn} onChange={v => setForm(p => ({ ...p, thomn: v }))} />
            <Input label="السورة *" value={form.surah} onChange={v => setForm(p => ({ ...p, surah: v }))} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="من الآية *" type="number" value={form.from_ayah} onChange={v => setForm(p => ({ ...p, from_ayah: v }))} />
            <Input label="إلى الآية *" type="number" value={form.to_ayah} onChange={v => setForm(p => ({ ...p, to_ayah: v }))} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="النوع"
              value={form.type}
              onChange={v => setForm(p => ({ ...p, type: v }))}
              options={[
                { value: 'حفظ', label: 'حفظ' },
                { value: 'مراجعة', label: 'مراجعة' },
                { value: 'تلاوة', label: 'تلاوة' },
              ]}
            />
            <Input label="الدرجة (0-100) *" type="number" value={form.score} onChange={v => setForm(p => ({ ...p, score: v }))} min={0} max={100} />
          </div>
          <div>
            <label className="text-xs text-[var(--color-arch-accent)] block mb-1.5 Arabic-Sans text-right">ملاحظات</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              placeholder="ملاحظات المعلم..."
              rows={4}
              className="w-full px-4 py-3 bg-white border border-black/10 text-[var(--color-arch-dark)] focus:border-[var(--color-arch-dark)] transition resize-none outline-none Arabic-Sans text-sm text-right"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className={`w-full py-4 text-center Arabic-Sans text-sm transition flex items-center justify-center gap-2 mt-2 ${saving ? 'bg-[var(--color-arch-bg)] text-[var(--color-arch-accent)] cursor-not-allowed border border-black/5' : 'bg-[var(--color-arch-dark)] text-[var(--color-arch-bg)] hover:bg-black'}`}
          >
            {saving ? <>جاري الحفظ <Spin /></> : 'حفظ التقدم'}
          </button>
        </form>
      </div>

      {/* History */}
      <div className="bg-[var(--color-arch-gray)] border border-black/5 p-6 md:p-8">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <span className='text-xl'>📖</span>
          <h3 className='Styled text-2xl m-0'>
            {form.student_id ? `سجل ${students.find(s => String(s.id) === form.student_id)?.name || ''}` : 'سجل التقدم'}
          </h3>
        </div>

        {loadingHistory ? (
          <div className="text-center py-12"><Spin /></div>
        ) : !form.student_id ? (
          <Empty label="اختر طالبًا لعرض سجله" />
        ) : history.length === 0 ? (
          <Empty label="لا توجد سجلات تقدم بعد" />
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {history.map((p, i) => (
              <div key={i} className="p-4 bg-white border border-black/5">
                <div className="flex justify-between items-center mb-3">
                  <div className="Styled text-lg">{p.surah}</div>
                  <span className={`Arabic-Sans px-3 py-1 text-xs ${p.score >= 85 ? 'bg-black/5 text-[var(--color-arch-dark)]' : p.score >= 60 ? 'bg-black/5 text-[var(--color-arch-dark)]' : 'bg-[#f87171]/10 text-[#f87171]'}`}>
                    العلامة: {p.score}
                  </span>
                </div>
                <div className="Arabic-Sans flex flex-wrap gap-x-3 gap-y-2 text-xs text-[var(--color-arch-accent)]">
                  <span className='bg-[var(--color-arch-bg)] px-2 py-1'>{p.type}</span>
                  <span className='bg-[var(--color-arch-bg)] px-2 py-1'>حزب {p.hizb}</span>
                  <span className='bg-[var(--color-arch-bg)] px-2 py-1'>{p.thomn}</span>
                  <span className='bg-[var(--color-arch-bg)] px-2 py-1'>آيات {p.from_ayah}–{p.to_ayah}</span>
                </div>
                {p.notes && <p className="mt-4 text-xs text-[var(--color-arch-dark)] Arabic-Sans bg-[var(--color-arch-gray)] p-3 border-r-2 border-[var(--color-arch-dark)]">{p.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TeacherPage;