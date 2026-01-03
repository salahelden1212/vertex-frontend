import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaStar, FaEye, FaBullseye, FaHeart, FaCheck, FaUsers, FaProjectDiagram, FaAward, FaHandshake } from 'react-icons/fa';

// Logo paths
const logoDark = '/images/logo-dark.png';
const logoLight = '/images/logo-light.png';

const About = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const stats = [
    { icon: FaProjectDiagram, value: '500+', label: isArabic ? 'مشروع منجز' : 'Projects Completed' },
    { icon: FaUsers, value: '1000+', label: isArabic ? 'عميل سعيد' : 'Happy Clients' },
    { icon: FaAward, value: '15+', label: isArabic ? 'سنة خبرة' : 'Years Experience' },
    { icon: FaHandshake, value: '50+', label: isArabic ? 'شريك نجاح' : 'Partners' },
  ];

  const values = [
    {
      icon: FaAward,
      title: isArabic ? 'الجودة والتميز' : 'Quality & Excellence',
      desc: isArabic ? 'نلتزم بأعلى معايير الجودة في كل مشروع' : 'We commit to the highest quality standards in every project'
    },
    {
      icon: FaHandshake,
      title: isArabic ? 'الالتزام والشفافية' : 'Commitment & Transparency',
      desc: isArabic ? 'نحترم المواعيد ونتعامل بشفافية تامة' : 'We respect deadlines and operate with full transparency'
    },
    {
      icon: FaStar,
      title: isArabic ? 'الابتكار المستمر' : 'Continuous Innovation',
      desc: isArabic ? 'نواكب أحدث التقنيات والتصميمات' : 'We keep up with the latest technologies and designs'
    },
    {
      icon: FaHeart,
      title: isArabic ? 'رضا العميل أولاً' : 'Customer First',
      desc: isArabic ? 'رضاكم هو هدفنا الأول والأخير' : 'Your satisfaction is our ultimate goal'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>

      <div className="relative z-10 pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-6 py-2 mb-6"
            >
              <FaStar className="text-amber-400" />
              <span className="text-amber-300 font-medium">
                {isArabic ? 'تعرف علينا' : 'About Us'}
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-white">{isArabic ? 'من ' : 'Who '}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
                {isArabic ? 'نحن؟' : 'We Are'}
              </span>
            </h1>

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-8 flex flex-col items-center"
            >
              <img 
                src={logoDark} 
                alt="Vertex Finish" 
                className="h-32 md:h-40 w-auto object-contain mb-4"
              />
              <h2 className="text-3xl md:text-4xl font-black tracking-wider">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">VERTEX</span>
                <span className="text-white ml-2">FINISH</span>
              </h2>
              <p className="text-sm text-gray-400 tracking-[0.25em] uppercase mt-2">Finishing at the highest level</p>
            </motion.div>

            <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
              {isArabic
                ? 'فيرتكس فينش هي شركة رائدة في مجال التشطيبات الراقية، نقدم خدمات متكاملة للمشاريع السكنية والتجارية والإدارية بأعلى معايير الجودة والاحترافية.'
                : 'Vertex Finish is a leading company in premium finishing, offering integrated services for residential, commercial and administrative projects with the highest standards of quality and professionalism.'}
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 text-center border border-gray-700/50 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="text-2xl text-amber-400" />
                  </div>
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Vision & Mission */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
              <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 hover:border-amber-500/50 transition-all duration-300 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 flex items-center justify-center">
                    <FaEye className="text-2xl text-gray-900" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">
                    {isArabic ? 'رؤيتنا' : 'Our Vision'}
                  </h2>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed">
                  {isArabic
                    ? 'أن نكون الخيار الأول والأفضل في مجال التشطيبات الراقية في مصر والشرق الأوسط، من خلال تقديم أعمال تتميز بالجودة العالية والإبداع في التصميم.'
                    : 'To be the first and best choice in premium finishing in Egypt and the Middle East, by delivering work characterized by high quality and creative design.'}
                </p>
              </div>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
              <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-purple-500 to-blue-400 flex items-center justify-center">
                    <FaBullseye className="text-2xl text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">
                    {isArabic ? 'رسالتنا' : 'Our Mission'}
                  </h2>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed">
                  {isArabic
                    ? 'تقديم خدمات تشطيبات استثنائية تلبي تطلعات عملائنا وتتجاوز توقعاتهم من خلال الجودة والالتزام والابتكار، مع بناء علاقات طويلة الأمد قائمة على الثقة والاحترام المتبادل.'
                    : 'Providing exceptional finishing services that meet our clients\' aspirations and exceed their expectations through quality, commitment and innovation, while building long-term relationships based on trust and mutual respect.'}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-4xl font-bold text-center text-white mb-12">
              {isArabic ? 'قيمنا' : 'Our Values'}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-2 text-center h-full">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 mb-4 group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-yellow-400 transition-all duration-300">
                      <value.icon className="text-2xl text-amber-400 group-hover:text-gray-900 transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {value.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Why Choose Us */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-gray-600/30"
          >
            <h2 className="text-4xl font-bold text-center text-white mb-10">
              {isArabic ? 'لماذا نحن؟' : 'Why Choose Us?'}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                isArabic ? 'فريق متخصص من المهندسين والفنيين ذوي الخبرة العالية' : 'Specialized team of highly experienced engineers and technicians',
                isArabic ? 'استخدام أجود الخامات والمواد المعتمدة عالمياً' : 'Using the finest internationally certified materials',
                isArabic ? 'ضمان شامل على جميع أعمالنا لراحة بالك' : 'Comprehensive warranty on all our work for your peace of mind',
                isArabic ? 'أسعار تنافسية مع الحفاظ على أعلى مستوى جودة' : 'Competitive prices while maintaining the highest quality level',
                isArabic ? 'متابعة دورية ودعم فني مستمر بعد التسليم' : 'Regular follow-up and continuous technical support after delivery',
                isArabic ? 'التزام صارم بالمواعيد والجداول الزمنية المتفق عليها' : 'Strict commitment to agreed deadlines and schedules',
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 flex items-center justify-center">
                    <FaCheck className="text-gray-900 text-sm" />
                  </div>
                  <p className="text-gray-300 text-lg">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
