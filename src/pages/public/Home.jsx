import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaArrowRight, FaAward, FaUsers, FaClock, FaCheckCircle, FaRocket, FaShieldAlt, FaStar, FaCrown, FaPlay, FaMapMarkerAlt, FaExpand } from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';
import { packagesAPI, projectsAPI, settingsAPI } from '../../services/apiService';
import { getWhatsAppLink } from '../../utils/helpers';

// Logo path
const logoDark = '/images/logo-dark.png';

const Home = () => {
  const { t, i18n } = useTranslation();
  const [packages, setPackages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [settings, setSettings] = useState(null);
  const isArabic = i18n.language === 'ar';
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packagesData, projectsData, settingsData] = await Promise.all([
          packagesAPI.getAll({ isActive: true }),
          projectsAPI.getAll({ isFeatured: true, isActive: true }),
          settingsAPI.get(),
        ]);
        setPackages(packagesData.slice(0, 3));
        setProjects(projectsData.slice(0, 6));
        setSettings(settingsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const whatsappLink = getWhatsAppLink(
    settings?.whatsapp || '+966500000000',
    isArabic ? 'مرحباً، أريد استشارة' : 'Hello, I need a consultation'
  );

  return (
    <div className="bg-dark">
      {/* ============================================= */}
      {/* PREMIUM HERO SECTION */}
      {/* ============================================= */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video/Image Background with Parallax */}
        <motion.div
          className="absolute inset-0"
          style={{ y }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
            style={{
              backgroundImage: `url('/images/hero-bg.png')`,
            }}
          />
          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-900/80 to-amber-900/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-gray-900/50"></div>
        </motion.div>

        {/* Animated Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large rotating ring */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-amber-500/10 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-amber-500/20 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Floating particles */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                background: `rgba(212, 175, 55, ${0.1 + Math.random() * 0.3})`,
              }}
              animate={{
                y: [0, -50, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}

          {/* Glowing orbs */}
          <motion.div
            className="absolute top-1/4 right-1/4 w-64 h-64 bg-amber-500/20 rounded-full blur-[100px]"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px]"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>
        
        {/* Main Content */}
        <motion.div 
          className="container mx-auto px-4 relative z-10"
          style={{ opacity }}
        >
          <div className="max-w-5xl mx-auto text-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="mb-8"
            >
              <img 
                src={logoDark} 
                alt="Vertex Finish" 
                className="h-28 md:h-36 lg:h-44 w-auto mx-auto"
              />
            </motion.div>

            {/* Main Title - Company Name */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tight">
                <motion.span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                >
                  VERTEX
                </motion.span>
                <motion.span 
                  className="text-white ml-2 md:ml-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, type: 'spring' }}
                >
                  FINISH
                </motion.span>
              </h1>
            </motion.div>
            
            {/* Tagline */}
            <motion.p 
              className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-4 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1 }}
            >
              {isArabic ? 'تشطيبات على أعلى مستوى' : 'Finishing at the Highest Level'}
            </motion.p>
            
            {/* Description */}
            <motion.p 
              className="text-base md:text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 1 }}
            >
              {isArabic
                ? 'نحول رؤيتك إلى واقع مع أرقى خدمات التشطيبات للمشاريع السكنية والتجارية بجودة استثنائية'
                : 'We transform your vision into reality with premium finishing services for residential and commercial projects'}
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
            >
              <Link to="/packages">
                <motion.button
                  className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-xl font-bold text-lg text-gray-900 shadow-2xl shadow-amber-500/30 overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isArabic ? 'استكشف الباقات' : 'Explore Packages'}
                    <FaArrowRight className={`${isArabic ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>
              </Link>
              
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <motion.button
                  className="group px-8 py-4 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-600 hover:border-green-500 rounded-xl font-bold text-lg text-white flex items-center gap-3 transition-all duration-300 hover:bg-green-500/10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaWhatsapp className="text-2xl text-green-500" />
                  <span>{isArabic ? 'تواصل معنا' : 'Contact Us'}</span>
                </motion.button>
              </a>
            </motion.div>
            
            {/* Stats Row */}
            <motion.div 
              className="grid grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              {[
                { number: '500+', label: isArabic ? 'مشروع منجز' : 'Projects Completed', Icon: FaAward, color: 'from-amber-500 to-yellow-400' },
                { number: '15+', label: isArabic ? 'سنة خبرة' : 'Years Experience', Icon: FaClock, color: 'from-blue-500 to-cyan-400' },
                { number: '100%', label: isArabic ? 'رضا العملاء' : 'Client Satisfaction', Icon: FaUsers, color: 'from-green-500 to-emerald-400' },
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  className="relative group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 + i * 0.1 }}
                >
                  <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-5 md:p-8 border border-gray-700/50 hover:border-amber-500/50 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-amber-500/10">
                    <div className={`w-12 h-12 md:w-14 md:h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <stat.Icon className="text-xl md:text-2xl text-white" />
                    </div>
                    <div className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-xs md:text-sm text-gray-400 font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-500 uppercase tracking-widest">
              {isArabic ? 'اكتشف المزيد' : 'Scroll'}
            </span>
            <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center p-2">
              <motion.div 
                className="w-1.5 h-1.5 bg-amber-400 rounded-full"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>

      </section>

      {/* ============================================= */}
      {/* WHY CHOOSE US - PREMIUM DESIGN */}
      {/* ============================================= */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[180px]"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.5) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-6 py-2 mb-6"
            >
              <FaStar className="text-amber-400" />
              <span className="text-amber-300 font-medium">
                {isArabic ? 'لماذا نحن' : 'Why Choose Us'}
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">{isArabic ? 'لماذا ' : 'Why '}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
                Vertex Finish
              </span>
              <span className="text-white"></span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              {isArabic
                ? 'نقدم لك أفضل الحلول المتكاملة لمشاريعك العقارية مع ضمان الجودة والالتزام'
                : 'We provide the best integrated solutions for your real estate projects with quality assurance and commitment'}
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: FaAward,
                title: isArabic ? 'جودة استثنائية' : 'Exceptional Quality',
                desc: isArabic
                  ? 'نستخدم أفضل المواد والتقنيات الحديثة لضمان أعلى مستويات الجودة'
                  : 'We use the best materials and modern techniques to ensure the highest quality',
                gradient: 'from-blue-500 to-cyan-500',
                bgGlow: 'group-hover:shadow-blue-500/20'
              },
              {
                icon: FaUsers,
                title: isArabic ? 'فريق محترف' : 'Professional Team',
                desc: isArabic
                  ? 'فريق من الخبراء والحرفيين المهرة ذوي الخبرة الطويلة'
                  : 'Team of experts and skilled craftsmen with extensive experience',
                gradient: 'from-purple-500 to-pink-500',
                bgGlow: 'group-hover:shadow-purple-500/20'
              },
              {
                icon: FaClock,
                title: isArabic ? 'التزام بالمواعيد' : 'On-Time Delivery',
                desc: isArabic
                  ? 'نلتزم بمواعيد التسليم المحددة دون تأخير أو تأجيل'
                  : 'We commit to specified delivery dates without any delay',
                gradient: 'from-orange-500 to-red-500',
                bgGlow: 'group-hover:shadow-orange-500/20'
              },
              {
                icon: FaShieldAlt,
                title: isArabic ? 'ضمان شامل' : 'Comprehensive Warranty',
                desc: isArabic
                  ? 'نقدم ضمان شامل على جميع أعمالنا لراحة بالك'
                  : 'We provide comprehensive warranty on all our work for your peace of mind',
                gradient: 'from-green-500 to-emerald-500',
                bgGlow: 'group-hover:shadow-green-500/20'
              },
              {
                icon: FaRocket,
                title: isArabic ? 'تنفيذ سريع' : 'Fast Execution',
                desc: isArabic
                  ? 'نعمل بكفاءة عالية لإنجاز المشاريع في أسرع وقت'
                  : 'We work efficiently to complete projects in the shortest time',
                gradient: 'from-amber-500 to-yellow-500',
                bgGlow: 'group-hover:shadow-amber-500/20'
              },
              {
                icon: FaCheckCircle,
                title: isArabic ? 'رضا العملاء' : 'Customer Satisfaction',
                desc: isArabic
                  ? 'نسعى دائماً لتحقيق أعلى مستويات رضا عملائنا'
                  : 'We always strive to achieve the highest levels of customer satisfaction',
                gradient: 'from-indigo-500 to-violet-500',
                bgGlow: 'group-hover:shadow-indigo-500/20'
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className={`relative h-full bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-2 shadow-xl ${item.bgGlow} hover:shadow-2xl`}>
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <item.icon className="text-2xl text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>

                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-3xl">
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transform translate-x-16 -translate-y-16 rotate-45 transition-all duration-500 group-hover:translate-x-8 group-hover:-translate-y-8`}></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Preview */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-6 py-2 mb-6"
            >
              <FaStar className="text-amber-400" />
              <span className="text-amber-300 font-medium">
                {isArabic ? 'باقات حصرية' : 'Exclusive Packages'}
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">{isArabic ? 'باقاتنا ' : 'Our '}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
                {isArabic ? 'المميزة' : 'Packages'}
              </span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              {isArabic
                ? 'اختر الباقة المثالية لمشروعك من بين باقاتنا المتنوعة'
                : 'Choose the perfect package for your project from our diverse packages'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 pt-8">
            {packages.map((pkg, index) => {
              const isVIP = pkg.badge?.toLowerCase() === 'vip';
              return (
                <motion.div
                  key={pkg._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className={`relative group ${isVIP ? 'md:-mt-4 md:mb-4' : ''}`}
                >
                  {/* Card */}
                  <div className={`relative h-full rounded-3xl transition-all duration-500 group-hover:-translate-y-3 overflow-visible`}>
                    {/* Gradient Border for VIP */}
                    {isVIP && (
                      <div className="absolute -inset-[2px] bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-600 rounded-3xl opacity-100"></div>
                    )}

                    <div className={`relative h-full bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-3xl p-8 pt-10 border ${isVIP ? 'border-transparent' : 'border-gray-700/50 group-hover:border-amber-500/30'} transition-all duration-500 overflow-visible`}>
                      {/* Badge */}
                      {pkg.badge && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-30">
                          <span className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-black/30 ${
                            isVIP 
                              ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-gray-900' 
                              : 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                          }`}>
                            {isVIP && <FaCrown className="text-gray-900" />}
                            {pkg.badge.toUpperCase()}
                          </span>
                        </div>
                      )}

                      {/* Package Name */}
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 mt-4 group-hover:text-amber-400 transition-colors">
                        {isArabic ? pkg.name.ar : pkg.name.en}
                      </h3>

                      {/* Pricing */}
                      <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-gray-500 line-through text-lg">
                            {pkg.priceBefore.toLocaleString()} {isArabic ? 'جنيه' : 'EGP'}
                          </span>
                          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            {Math.round(((pkg.priceBefore - pkg.priceAfter) / pkg.priceBefore) * 100)}% OFF
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                            {pkg.priceAfter.toLocaleString()}
                          </span>
                          <span className="text-gray-400 text-lg">{isArabic ? 'جنيه' : 'EGP'}</span>
                          <span className="text-amber-400/80 text-sm font-medium">/ {isArabic ? 'للمتر' : 'per m²'}</span>
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="space-y-3 mb-8">
                        {pkg.features.slice(0, 5).map((feature, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-300">
                            <div className={`flex-shrink-0 w-5 h-5 rounded-full ${isVIP ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-green-500 to-emerald-400'} flex items-center justify-center mt-0.5`}>
                              <FaCheckCircle className="text-white text-xs" />
                            </div>
                            <span className="text-sm leading-relaxed">{isArabic ? feature.ar : feature.en}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <Link 
                        to="/packages" 
                        className={`block w-full text-center py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                          isVIP
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 hover:shadow-xl hover:shadow-amber-500/30'
                            : 'bg-gray-700/50 hover:bg-gradient-to-r hover:from-amber-500 hover:to-yellow-400 text-white hover:text-gray-900'
                        } transform hover:scale-[1.02]`}
                      >
                        {isArabic ? 'تفاصيل الباقة' : 'Package Details'}
                      </Link>
                    </div>
                  </div>

                  {/* Glow Effect */}
                  {isVIP && (
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500 to-yellow-400 opacity-20 blur-xl -z-10 group-hover:opacity-30 transition-opacity"></div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="text-center">
            <Link to="/packages" className="inline-flex items-center gap-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 hover:border-amber-500/50 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 group">
              <span>{t('common.viewAll')}</span>
              <FaArrowRight className={`${isArabic ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* FEATURED PROJECTS - PREMIUM DESIGN */}
      {/* ============================================= */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-6 py-2 mb-6"
            >
              <FaStar className="text-amber-400" />
              <span className="text-amber-300 font-medium">
                {isArabic ? 'أعمالنا المتميزة' : 'Our Portfolio'}
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">{isArabic ? 'مشاريعنا ' : 'Featured '}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
                {isArabic ? 'المميزة' : 'Projects'}
              </span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
              {isArabic
                ? 'استعرض نماذج من أعمالنا المتميزة والمشاريع التي حولنا فيها الأحلام إلى واقع'
                : 'Browse our distinguished work where we transformed dreams into reality'}
            </p>
          </motion.div>

          {/* Projects Grid - Premium Bento Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {projects.map((project, index) => {
              // Different card sizes for visual interest
              const isLarge = index === 0 || index === 3;
              
              return (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`group relative ${isLarge ? 'md:col-span-2 lg:col-span-1' : ''}`}
                >
                  <Link to={`/projects/${project._id}`} className="block">
                    <div className="relative h-80 md:h-96 rounded-3xl overflow-hidden">
                      {/* Image */}
                      <img
                        src={project.coverImage}
                        alt={isArabic ? project.title.ar : project.title.en}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>
                      
                      {/* Hover Reveal Border */}
                      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-amber-500/50 transition-all duration-500"></div>
                      
                      {/* Top Badge */}
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        {project.location && (
                          <span className="bg-gray-900/80 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                            <FaMapMarkerAlt className="text-amber-400" />
                            {isArabic ? project.location.ar : project.location.en}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="absolute inset-x-0 bottom-0 p-6">
                        {/* Category Tag */}
                        <span className="inline-block bg-gradient-to-r from-amber-500/90 to-yellow-500/90 text-gray-900 text-xs font-bold px-3 py-1 rounded-full mb-3">
                          {isArabic ? 'تشطيبات فاخرة' : 'Premium Finish'}
                        </span>
                        
                        {/* Title */}
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors duration-300">
                          {isArabic ? project.title.ar : project.title.en}
                        </h3>
                        
                        {/* Description - Shows on Hover */}
                        <p className="text-gray-300 text-sm line-clamp-2 mb-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                          {isArabic ? project.description?.ar : project.description?.en}
                        </p>
                        
                        {/* View Button */}
                        <div className="flex items-center gap-2 text-amber-400 font-semibold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                          <span>{isArabic ? 'عرض المشروع' : 'View Project'}</span>
                          <FaArrowRight className={`${isArabic ? 'rotate-180' : ''} group-hover:translate-x-2 transition-transform duration-300`} />
                        </div>
                      </div>

                      {/* Corner Expand Icon */}
                      <div className="absolute top-4 left-4 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                        <FaExpand className="text-white text-sm" />
                      </div>

                      {/* Shine Effect on Hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* View All Button */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link 
              to="/projects" 
              className="group inline-flex items-center gap-3 bg-gray-800/50 hover:bg-gradient-to-r hover:from-amber-500 hover:to-yellow-400 border border-gray-600/50 hover:border-transparent text-white hover:text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-500"
            >
              <span>{isArabic ? 'عرض جميع المشاريع' : 'View All Projects'}</span>
              <FaArrowRight className={`${isArabic ? 'rotate-180' : ''} group-hover:translate-x-2 transition-transform duration-300`} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-dark via-dark-light to-dark relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-0 left-1/4 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-0 right-1/4 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {isArabic ? 'جاهز لتحويل رؤيتك إلى واقع؟' : 'Ready to Transform Your Vision into Reality?'}
              </h2>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              {isArabic
                ? 'تواصل معنا اليوم للحصول على استشارة مجانية ودعنا نساعدك في تحقيق مشروع أحلامك'
                : 'Contact us today for a free consultation and let us help you achieve your dream project'}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link 
                to="/contact" 
                className="btn-primary text-lg px-12 py-4 inline-flex items-center gap-3 group shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50"
              >
                <span>{t('common.contactUs')}</span>
                <FaArrowRight className={`${isArabic ? 'rotate-180' : ''} group-hover:translate-x-1 transition-transform`} />
              </Link>
              
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 rounded-lg transition-all duration-300 inline-flex items-center gap-3 group shadow-xl"
              >
                <FaWhatsapp className="text-2xl" />
                <span className="text-lg font-semibold">{isArabic ? 'واتساب' : 'WhatsApp'}</span>
              </a>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="mt-16 pt-12 border-t border-gray-700"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { icon: FaAward, text: isArabic ? 'جودة مضمونة' : 'Guaranteed Quality' },
                  { icon: FaShieldAlt, text: isArabic ? 'ضمان شامل' : 'Full Warranty' },
                  { icon: FaClock, text: isArabic ? 'تسليم في الموعد' : 'On-Time Delivery' },
                  { icon: FaCheckCircle, text: isArabic ? 'رضا العملاء' : 'Customer Satisfaction' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                    <item.icon className="text-3xl text-primary" />
                    <span className="text-gray-400 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
