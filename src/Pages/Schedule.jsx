import React from "react";
import Background from "../assets/Bg2.jpg";
import { motion } from "framer-motion";

const Schedule = () => {
  const scheduleData = [
    { day: "السبت", time: "٨:٠٠ - ١٢:٠٠", subject: "القرآن الكريم", icon: "📖" },
    { day: "الأحد", time: "٩:٠٠ - ١٣:٠٠", subject: "التجويد والتلاوة", icon: "🎙️" },
    { day: "الاثنين", time: "٨:٠٠ - ١٢:٠٠", subject: "الفقه واللغة", icon: "📚" },
  ];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, type: "spring", stiffness: 80 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2 + i * 0.15,
        duration: 0.7,
        type: "spring",
        stiffness: 100,
      },
    }),
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen w-screen flex items-center justify-center relative overflow-hidden px-6"
      style={{
        background:
          "radial-gradient(circle at 30% 20%, #1f160c 0%, #0f0b05 60%, #0a0703 100%)",
      }}
    >
      {/* Soft golden ambient glow */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-yellow-700/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px]" />

      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 60 }}
          className="relative rounded-3xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
          style={{ height: "clamp(600px, 60vh, 600px)" }}
        >
          <div
            className="absolute inset-0 scale-105 hover:scale-100 transition-transform duration-700"
            style={{
              backgroundImage: `url(${Background})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, transparent 30%, rgba(10,7,3,0.95) 100%)",
            }}
          />
          <div
            className="absolute inset-4 rounded-2xl pointer-events-none"
            style={{ border: "1px solid rgba(212,175,55,0.35)" }}
          />

          <div className="absolute bottom-6 right-0 left-0 text-center">
            <span
              className="text-2xl tracking-widest font-semibold"
              style={{
                background: "linear-gradient(90deg,#d4af37,#f8e7a1,#d4af37)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              مدرسة الجياد
            </span>
          </div>
        </motion.div>

        {/* Schedule Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col"
        >
          <motion.h1
            variants={titleVariants}
            className="mb-4 text-right font-bold"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              background: "linear-gradient(90deg,#d4af37,#f8e7a1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            أوقات التدريس
          </motion.h1>

          <p
            className="text-right mb-10 text-lg"
            style={{ color: "rgba(255,215,130,0.6)" }}
          >
            جدول الحصص الأسبوعي
          </p>

          {/* Main Glass Card */}
          <div
            className="rounded-3xl p-8 backdrop-blur-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(212,175,55,0.07), rgba(255,215,130,0.03))",
              border: "1px solid rgba(212,175,55,0.25)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
            }}
          >
            <div className="flex flex-col gap-6">
              {scheduleData.map((item, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.04 }}
                  className="group relative flex items-center justify-between rounded-2xl px-6 py-6 transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(212,175,55,0.05))",
                    border: "1px solid rgba(212,175,55,0.18)",
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      boxShadow: "0 0 60px rgba(212,175,55,0.25)",
                    }}
                  />

                  {/* Day + Subject */}
                  <div className="flex flex-col items-end z-10">
                    <span
                      className="text-3xl flex items-center gap-3 font-semibold"
                      style={{ color: "#f8e7a1" }}
                    >
                      {item.icon} {item.day}
                    </span>
                    <span
                      className="mt-1 text-sm"
                      style={{ color: "rgba(255,215,130,0.65)" }}
                    >
                      {item.subject}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="z-10 text-left">
                    <span
                      className="text-2xl tabular-nums font-semibold"
                      style={{ color: "#d4af37", direction: "ltr" }}
                    >
                      {item.time}
                    </span>
                    <div
                      className="text-xs mt-1"
                      style={{ color: "rgba(255,215,130,0.4)" }}
                    >
                      ساعات الدراسة
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Schedule;