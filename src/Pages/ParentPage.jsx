import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ParentPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [children, setChildren] = useState([])
  const [selectedChild, setSelectedChild] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDateRange, setSelectedDateRange] = useState('week')
  const [stats, setStats] = useState({
    totalChildren: 0,
    avgAttendance: 0,
    avgProgress: 0,
    recentUpdates: []
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

  // Fetch children data from API
  useEffect(() => {
    fetchChildren()
  }, [])

  const fetchChildren = async () => {
    setLoading(true)
    try {
      // Mock data with comprehensive details
      const mockChildren = [
        {
          id: 1,
          name: 'أحمد محمد الصالح',
          teacher: 'الأستاذ علي حسن',
          progress: 85,
          attendanceRate: 92,
          currentHizb: 12,
          currentSurah: 'البقرة',
          lastSession: 'منذ يومين',
          recentScores: [95, 88, 92, 90, 87],
          attendanceHistory: [
            { date: '2024-02-10', status: 'حاضر' },
            { date: '2024-02-09', status: 'حاضر' },
            { date: '2024-02-08', status: 'غائب' },
            { date: '2024-02-07', status: 'حاضر' },
            { date: '2024-02-06', status: 'حاضر' }
          ],
          progressHistory: [
            { date: '2024-02-10', type: 'حفظ', surah: 'البقرة', from: 15, to: 20, score: 95, notes: 'ممتاز، حفظ متقن' },
            { date: '2024-02-08', type: 'مراجعة', surah: 'البقرة', from: 1, to: 14, score: 88, notes: 'جيد، يحتاج تركيز أكثر' },
            { date: '2024-02-06', type: 'حفظ', surah: 'البقرة', from: 10, to: 14, score: 92, notes: 'أداء جيد جداً' }
          ]
        },
        {
          id: 2,
          name: 'فاطمة محمد الصالح',
          teacher: 'الأستاذة نور الدين',
          progress: 78,
          attendanceRate: 88,
          currentHizb: 8,
          currentSurah: 'آل عمران',
          lastSession: 'منذ 3 أيام',
          recentScores: [82, 85, 80, 88, 84],
          attendanceHistory: [
            { date: '2024-02-10', status: 'حاضر' },
            { date: '2024-02-09', status: 'حاضر' },
            { date: '2024-02-08', status: 'حاضر' },
            { date: '2024-02-07', status: 'غائب' },
            { date: '2024-02-06', status: 'حاضر' }
          ],
          progressHistory: [
            { date: '2024-02-10', type: 'مراجعة', surah: 'آل عمران', from: 1, to: 10, score: 85, notes: 'جيد، واصلي' },
            { date: '2024-02-07', type: 'حفظ', surah: 'آل عمران', from: 11, to: 15, score: 82, notes: 'يحتاج المزيد من التكرار' }
          ]
        }
      ]
      
      setChildren(mockChildren)
      
      // Calculate overall stats
      const totalChildren = mockChildren.length
      const avgAttendance = Math.round(
        mockChildren.reduce((acc, child) => acc + child.attendanceRate, 0) / totalChildren
      )
      const avgProgress = Math.round(
        mockChildren.reduce((acc, child) => acc + child.progress, 0) / totalChildren
      )

      // Generate recent updates
      const recentUpdates = []
      mockChildren.forEach(child => {
        child.progressHistory.slice(0, 2).forEach(progress => {
          recentUpdates.push({
            childName: child.name,
            action: `${progress.type}: ${progress.surah} (${progress.from}-${progress.to})`,
            score: progress.score,
            date: progress.date
          })
        })
      })
      recentUpdates.sort((a, b) => new Date(b.date) - new Date(a.date))

      setStats({
        totalChildren,
        avgAttendance,
        avgProgress,
        recentUpdates: recentUpdates.slice(0, 5)
      })
    } catch (error) {
      console.error('Error fetching children:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredChildren = children.filter(child =>
    child.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getAttendanceColor = (rate) => {
    if (rate >= 90) return 'from-green-600/20 to-green-800/20 border-green-500/30'
    if (rate >= 75) return 'from-yellow-600/20 to-yellow-800/20 border-yellow-500/30'
    return 'from-red-600/20 to-red-800/20 border-red-500/30'
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 75) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className='min-h-screen w-screen bg-black text-white overflow-x-hidden'>
      {/* Enhanced Header with Gradient */}
      <div className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10' />
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className='relative p-6 md:p-10 text-center'
        >
          <h1 className='Styled text-5xl md:text-6xl lg:text-7xl text-white mb-3'>
            فضاء ولي الأمر
          </h1>
          <p className='Normal text-white/70 text-lg md:text-xl'>
            متابعة شاملة لأداء وتقدم أبنائكم في الحفظ
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
            { id: 'children', label: 'الأبناء', icon: '👨‍👩‍👧‍👦' },
            { id: 'attendance', label: 'الحضور', icon: '📅' },
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
                  className='bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-2xl p-6 md:p-8'
                >
                  <div className='text-4xl md:text-5xl mb-3'>👨‍👩‍👧‍👦</div>
                  <h3 className='Styled text-3xl md:text-4xl text-white mb-2'>{stats.totalChildren}</h3>
                  <p className='Normal text-white/70 text-lg'>عدد الأبناء</p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={cardHover}
                  className='bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-2xl p-6 md:p-8'
                >
                  <div className='text-4xl md:text-5xl mb-3'>📅</div>
                  <h3 className='Styled text-3xl md:text-4xl text-white mb-2'>{stats.avgAttendance}%</h3>
                  <p className='Normal text-white/70 text-lg'>متوسط الحضور</p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={cardHover}
                  className='bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-2xl p-6 md:p-8'
                >
                  <div className='text-4xl md:text-5xl mb-3'>📈</div>
                  <h3 className='Styled text-3xl md:text-4xl text-white mb-2'>{stats.avgProgress}%</h3>
                  <p className='Normal text-white/70 text-lg'>متوسط التقدم</p>
                </motion.div>
              </motion.div>

              {/* Children Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className='bg-[#2E2E2E] rounded-2xl p-6 md:p-8 border border-white/5 mb-8'
              >
                <h2 className='Styled text-2xl md:text-3xl text-white mb-6 flex items-center gap-3'>
                  <span>👨‍👩‍👧‍👦</span> نظرة عامة على الأبناء
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
                  {children.map((child, index) => (
                    <motion.div
                      key={child.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className='bg-black/40 rounded-xl p-5 border border-white/5 hover:border-white/20 transition-all cursor-pointer'
                      onClick={() => {
                        setSelectedChild(child)
                        setActiveTab('children')
                      }}
                    >
                      <div className='flex items-start justify-between mb-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl'>
                            👤
                          </div>
                          <div>
                            <h3 className='Styled text-lg md:text-xl text-white'>{child.name}</h3>
                            <p className='Normal text-white/50 text-sm'>{child.teacher}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className='grid grid-cols-2 gap-3 mt-4'>
                        <div className='bg-black/40 rounded-lg p-3'>
                          <p className='Normal text-white/60 text-xs mb-1'>التقدم</p>
                          <p className='Styled text-white text-lg'>{child.progress}%</p>
                        </div>
                        <div className='bg-black/40 rounded-lg p-3'>
                          <p className='Normal text-white/60 text-xs mb-1'>الحضور</p>
                          <p className='Styled text-white text-lg'>{child.attendanceRate}%</p>
                        </div>
                      </div>

                      <div className='mt-3 flex items-center justify-between text-sm'>
                        <span className='Normal text-white/60'>الحزب {child.currentHizb}</span>
                        <span className='Normal text-blue-400'>{child.currentSurah}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Updates */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className='bg-[#2E2E2E] rounded-2xl p-6 md:p-8 border border-white/5'
              >
                <h2 className='Styled text-2xl md:text-3xl text-white mb-6 flex items-center gap-3'>
                  <span>🔔</span> التحديثات الأخيرة
                </h2>
                <div className='space-y-4'>
                  {stats.recentUpdates.map((update, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className='bg-black/40 rounded-xl p-4 border border-white/5 hover:border-white/20 transition-all'
                    >
                      <div className='flex items-start justify-between mb-2'>
                        <p className='Normal text-white text-base md:text-lg'>
                          <span className='Styled text-purple-400'>{update.childName}</span>
                        </p>
                        <span className={`Styled text-xl ${getScoreColor(update.score)}`}>
                          {update.score}%
                        </span>
                      </div>
                      <p className='Normal text-white/70 text-sm mb-1'>{update.action}</p>
                      <p className='Normal text-white/50 text-xs'>{update.date}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Children Tab */}
          {activeTab === 'children' && (
            <motion.div
              key='children'
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
                    placeholder='ابحث عن ابن أو ابنة...'
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
                className='space-y-6'
              >
                {loading ? (
                  <div className='text-center Styled text-2xl text-white/60 py-20'>
                    جاري التحميل...
                  </div>
                ) : filteredChildren.length === 0 ? (
                  <div className='text-center Styled text-xl text-white/60 py-20'>
                    لا توجد نتائج
                  </div>
                ) : (
                  filteredChildren.map((child) => (
                    <motion.div
                      key={child.id}
                      variants={itemVariants}
                      className='bg-[#2E2E2E] rounded-2xl p-6 md:p-8 border border-white/5'
                    >
                      {/* Child Header */}
                      <div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4'>
                        <div className='flex items-center gap-4'>
                          <div className='w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl'>
                            👤
                          </div>
                          <div>
                            <h3 className='Styled text-2xl md:text-3xl text-white mb-1'>{child.name}</h3>
                            <p className='Normal text-white/60 text-base flex items-center gap-2'>
                              <span>👨‍🏫</span> {child.teacher}
                            </p>
                          </div>
                        </div>
                        <div className='flex gap-3'>
                          <div className='bg-black/40 rounded-xl px-4 py-2 border border-white/10'>
                            <p className='Normal text-white/60 text-xs mb-1'>آخر جلسة</p>
                            <p className='Styled text-white text-sm'>{child.lastSession}</p>
                          </div>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
                        <div className='bg-black/40 rounded-xl p-4 border border-white/5'>
                          <p className='Normal text-white/60 text-sm mb-2'>التقدم الكلي</p>
                          <p className='Styled text-2xl text-white'>{child.progress}%</p>
                          <div className='w-full bg-white/10 rounded-full h-2 mt-2'>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${child.progress}%` }}
                              transition={{ delay: 0.5, duration: 1 }}
                              className='bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full'
                            />
                          </div>
                        </div>
                        
                        <div className='bg-black/40 rounded-xl p-4 border border-white/5'>
                          <p className='Normal text-white/60 text-sm mb-2'>نسبة الحضور</p>
                          <p className='Styled text-2xl text-white'>{child.attendanceRate}%</p>
                        </div>

                        <div className='bg-black/40 rounded-xl p-4 border border-white/5'>
                          <p className='Normal text-white/60 text-sm mb-2'>الحزب الحالي</p>
                          <p className='Styled text-2xl text-white'>{child.currentHizb}</p>
                        </div>

                        <div className='bg-black/40 rounded-xl p-4 border border-white/5'>
                          <p className='Normal text-white/60 text-sm mb-2'>السورة</p>
                          <p className='Styled text-lg text-blue-400'>{child.currentSurah}</p>
                        </div>
                      </div>

                      {/* Recent Scores */}
                      <div className='bg-black/40 rounded-xl p-5 border border-white/5 mb-6'>
                        <h4 className='Styled text-lg text-white mb-4 flex items-center gap-2'>
                          <span>📊</span> النقاط الأخيرة
                        </h4>
                        <div className='flex gap-3 overflow-x-auto pb-2'>
                          {child.recentScores.map((score, idx) => (
                            <div
                              key={idx}
                              className='min-w-[80px] bg-black/40 rounded-lg p-3 text-center border border-white/5'
                            >
                              <p className={`Styled text-2xl ${getScoreColor(score)}`}>{score}</p>
                              <p className='Normal text-white/50 text-xs mt-1'>جلسة {idx + 1}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Progress History */}
                      <div className='bg-black/40 rounded-xl p-5 border border-white/5'>
                        <h4 className='Styled text-lg text-white mb-4 flex items-center gap-2'>
                          <span>📖</span> سجل التقدم الأخير
                        </h4>
                        <div className='space-y-3'>
                          {child.progressHistory.map((progress, idx) => (
                            <div
                              key={idx}
                              className='bg-black/40 rounded-lg p-4 border border-white/5'
                            >
                              <div className='flex items-start justify-between mb-2'>
                                <div className='flex items-center gap-2'>
                                  <span className='text-xl'>
                                    {progress.type === 'حفظ' ? '📚' : progress.type === 'مراجعة' ? '🔄' : '📖'}
                                  </span>
                                  <div>
                                    <p className='Styled text-white text-base'>{progress.surah}</p>
                                    <p className='Normal text-white/60 text-sm'>
                                      من الآية {progress.from} إلى {progress.to}
                                    </p>
                                  </div>
                                </div>
                                <span className={`Styled text-xl ${getScoreColor(progress.score)}`}>
                                  {progress.score}%
                                </span>
                              </div>
                              <p className='Normal text-white/70 text-sm mb-1'>{progress.notes}</p>
                              <p className='Normal text-white/50 text-xs'>{progress.date}</p>
                            </div>
                          ))}
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
                    سجل الحضور
                  </h2>
                  <select
                    value={selectedDateRange}
                    onChange={(e) => setSelectedDateRange(e.target.value)}
                    className='bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 Normal text-base focus:border-white/30 focus:outline-none'
                  >
                    <option value='week'>آخر أسبوع</option>
                    <option value='month'>آخر شهر</option>
                    <option value='all'>الكل</option>
                  </select>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial='hidden'
                  animate='visible'
                  className='space-y-6'
                >
                  {children.map((child) => (
                    <motion.div
                      key={child.id}
                      variants={itemVariants}
                      className='bg-black/30 rounded-xl p-5 md:p-6 border border-white/5'
                    >
                      <div className='flex items-center gap-4 mb-5'>
                        <div className='w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl'>
                          👤
                        </div>
                        <div className='flex-1'>
                          <h3 className='Styled text-xl md:text-2xl text-white'>{child.name}</h3>
                          <p className='Normal text-white/60 text-sm'>
                            نسبة الحضور: <span className='Styled text-green-400'>{child.attendanceRate}%</span>
                          </p>
                        </div>
                      </div>

                      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3'>
                        {child.attendanceHistory.map((record, idx) => (
                          <div
                            key={idx}
                            className={`rounded-lg p-3 text-center border ${
                              record.status === 'حاضر'
                                ? 'bg-green-600/20 border-green-500/30'
                                : 'bg-red-600/20 border-red-500/30'
                            }`}
                          >
                            <p className='Normal text-white/80 text-xs mb-1'>
                              {new Date(record.date).toLocaleDateString('ar-EG', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </p>
                            <p className={`Styled text-base ${
                              record.status === 'حاضر' ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {record.status === 'حاضر' ? '✓' : '✗'}
                            </p>
                            <p className='Normal text-white/70 text-xs mt-1'>{record.status}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
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
                  التقدم التفصيلي
                </h2>

                <motion.div
                  variants={containerVariants}
                  initial='hidden'
                  animate='visible'
                  className='space-y-8'
                >
                  {children.map((child) => (
                    <motion.div
                      key={child.id}
                      variants={itemVariants}
                      className='bg-black/30 rounded-xl p-6 border border-white/5'
                    >
                      {/* Child Header */}
                      <div className='flex items-center gap-4 mb-6 pb-6 border-b border-white/5'>
                        <div className='w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl'>
                          👤
                        </div>
                        <div className='flex-1'>
                          <h3 className='Styled text-2xl text-white mb-1'>{child.name}</h3>
                          <div className='flex items-center gap-4 text-sm'>
                            <span className='Normal text-white/60'>
                              التقدم: <span className='Styled text-purple-400'>{child.progress}%</span>
                            </span>
                            <span className='Normal text-white/60'>•</span>
                            <span className='Normal text-white/60'>
                              الحزب {child.currentHizb} - {child.currentSurah}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Chart */}
                      <div className='bg-black/40 rounded-xl p-5 mb-6 border border-white/5'>
                        <h4 className='Styled text-lg text-white mb-4'>مخطط التقدم</h4>
                        <div className='space-y-3'>
                          <div>
                            <div className='flex items-center justify-between mb-2'>
                              <span className='Normal text-white/70 text-sm'>الحفظ</span>
                              <span className='Styled text-white'>{child.progress}%</span>
                            </div>
                            <div className='w-full bg-white/10 rounded-full h-3'>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${child.progress}%` }}
                                transition={{ delay: 0.3, duration: 1 }}
                                className='bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full'
                              />
                            </div>
                          </div>
                          <div>
                            <div className='flex items-center justify-between mb-2'>
                              <span className='Normal text-white/70 text-sm'>الحضور</span>
                              <span className='Styled text-white'>{child.attendanceRate}%</span>
                            </div>
                            <div className='w-full bg-white/10 rounded-full h-3'>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${child.attendanceRate}%` }}
                                transition={{ delay: 0.5, duration: 1 }}
                                className='bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full'
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Detailed Progress History */}
                      <div className='bg-black/40 rounded-xl p-5 border border-white/5'>
                        <h4 className='Styled text-lg text-white mb-4 flex items-center gap-2'>
                          <span>📚</span> سجل الجلسات التفصيلي
                        </h4>
                        <div className='space-y-3 max-h-96 overflow-y-auto'>
                          {child.progressHistory.map((progress, idx) => (
                            <div
                              key={idx}
                              className='bg-black/40 rounded-lg p-4 border border-white/5 hover:border-white/20 transition-all'
                            >
                              <div className='flex items-start justify-between mb-3'>
                                <div className='flex items-start gap-3'>
                                  <span className='text-2xl mt-1'>
                                    {progress.type === 'حفظ' ? '📚' : progress.type === 'مراجعة' ? '🔄' : '📖'}
                                  </span>
                                  <div>
                                    <div className='flex items-center gap-2 mb-1'>
                                      <span className='Styled text-white text-lg'>{progress.surah}</span>
                                      <span className='px-2 py-1 bg-purple-600/20 border border-purple-500/30 rounded text-xs Normal text-purple-400'>
                                        {progress.type}
                                      </span>
                                    </div>
                                    <p className='Normal text-white/60 text-sm'>
                                      الآيات: {progress.from} - {progress.to}
                                    </p>
                                  </div>
                                </div>
                                <div className='text-center'>
                                  <p className={`Styled text-2xl ${getScoreColor(progress.score)}`}>
                                    {progress.score}
                                  </p>
                                  <p className='Normal text-white/50 text-xs'>النقطة</p>
                                </div>
                              </div>
                              
                              <div className='bg-black/40 rounded-lg p-3 mb-2'>
                                <p className='Normal text-white/80 text-sm flex items-start gap-2'>
                                  <span className='text-base'>💬</span>
                                  <span>{progress.notes}</span>
                                </p>
                              </div>
                              
                              <p className='Normal text-white/50 text-xs flex items-center gap-2'>
                                <span>📅</span> {progress.date}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ParentPage