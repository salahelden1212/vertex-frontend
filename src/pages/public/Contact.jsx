import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaStar, FaPaperPlane, FaUser, FaCommentAlt, FaHeadset } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { contactAPI, settingsAPI } from '../../services/apiService';
import { getWhatsAppLink } from '../../utils/helpers';

const Contact = () => {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsAPI.get();
        setSettings(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactAPI.submit(formData);
      toast.success(isArabic ? 'تم إرسال رسالتك بنجاح' : 'Your message has been sent successfully');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast.error(isArabic ? 'حدث خطأ، حاول مرة أخرى' : 'An error occurred, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 right-1/3 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]"></div>
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
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-6 py-2 mb-6"
            >
              <FaHeadset className="text-amber-400" />
              <span className="text-amber-300 font-medium">
                {isArabic ? 'نحن هنا لمساعدتك' : "We're Here to Help"}
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-white">{isArabic ? 'تواصل ' : 'Contact '}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
                {isArabic ? 'معنا' : 'Us'}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {isArabic ? 'نحن هنا للإجابة على استفساراتك ومساعدتك في تحقيق حلمك' : "We're here to answer your questions and help you achieve your dream"}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="order-2 lg:order-1"
            >
              <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 hover:border-amber-500/30 transition-all duration-500">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 flex items-center justify-center">
                    <FaPaperPlane className="text-gray-900 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {isArabic ? 'أرسل رسالتك' : 'Send Message'}
                    </h2>
                    <p className="text-gray-400 text-sm">{isArabic ? 'سنرد عليك في أقرب وقت' : "We'll respond ASAP"}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-gray-300 mb-3 text-sm font-medium">
                      <FaUser className="text-amber-400" />
                      {isArabic ? 'الاسم الكامل' : 'Full Name'} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder={isArabic ? 'أدخل اسمك' : 'Enter your name'}
                      className="w-full px-5 py-4 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-gray-300 mb-3 text-sm font-medium">
                        <FaEnvelope className="text-amber-400" />
                        {isArabic ? 'البريد الإلكتروني' : 'Email'} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="example@email.com"
                        className="w-full px-5 py-4 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-gray-300 mb-3 text-sm font-medium">
                        <FaPhone className="text-amber-400" />
                        {isArabic ? 'رقم الهاتف' : 'Phone'} *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+20 100 000 0000"
                        className="w-full px-5 py-4 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-300 mb-3 text-sm font-medium">
                      <FaStar className="text-amber-400" />
                      {isArabic ? 'الموضوع' : 'Subject'}
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={isArabic ? 'اختر موضوع الرسالة' : 'Select message subject'}
                      className="w-full px-5 py-4 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-gray-300 mb-3 text-sm font-medium">
                      <FaCommentAlt className="text-amber-400" />
                      {isArabic ? 'الرسالة' : 'Message'} *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      placeholder={isArabic ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                      className="w-full px-5 py-4 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-300 resize-none"
                    ></textarea>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                        <span>{isArabic ? 'جاري الإرسال...' : 'Sending...'}</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        <span>{isArabic ? 'إرسال الرسالة' : 'Send Message'}</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6 order-1 lg:order-2"
            >
              {/* Quick Contact Cards */}
              {[
                { 
                  icon: FaPhone, 
                  title: isArabic ? 'الهاتف' : 'Phone', 
                  value: settings?.phone || '+20 100 000 0000',
                  gradient: 'from-blue-500 to-cyan-400',
                  hoverBorder: 'hover:border-blue-500/50'
                },
                { 
                  icon: FaEnvelope, 
                  title: isArabic ? 'البريد الإلكتروني' : 'Email', 
                  value: settings?.email || 'info@vertexfinish.com',
                  gradient: 'from-purple-500 to-pink-400',
                  hoverBorder: 'hover:border-purple-500/50'
                },
                { 
                  icon: FaMapMarkerAlt, 
                  title: isArabic ? 'العنوان' : 'Address', 
                  value: isArabic ? settings?.address?.ar || 'القاهرة، جمهورية مصر العربية' : settings?.address?.en || 'Cairo, Egypt',
                  gradient: 'from-green-500 to-emerald-400',
                  hoverBorder: 'hover:border-green-500/50'
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 ${item.hoverBorder} transition-all duration-300 hover:-translate-y-1 group`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${item.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                      <p className="text-gray-400">{item.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* WhatsApp Card */}
              {settings?.whatsapp && (
                <motion.a
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  href={getWhatsAppLink(
                    settings.whatsapp,
                    isArabic ? 'مرحباً، أريد الاستفسار' : 'Hello, I want to inquire'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-6 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FaWhatsapp className="text-white text-3xl" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{isArabic ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}</h3>
                      <p className="text-green-100">{isArabic ? 'رد سريع ومباشر' : 'Fast & Direct Response'}</p>
                    </div>
                  </div>
                </motion.a>
              )}

              {/* Social Media */}
              {settings?.socialMedia && Object.values(settings.socialMedia).some(link => link) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
                >
                  <h3 className="text-white font-bold text-lg text-center mb-6">
                    {isArabic ? 'تابعنا على منصات التواصل' : 'Follow Us on Social Media'}
                  </h3>
                  <div className="flex justify-center gap-4 flex-wrap">
                    {settings.socialMedia.facebook && (
                      <a
                        href={settings.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 bg-blue-600/10 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all duration-300 text-blue-400 hover:text-white hover:scale-110 hover:-translate-y-1"
                        title="Facebook"
                      >
                        <FaFacebook className="text-2xl" />
                      </a>
                    )}
                    {settings.socialMedia.instagram && (
                      <a
                        href={settings.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 bg-pink-600/10 rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-pink-400 hover:text-white hover:scale-110 hover:-translate-y-1"
                        title="Instagram"
                      >
                        <FaInstagram className="text-2xl" />
                      </a>
                    )}
                    {settings.socialMedia.twitter && (
                      <a
                        href={settings.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 bg-sky-600/10 rounded-xl flex items-center justify-center hover:bg-sky-600 transition-all duration-300 text-sky-400 hover:text-white hover:scale-110 hover:-translate-y-1"
                        title="Twitter / X"
                      >
                        <FaTwitter className="text-2xl" />
                      </a>
                    )}
                    {settings.socialMedia.linkedin && (
                      <a
                        href={settings.socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 bg-blue-700/10 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all duration-300 text-blue-300 hover:text-white hover:scale-110 hover:-translate-y-1"
                        title="LinkedIn"
                      >
                        <FaLinkedin className="text-2xl" />
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
