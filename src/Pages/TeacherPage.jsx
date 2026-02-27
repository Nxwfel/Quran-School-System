import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const API = 'https://quranicshooldkjudsadup9ewidu79poadwjaiok.onrender.com';

// ─── Token helper ────────────────────────────────────────────────────────────
const getToken = () => {
  let t = localStorage.getItem('token') || '';
  if (t.startsWith('"') && t.endsWith('"')) {
    try { t = JSON.parse(t); } catch {}
  }
  if (!t) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      t = user.token || '';
    } catch {}
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
        try { err = await res.json(); } catch {}
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
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.95 }}
    onClick={onClose}
    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl text-sm cursor-pointer flex items-center gap-3"
    style={{
      background: type === 'error' ? 'rgba(20,5,5,0.97)' : 'rgba(5,15,10,0.97)',
      border: `1px solid ${type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.4)'}`,
      color: type === 'error' ? '#fca5a5' : '#86efac',
      backdropFilter: 'blur(20px)',
      boxShadow: `0 8px 32px ${type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)'}`,
    }}
  >
    <span className="text-base">{type === 'error' ? '✕' : '✓'}</span>
    <span>{message}</span>
    <span className="text-xs opacity-40 mr-2">اضغط للإغلاق</span>
  </motion.div>
);

// ─── Spinner ─────────────────────────────────────────────────────────────────
const Spin = () => (
  <motion.span
    animate={{ rotate: 360 }}
    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    className="inline-block w-5 h-5 rounded-full border-2 border-transparent border-t-current"
  />
);

// ─── Empty state ─────────────────────────────────────────────────────────────
const Empty = ({ label }) => (
  <div className="py-16 flex flex-col items-center gap-3 opacity-60">
    <div className="text-5xl">◌</div>
    <p>{label}</p>
  </div>
);

// ─── Input ───────────────────────────────────────────────────────────────────
const Input = ({ label, value, onChange, type = 'text', placeholder, required, min, max }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs opacity-70 text-right">{label}{required && <span className="text-indigo-400"> *</span>}</label>}
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      min={min}
      max={max}
      className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-right outline-none focus:border-indigo-500/50 transition"
    />
  </div>
);

// ─── Select ──────────────────────────────────────────────────────────────────
const Select = ({ label, value, onChange, options, placeholder }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs opacity-70 text-right">{label}</label>}
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-right appearance-none cursor-pointer focus:border-indigo-500/50 transition"
    >
      <option value="" className="bg-gray-950 text-gray-400">{placeholder || 'اختر...'}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value} className="bg-gray-950">{opt.label}</option>
      ))}
    </select>
  </div>
);

// ─── Tabs ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'dashboard',  label: 'لوحة التحكم', icon: '◈' },
  { id: 'students',   label: 'الطلاب',      icon: '👥' },
  { id: 'attendance', label: 'الحضور',      icon: '📅' },
  { id: 'progress',   label: 'التقدم',      icon: '📈' },
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
    <div className="min-h-screen Styled w-screen text-white overflow-x-hidden relative" dir="rtl" style={{ background: '#0a0a0f' }}>
      {/* Original background */}
      <div className="fixed inset-0 pointer-events-none">
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', borderRadius: '9999px', background: 'rgba(59,130,246,0.04)', filter: 'blur(100px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '600px', height: '600px', borderRadius: '9999px', background: 'rgba(147,51,234,0.04)', filter: 'blur(100px)' }} />
        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative px-6 md:px-12 pt-8 pb-6 flex items-start justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">فضاء الأستاذ</h1>
          <p className="mt-2 opacity-70">
            {loading ? 'جاري التحميل...' : `${students.length} طالب مسجل`}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="px-5 py-2 bg-red-900/30 border border-red-800/40 rounded-xl hover:bg-red-900/50 transition flex items-center gap-2"
        >
          خروج
        </motion.button>
      </motion.div>

      {/* Tabs */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="sticky top-0 z-30 px-6 md:px-12 py-3 bg-black/85 backdrop-blur-xl border-b border-white/5"
      >
        <div className="flex gap-2 max-w-lg flex-wrap">
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileTap={{ scale: 0.96 }}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm transition-all ${
                  active ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-300' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.nav>

      {/* Content */}
      <main className="relative px-6 md:px-12 py-8 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/30 border border-white/10 rounded-2xl p-6">
                  <div className="text-4xl mb-2">👥</div>
                  <div className="text-5xl font-bold">{students.length}</div>
                  <div className="text-sm opacity-60 mt-2">إجمالي الطلاب</div>
                </div>
              </div>

              <div className="bg-black/30 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl mb-6">الطلاب المسجلون</h2>
                {loading ? <Spin /> : filteredStudents.length === 0 ? <Empty label="لا يوجد طلاب" /> : (
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {filteredStudents.map(s => (
                      <div key={s.id} className="p-5 bg-black/40 rounded-xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-600/30 flex items-center justify-center text-2xl">👤</div>
                        <div>
                          <div className="font-medium">{s.name}</div>
                          <div className="text-xs opacity-60">#{s.id}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'students' && (
            <motion.div key="students" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ابحث عن طالب..."
                className="w-full max-w-md block mx-auto px-5 py-3.5 rounded-2xl bg-black/40 border border-white/10 focus:border-indigo-500/50 transition"
              />
              {loading ? <div className="text-center py-20"><Spin /></div> : filteredStudents.length === 0 ? (
                <Empty label={search ? 'لا توجد نتائج' : 'لا يوجد طلاب'} />
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredStudents.map(s => (
                    <div key={s.id} className="bg-black/30 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/30 transition">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-600/40 to-purple-600/40 flex items-center justify-center text-3xl">👤</div>
                        <span className="text-xs bg-indigo-900/40 px-3 py-1 rounded-full">#{s.id}</span>
                      </div>
                      <h3 className="text-xl font-medium">{s.name}</h3>
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
    <div className="space-y-10">
      {/* Today's attendance */}
      <div className="bg-black/30 border border-white/10 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">تسجيل الحضور اليوم</h2>
            <p className="opacity-70">
              {markedCount}/{students.length} • حاضر: {presentCount} • غائب: {absentCount}
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => markAll(true)}  className="px-5 py-2 bg-green-900/30 border border-green-800/40 rounded-xl hover:bg-green-900/50">الكل حاضر</button>
            <button onClick={() => markAll(false)} className="px-5 py-2 bg-red-900/30 border border-red-800/40 rounded-xl hover:bg-red-900/50">الكل غائب</button>
          </div>
        </div>

        {loading ? <Spin /> : students.length === 0 ? <Empty label="لا يوجد طلاب" /> : (
          <div className="space-y-4">
            {students.map(s => {
              const status = marks[s.id];
              const isSaved = saved[s.id];
              return (
                <div key={s.id} className={`p-5 rounded-xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between ${isSaved ? 'bg-green-950/20 border-green-800/30' : 'bg-black/20 border-white/5'} border`}>
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center text-2xl">👤</div>
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs opacity-60">#{s.id}</div>
                    </div>
                    {isSaved && <span className="text-green-400 text-sm">✓ محفوظ</span>}
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => toggle(s.id, true)}
                      className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl ${status === true ? 'bg-green-700/40 border-green-600' : 'bg-green-900/20 border-green-800/30'}`}
                    >حاضر</button>
                    <button
                      onClick={() => toggle(s.id, false)}
                      className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl ${status === false ? 'bg-red-700/40 border-red-600' : 'bg-red-900/20 border-red-800/30'}`}
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
            className={`mt-8 w-full py-4 rounded-xl font-bold ${saving ? 'bg-gray-800 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'}`}
          >
            {saving ? <>جاري الحفظ <Spin /></> : 'حفظ الحضور'}
          </button>
        )}
      </div>

      {/* Attendance history */}
      <div className="bg-black/30 border border-white/10 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between gap-6 mb-6">
          <h2 className="text-2xl font-bold">سجل الحضور</h2>
          <Select
            value={selectedStudentId}
            onChange={setSelectedStudentId}
            options={students.map(s => ({ value: String(s.id), label: s.name }))}
            placeholder="اختر طالبًا لعرض سجله"
          />
        </div>

        {loadingHistory ? (
          <div className="text-center py-12"><Spin /> جاري التحميل...</div>
        ) : !selectedStudentId ? (
          <Empty label="اختر طالبًا لعرض سجل حضوره" />
        ) : history.length === 0 ? (
          <Empty label="لا توجد سجلات حضور بعد" />
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {history.map((rec, i) => (
              <div
                key={i}
                className={`p-5 rounded-xl border-l-4 ${rec.present ? 'border-green-500 bg-green-950/10' : 'border-red-500 bg-red-950/10'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">
                      {new Date(rec.created_at || Date.now()).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="text-sm opacity-70 mt-1">
                      {rec.present ? 'حاضر ✓' : 'غائب ✗'}
                    </div>
                  </div>
                  <span className={`px-4 py-1 rounded-full text-sm ${rec.present ? 'bg-green-900/40 text-green-300' : 'bg-red-900/40 text-red-300'}`}>
                    {rec.present ? 'حاضر' : 'غائب'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
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
    <div className="grid gap-10 lg:grid-cols-2">
      {/* Form */}
      <div className="bg-black/30 border border-white/10 rounded-2xl p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-8">تسجيل تقدم جديد</h2>
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
          <div className="grid gap-5 sm:grid-cols-3">
            <Input label="الحزب *" value={form.hizb} onChange={v => setForm(p => ({ ...p, hizb: v }))} />
            <Input label="الثمن *" value={form.thomn} onChange={v => setForm(p => ({ ...p, thomn: v }))} />
            <Input label="السورة *" value={form.surah} onChange={v => setForm(p => ({ ...p, surah: v }))} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="من الآية *" type="number" value={form.from_ayah} onChange={v => setForm(p => ({ ...p, from_ayah: v }))} />
            <Input label="إلى الآية *" type="number" value={form.to_ayah} onChange={v => setForm(p => ({ ...p, to_ayah: v }))} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
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
            <label className="text-xs opacity-70 block mb-1.5">ملاحظات *</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              placeholder="ملاحظات المعلم..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 focus:border-indigo-500/50 transition resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className={`w-full py-4 rounded-xl font-bold mt-4 ${saving ? 'bg-gray-800 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'}`}
          >
            {saving ? <>جاري الحفظ <Spin /></> : 'حفظ التقدم'}
          </button>
        </form>
      </div>

      {/* History */}
      <div className="bg-black/30 border border-white/10 rounded-2xl p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-6">
          {form.student_id ? `سجل ${students.find(s => String(s.id) === form.student_id)?.name || ''}` : 'سجل التقدم'}
        </h2>

        {loadingHistory ? (
          <div className="text-center py-12"><Spin /></div>
        ) : !form.student_id ? (
          <Empty label="اختر طالبًا لعرض سجله" />
        ) : history.length === 0 ? (
          <Empty label="لا توجد سجلات تقدم بعد" />
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {history.map((p, i) => (
              <div key={i} className="p-5 rounded-xl bg-white/5 border border-white/10">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{p.surah}</div>
                  <span className={`px-3 py-1 rounded-full text-xs ${p.score >= 85 ? 'bg-green-900/40 text-green-300' : p.score >= 60 ? 'bg-yellow-900/40 text-yellow-300' : 'bg-red-900/40 text-red-300'}`}>
                    {p.score}
                  </span>
                </div>
                <div className="text-sm opacity-70">
                  {p.type} • حزب {p.hizb} • {p.thomn} • آيات {p.from_ayah}–{p.to_ayah}
                </div>
                {p.notes && <p className="mt-3 text-sm opacity-80">{p.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherPage;