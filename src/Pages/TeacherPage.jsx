import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TeacherPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0])
  const [todayAttendance, setTodayAttendance] = useState({})
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    avgProgress: 0,
    recentActivities: []
  })

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  }

  const cardHover = {
    scale: 1.03,
    y: -5,
    transition: { type: 'spring', stiffness: 300 }
  }

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2
      }
    }
  }

  // Fetch students from API
  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      // Mock data with more details
      const mockStudents = [
        { id: 1, name: 'أحمد محمد الصالح', teacher_id: 1, supervisor_id: 1, progress: 85, lastAttendance: 'حاضر', hizb: 12, surah: 'البقرة' },
        { id: 2, name: 'فاطمة علي السعيد', teacher_id: 1, supervisor_id: 1, progress: 92, lastAttendance: 'حاضر', hizb: 15, surah: 'آل عمران' },
        { id: 3, name: 'يوسف حسن العمري', teacher_id: 1, supervisor_id: 2, progress: 78, lastAttendance: 'غائب', hizb: 8, surah: 'النساء' },
        { id: 4, name: 'مريم خالد الأحمد', teacher_id: 1, supervisor_id: 2, progress: 95, lastAttendance: 'حاضر', hizb: 18, surah: 'المائدة' },
        { id: 5, name: 'عمر سعيد الحارثي', teacher_id: 1, supervisor_id: 1, progress: 70, lastAttendance: 'حاضر', hizb: 6, surah: 'الأنعام' },
      ]
      setStudents(mockStudents)
      
      // Calculate stats
      setStats({
        totalStudents: mockStudents.length,
        presentToday: mockStudents.filter(s => s.lastAttendance === 'حاضر').length,
        avgProgress: Math.round(mockStudents.reduce((acc, s) => acc + s.progress, 0) / mockStudents.length),
        recentActivities: [
          { student: 'فاطمة علي', action: 'أكملت حفظ سورة آل عمران', time: 'منذ ساعتين' },
          { student: 'أحمد محمد', action: 'حضور اليوم', time: 'منذ 3 ساعات' },
          { student: 'مريم خالد', action: 'حصلت على 98% في المراجعة', time: 'منذ 5 ساعات' }
        ]
      })
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAttendanceToggle = (studentId) => {
    setTodayAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : prev[studentId] === 'absent' ? undefined : 'present'
    }))
  }

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getAttendanceColor = (studentId) => {
    const status = todayAttendance[studentId]
    if (status === 'present') return 'bg-green-600 border-green-400'
    if (status === 'absent') return 'bg-red-600 border-red-400'
    return 'bg-white/10 border-white/20'
  }

  return (
    <div className='min-h-screen w-screen bg-black text-white overflow-x-hidden'>
      {/* Enhanced Header with Gradient */}
      <div className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10' />
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className='relative p-6 md:p-10 text-center'
        >
          <h1 className='Styled text-5xl md:text-6xl lg:text-7xl text-white mb-3'>
            فضاء الأستاذ
          </h1>
          <p className='Normal text-white/70 text-lg md:text-xl'>
            إدارة متكاملة للطلاب والحضور والتقدم الدراسي
          </p>
        </motion.div>
      </div>

      {/* Enhanced Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className='sticky top-0 z-30 bg-black/90 backdrop-blur-lg border-b border-white/10 px-4 md:px-8 py-4'
      >
        <div className='flex flex-wrap justify-center gap-2 md:gap-3 max-w-4xl mx-auto'>
          {[
            { id: 'dashboard', label: 'لوحة التحكم', icon: '📊' },
            { id: 'students', label: 'الطلاب', icon: '👥' },
            { id: 'attendance', label: 'الحضور', icon: '✓' },
            { id: 'progress', label: 'التقدم', icon: '📈' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-xl Styled text-base md:text-lg transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-white text-black shadow-xl'
                  : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              <span className='text-xl'>{tab.icon}</span>
              <span className='hidden sm:inline'>{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Content Area */}
      <div className='p-4 md:p-8 max-w-7xl mx-auto'>
        <AnimatePresence mode='wait'>
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <motion.div
              key='dashboard'
              variants={tabVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
            >
              {/* Stats Cards */}
              <motion.div
                variants={containerVariants}
                initial='hidden'
                animate='visible'
                className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8'
              >
                <motion.div
                  variants={itemVariants}
                  whileHover={cardHover}
                  className='bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-2xl p-6 md:p-8'
                >
                  <div className='text-4xl md:text-5xl mb-3'>👥</div>
                  <h3 className='Styled text-3xl md:text-4xl text-white mb-2'>{stats.totalStudents}</h3>
                  <p className='Normal text-white/70 text-lg'>إجمالي الطلاب</p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={cardHover}
                  className='bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-2xl p-6 md:p-8'
                >
                  <div className='text-4xl md:text-5xl mb-3'>✓</div>
                  <h3 className='Styled text-3xl md:text-4xl text-white mb-2'>{stats.presentToday}</h3>
                  <p className='Normal text-white/70 text-lg'>حضور اليوم</p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={cardHover}
                  className='bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-2xl p-6 md:p-8'
                >
                  <div className='text-4xl md:text-5xl mb-3'>📈</div>
                  <h3 className='Styled text-3xl md:text-4xl text-white mb-2'>{stats.avgProgress}%</h3>
                  <p className='Normal text-white/70 text-lg'>متوسط التقدم</p>
                </motion.div>
              </motion.div>

              {/* Recent Activities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className='bg-[#2E2E2E] rounded-2xl p-6 md:p-8 border border-white/5'
              >
                <h2 className='Styled text-2xl md:text-3xl text-white mb-6 flex items-center gap-3'>
                  <span>🔔</span> النشاطات الأخيرة
                </h2>
                <div className='space-y-4'>
                  {stats.recentActivities.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className='bg-black/40 rounded-xl p-4 border border-white/5 hover:border-white/20 transition-all'
                    >
                      <p className='Normal text-white text-base md:text-lg mb-1'>
                        <span className='Styled text-blue-400'>{activity.student}</span> - {activity.action}
                      </p>
                      <p className='Normal text-white/50 text-sm'>{activity.time}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <motion.div
              key='students'
              variants={tabVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
            >
              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='mb-6 md:mb-8'
              >
                <div className='relative max-w-2xl mx-auto'>
                  <input
                    type='text'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder='ابحث عن طالب...'
                    className='w-full bg-[#2E2E2E] border border-white/10 text-white rounded-2xl px-6 py-4 pr-14 Normal text-lg focus:border-white/30 focus:outline-none transition-all'
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 absolute right-5 top-1/2 -translate-y-1/2 text-white/40">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </div>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial='hidden'
                animate='visible'
                className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'
              >
                {loading ? (
                  <div className='col-span-full text-center Styled text-2xl text-white/60 py-20'>
                    جاري التحميل...
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className='col-span-full text-center Styled text-xl text-white/60 py-20'>
                    لا توجد نتائج
                  </div>
                ) : (
                  filteredStudents.map((student) => (
                    <motion.div
                      key={student.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.03, y: -8 }}
                      className='bg-[#2E2E2E] rounded-2xl p-6 cursor-pointer border border-white/5 hover:border-white/20 transition-all group'
                      onClick={() => setSelectedStudent(student)}
                    >
                      <div className='flex items-start justify-between mb-4'>
                        <div className='w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl'>
                          👤
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs Normal ${
                          student.lastAttendance === 'حاضر' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {student.lastAttendance}
                        </div>
                      </div>
                      
                      <h3 className='Styled text-xl md:text-2xl text-white mb-3 group-hover:text-blue-400 transition-colors'>
                        {student.name}
                      </h3>
                      
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                          <span className='Normal text-white/60 text-sm'>التقدم:</span>
                          <span className='Styled text-white text-base'>{student.progress}%</span>
                        </div>
                        <div className='w-full bg-black/40 rounded-full h-2'>
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${student.progress}%` }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className='bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full'
                          />
                        </div>
                        <div className='flex items-center justify-between text-sm mt-3'>
                          <span className='Normal text-white/60'>الحزب {student.hizb}</span>
                          <span className='Normal text-white/60'>{student.surah}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </motion.div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <motion.div
              key='attendance'
              variants={tabVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
            >
              <div className='bg-[#2E2E2E] rounded-2xl p-6 md:p-8 border border-white/5'>
                <div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4'>
                  <h2 className='Styled text-3xl md:text-4xl text-white'>
                    تسجيل الحضور
                  </h2>
                  <input
                    type='date'
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className='bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 Normal text-base focus:border-white/30 focus:outline-none'
                  />
                </div>

                <motion.div
                  variants={containerVariants}
                  initial='hidden'
                  animate='visible'
                  className='space-y-3 md:space-y-4'
                >
                  {students.map((student) => (
                    <motion.div
                      key={student.id}
                      variants={itemVariants}
                      className='flex flex-col md:flex-row items-start md:items-center justify-between bg-black/30 rounded-xl p-4 md:p-5 gap-4 border border-white/5 hover:border-white/10 transition-all'
                    >
                      <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl flex-shrink-0'>
                          👤
                        </div>
                        <div>
                          <span className='Styled text-lg md:text-xl text-white block'>
                            {student.name}
                          </span>
                          <span className='Normal text-white/50 text-sm'>
                            رقم الطالب: {student.id}
                          </span>
                        </div>
                      </div>
                      
                      <div className='flex gap-3 w-full md:w-auto'>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setTodayAttendance(prev => ({ ...prev, [student.id]: 'present' }))
                          }}
                          className={`flex-1 md:flex-none px-6 md:px-8 py-3 rounded-xl Normal text-base md:text-lg border-2 transition-all ${
                            todayAttendance[student.id] === 'present'
                              ? 'bg-green-600 border-green-400 text-white'
                              : 'bg-green-600/10 border-green-600/30 text-green-400 hover:bg-green-600/20'
                          }`}
                        >
                          حاضر ✓
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setTodayAttendance(prev => ({ ...prev, [student.id]: 'absent' }))
                          }}
                          className={`flex-1 md:flex-none px-6 md:px-8 py-3 rounded-xl Normal text-base md:text-lg border-2 transition-all ${
                            todayAttendance[student.id] === 'absent'
                              ? 'bg-red-600 border-red-400 text-white'
                              : 'bg-red-600/10 border-red-600/30 text-red-400 hover:bg-red-600/20'
                          }`}
                        >
                          غائب ✗
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className='w-full mt-8 bg-white text-black py-4 rounded-xl Styled text-xl hover:bg-white/90 transition-all'
                >
                  حفظ الحضور
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && (
            <motion.div
              key='progress'
              variants={tabVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
            >
              <div className='bg-[#2E2E2E] rounded-2xl p-6 md:p-8 border border-white/5'>
                <h2 className='Styled text-3xl md:text-4xl text-white mb-8 text-center'>
                  تسجيل التقدم الدراسي
                </h2>
                
                <form className='space-y-6 max-w-3xl mx-auto' onSubmit={(e) => e.preventDefault()}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className='Normal text-white/80 block mb-3 text-lg md:text-xl flex items-center gap-2'>
                      <span>👤</span> اختر الطالب
                    </label>
                    <select className='w-full bg-black/40 border border-white/10 text-white rounded-xl p-4 Styled text-lg focus:border-white/30 focus:outline-none'>
                      <option value=''>-- اختر الطالب --</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name}
                        </option>
                      ))}
                    </select>
                  </motion.div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6'>
                    {[
                      { label: 'الحزب', placeholder: 'رقم الحزب', icon: '📖' },
                      { label: 'الثمن', placeholder: 'رقم الثمن', icon: '📝' },
                      { label: 'السورة', placeholder: 'اسم السورة', icon: '📜' }
                    ].map((field, index) => (
                      <motion.div
                        key={field.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        <label className='Normal text-white/80 block mb-3 text-base md:text-lg flex items-center gap-2'>
                          <span>{field.icon}</span> {field.label}
                        </label>
                        <input
                          type='text'
                          className='w-full bg-black/40 border border-white/10 text-white rounded-xl p-3 md:p-4 Normal text-base md:text-lg focus:border-white/30 focus:outline-none'
                          placeholder={field.placeholder}
                        />
                      </motion.div>
                    ))}
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
                    {[
                      { label: 'من الآية', icon: '➡️' },
                      { label: 'إلى الآية', icon: '⬅️' }
                    ].map((field, index) => (
                      <motion.div
                        key={field.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <label className='Normal text-white/80 block mb-3 text-base md:text-lg flex items-center gap-2'>
                          <span>{field.icon}</span> {field.label}
                        </label>
                        <input
                          type='number'
                          className='w-full bg-black/40 border border-white/10 text-white rounded-xl p-3 md:p-4 Normal text-base md:text-lg focus:border-white/30 focus:outline-none'
                          placeholder='رقم الآية'
                        />
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label className='Normal text-white/80 block mb-3 text-lg md:text-xl flex items-center gap-2'>
                      <span>📋</span> النوع
                    </label>
                    <select className='w-full bg-black/40 border border-white/10 text-white rounded-xl p-4 Styled text-lg focus:border-white/30 focus:outline-none'>
                      <option value=''>-- اختر النوع --</option>
                      <option value='حفظ'>📚 حفظ جديد</option>
                      <option value='مراجعة'>🔄 مراجعة</option>
                      <option value='تلاوة'>📖 تلاوة</option>
                    </select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label className='Normal text-white/80 block mb-3 text-lg md:text-xl flex items-center gap-2'>
                      <span>⭐</span> النقطة (من 0 إلى 100)
                    </label>
                    <input
                      type='number'
                      min='0'
                      max='100'
                      className='w-full bg-black/40 border border-white/10 text-white rounded-xl p-4 Normal text-lg focus:border-white/30 focus:outline-none'
                      placeholder='أدخل النقطة'
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <label className='Normal text-white/80 block mb-3 text-lg md:text-xl flex items-center gap-2'>
                      <span>📝</span> ملاحظات
                    </label>
                    <textarea
                      rows='5'
                      className='w-full bg-black/40 border border-white/10 text-white rounded-xl p-4 Normal text-base md:text-lg resize-none focus:border-white/30 focus:outline-none'
                      placeholder='أضف ملاحظاتك حول أداء الطالب...'
                    ></textarea>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type='submit'
                    className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 md:py-5 rounded-xl Styled text-xl md:text-2xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-600/20'
                  >
                    💾 حفظ التقدم
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default TeacherPage