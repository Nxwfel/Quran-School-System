import React from "react";
import { motion } from "framer-motion";
import Background from "../assets/Bg2.jpg";

const Schedule = () => {
  const scheduleData = [
    { day: "السبت", time: "٨:٠٠ - ١٢:٠٠", subject: "القرآن الكريم", icon: "📖" },
    { day: "الأحد", time: "٩:٠٠ - ١٣:٠٠", subject: "التجويد والتلاوة", icon: "🎙️" },
    { day: "الاثنين", time: "٨:٠٠ - ١٢:٠٠", subject: "الفقه واللغة", icon: "📚" },
  ];

  return (
    <div
      dir="rtl"
      className="relative Styled min-h-screen w-screen overflow-hidden flex items-center justify-center px-6"
      style={{
        background:
          "radial-gradient(circle at 50% 20%, #1a1208 0%, #0c0804 60%, #050302 100%)",
      }}
    >
      {/* Cinematic Slow Zoom Background */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${Background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.15,
        }}
      />

      {/* Golden Light Beam */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(198,167,94,0.5) 0%, transparent 70%)",
          filter: "blur(140px)",
          opacity: 0.25,
        }}
      />

      {/* Grain Overlay */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "url('https://grainy-gradients.vercel.app/noise.svg')",
        }}
      />

      <div className="relative z-10 max-w-6xl text-white w-full grid lg:grid-cols-2 gap-20 items-center">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, letterSpacing: "0.05em" }}
          transition={{ duration: 2 }}
          className="text-right text-white"
        >
          <h1
            className="text-6xl font-bold mb-6 "
          >
            أوقات التدريس
          </h1>
          <p className="text-lg text-white">
            جدول الحصص الأسبوعي — مدرسة الجياد
          </p>
        </motion.div>

        {/* Cards */}
        <div className="flex flex-col gap-8">
          {scheduleData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="relative rounded-3xl p-8 backdrop-blur-xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(198,167,94,0.05))",
                border: "1px solid rgba(198,167,94,0.25)",
                boxShadow: "0 40px 80px rgba(0,0,0,0.8)",
              }}
            >
              <div className="flex justify-between items-center">
                <div className="text-right">
                  <div className="text-3xl font-semibold text-white">
                   {item.day}
                  </div>
                  <div className="text-sm text-white/50 mt-2">
                    {item.subject}
                  </div>
                </div>

                <div className="text-left">
                  <div className="text-2xl Normal text-white/35 font-semibold">
                    {item.time}
                  </div>
                  <div className="text-xs text-white/50 mt-1">
                    ساعات الدراسة
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Schedule;