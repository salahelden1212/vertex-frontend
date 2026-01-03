import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp, FaDownload, FaCheck, FaStar, FaCrown, FaGem, FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import { packagesAPI, settingsAPI } from '../../services/apiService';
import { calculateDiscount, getWhatsAppLink } from '../../utils/helpers';

const Packages = () => {
  const { t, i18n } = useTranslation();
  const [packages, setPackages] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packagesData, settingsData] = await Promise.all([
          packagesAPI.getAll({ isActive: true }),
          settingsAPI.get(),
        ]);
        setPackages(packagesData);
        setSettings(settingsData);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getBadgeConfig = (badge) => {
    const configs = {
      vip: { icon: FaCrown, gradient: 'from-amber-500 via-yellow-400 to-amber-600', text: 'VIP' },
      premium: { icon: FaGem, gradient: 'from-purple-500 via-violet-400 to-purple-600', text: 'PREMIUM' },
      popular: { icon: FaStar, gradient: 'from-blue-500 via-cyan-400 to-blue-600', text: 'POPULAR' },
      best: { icon: FaShieldAlt, gradient: 'from-green-500 via-emerald-400 to-green-600', text: 'BEST VALUE' },
    };
    return configs[badge?.toLowerCase()] || configs.popular;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-amber-200 rounded-full animate-spin border-t-amber-500 mx-auto"></div>
            <div className="w-14 h-14 border-4 border-gray-200 rounded-full animate-spin border-t-gray-500 mx-auto absolute top-3 left-1/2 -translate-x-1/2" style={{ animationDirection: 'reverse' }}></div>
          </div>
          <p className="mt-6 text-gray-400 text-lg">{isArabic ? 'جاري تحميل الباقات...' : 'Loading packages...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[150px]"></div>
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>

      <div className="relative z-10 pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Enhanced Header */}
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
                {isArabic ? 'باقات حصرية' : 'Exclusive Packages'}
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-white">{isArabic ? 'اختر ' : 'Choose '}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
                {isArabic ? 'باقتك' : 'Your Package'}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {isArabic
                ? 'نقدم لك مجموعة متنوعة من الباقات المصممة خصيصاً لتلبية احتياجاتك وميزانيتك'
                : 'We offer a variety of packages designed specifically to meet your needs and budget'}
            </p>
          </motion.div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 pt-8">
            {packages.map((pkg, index) => {
              const badgeConfig = getBadgeConfig(pkg.badge);
              const isHovered = hoveredIndex === index;
              const isVIP = pkg.badge?.toLowerCase() === 'vip';

              return (
                <motion.div
                  key={pkg._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  className={`relative group ${isVIP ? 'lg:scale-105 lg:-my-4' : ''}`}
                >
                  {/* Card Container */}
                  <div className={`relative h-full rounded-3xl transition-all duration-500 overflow-visible ${
                    isHovered ? 'transform -translate-y-3' : ''
                  }`}>
                    {/* Gradient Border */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${badgeConfig.gradient} opacity-${isVIP ? '100' : '0'} group-hover:opacity-100 transition-opacity duration-500 rounded-3xl p-[2px]`}>
                      <div className="absolute inset-[2px] bg-gray-900 rounded-3xl"></div>
                    </div>

                    {/* Card Content */}
                    <div className="relative h-full bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 pt-10 border border-gray-700/50 group-hover:border-transparent transition-all duration-500 overflow-visible">
                      {/* Badge */}
                      {pkg.badge && (
                        <motion.div
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className={`absolute -top-4 left-1/2 transform -translate-x-1/2 z-30 bg-gradient-to-r ${badgeConfig.gradient} px-6 py-2.5 rounded-full shadow-lg shadow-black/30`}
                        >
                          <div className="flex items-center gap-2">
                            <badgeConfig.icon className="text-white text-sm" />
                            <span className="text-white text-sm font-bold tracking-wider">{badgeConfig.text}</span>
                          </div>
                        </motion.div>
                      )}

                      {/* Package Image */}
                      {pkg.image && (
                        <div className="relative overflow-hidden rounded-2xl mb-6 group-hover:shadow-2xl transition-shadow duration-500">
                          <img
                            src={pkg.image}
                            alt={isArabic ? pkg.name.ar : pkg.name.en}
                            className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                        </div>
                      )}

                      {/* Package Name */}
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors duration-300">
                        {isArabic ? pkg.name.ar : pkg.name.en}
                      </h3>

                      {/* Description */}
                      {pkg.description && (
                        <p className="text-gray-400 mb-6 text-sm leading-relaxed line-clamp-2">
                          {isArabic ? pkg.description.ar : pkg.description.en}
                        </p>
                      )}

                      {/* Pricing */}
                      <div className="mb-8">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-gray-500 line-through text-lg">
                            {pkg.priceBefore.toLocaleString()} {isArabic ? 'جنيه' : 'EGP'}
                          </span>
                          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            {calculateDiscount(pkg.priceBefore, pkg.priceAfter)}% {isArabic ? 'خصم' : 'OFF'}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                            {pkg.priceAfter.toLocaleString()}
                          </span>
                          <span className="text-gray-400 text-lg">{isArabic ? 'جنيه' : 'EGP'}</span>
                          <span className="text-amber-400/80 text-sm font-medium">/ {isArabic ? 'للمتر' : 'per m²'}</span>
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="space-y-3 mb-8">
                        {pkg.features.slice(0, 6).map((feature, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + i * 0.05 }}
                            className="flex items-start gap-3 text-gray-300"
                          >
                            <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r ${badgeConfig.gradient} flex items-center justify-center mt-0.5`}>
                              <FaCheck className="text-white text-xs" />
                            </div>
                            <span className="text-sm leading-relaxed">{isArabic ? feature.ar : feature.en}</span>
                          </motion.li>
                        ))}
                        {pkg.features.length > 6 && (
                          <li className="text-amber-400 text-sm font-medium">
                            +{pkg.features.length - 6} {isArabic ? 'ميزة إضافية' : 'more features'}
                          </li>
                        )}
                      </ul>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <a
                          href={getWhatsAppLink(
                            settings?.whatsapp || '+201000000000',
                            `${isArabic ? 'مرحباً، أريد الاستفسار عن باقة' : 'Hello, I want to inquire about'} ${isArabic ? pkg.name.ar : pkg.name.en}`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                            isVIP
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 hover:shadow-xl hover:shadow-amber-500/30'
                              : 'bg-gradient-to-r from-green-500 to-emerald-400 text-white hover:shadow-xl hover:shadow-green-500/30'
                          } transform hover:scale-[1.02]`}
                        >
                          <FaWhatsapp className="text-2xl" />
                          <span>{isArabic ? 'استفسر الآن' : 'Inquire Now'}</span>
                          <FaArrowRight className={isArabic ? 'rotate-180' : ''} />
                        </a>

                        {pkg.pdfUrl && (
                          <a
                            href={pkg.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-600 text-gray-300 hover:border-amber-500 hover:text-amber-400 transition-all duration-300"
                          >
                            <FaDownload />
                            <span>{isArabic ? 'تحميل الملف التفصيلي' : 'Download Details PDF'}</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${badgeConfig.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10`}></div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 text-center"
          >
            <div className="inline-flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-600/30">
              <div className="text-center md:text-right">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {isArabic ? 'لم تجد الباقة المناسبة؟' : 'Can\'t find the right package?'}
                </h3>
                <p className="text-gray-400">
                  {isArabic ? 'تواصل معنا لتصميم باقة مخصصة لاحتياجاتك' : 'Contact us to design a custom package for your needs'}
                </p>
              </div>
              <a
                href={getWhatsAppLink(settings?.whatsapp || '+201000000000', isArabic ? 'مرحباً، أريد باقة مخصصة' : 'Hello, I want a custom package')}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 flex items-center gap-2"
              >
                <FaWhatsapp className="text-xl" />
                <span>{isArabic ? 'باقة مخصصة' : 'Custom Package'}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Packages;
