import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaLinkedin, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaWhatsapp,
  FaYoutube,
  FaTiktok,
  FaArrowRight,
  FaHeart
} from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { settingsAPI } from '../../services/apiService';

// Logo paths from public folder
const logoIcon = '/images/logo-icon.png';
const logoDark = '/images/logo-dark.png';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsAPI.get();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const currentYear = new Date().getFullYear();
  const isArabic = i18n.language === 'ar';

  const quickLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/packages', label: t('nav.packages') },
    { path: '/projects', label: t('nav.projects') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const socialLinks = [
    { icon: FaFacebook, url: settings?.socialMedia?.facebook, label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: FaInstagram, url: settings?.socialMedia?.instagram, label: 'Instagram', color: 'hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500' },
    { icon: FaTwitter, url: settings?.socialMedia?.twitter, label: 'Twitter', color: 'hover:bg-sky-500' },
    { icon: FaLinkedin, url: settings?.socialMedia?.linkedin, label: 'LinkedIn', color: 'hover:bg-blue-700' },
    { icon: FaYoutube, url: settings?.socialMedia?.youtube, label: 'YouTube', color: 'hover:bg-red-600' },
    { icon: FaTiktok, url: settings?.socialMedia?.tiktok, label: 'TikTok', color: 'hover:bg-gray-900' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.5) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>

      {/* Top Border Gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>

      <div className="relative z-10 container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-4 mb-6 group">
              <img 
                src={logoDark} 
                alt="Vertex Finish" 
                className="h-20 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = logoIcon;
                }}
              />
              <div>
                <h2 className="text-2xl md:text-3xl font-black tracking-wide">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">VERTEX</span>
                  <span className="text-white ml-1">FINISH</span>
                </h2>
                <p className="text-xs text-gray-500 tracking-[0.15em] uppercase mt-1">Finishing at the highest level</p>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {isArabic 
                ? 'شركة تشطيبات راقية متخصصة في التشطيبات السكنية والتجارية والإدارية بأعلى معايير الجودة'
                : 'Premium finishing company specialized in residential, commercial and administrative projects with the highest quality standards'}
            </p>
            
            {/* Social Links */}
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social, index) => (
                social.url && (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-xl bg-gray-800/50 border border-gray-700/50 flex items-center justify-center text-gray-400 hover:text-white ${social.color} hover:border-transparent transition-all duration-300 hover:scale-110`}
                    title={social.label}
                  >
                    <social.icon className="text-lg" />
                  </a>
                )
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-gradient-to-b from-amber-500 to-yellow-400 rounded-full"></span>
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors duration-300"
                  >
                    <FaArrowRight className={`text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 ${isArabic ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-gradient-to-b from-amber-500 to-yellow-400 rounded-full"></span>
              {t('footer.contactInfo')}
            </h4>
            <ul className="space-y-4">
              <li>
                <a href={`tel:${settings?.phone}`} className="flex items-center gap-3 text-gray-400 hover:text-amber-400 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <FaPhone className="text-blue-400" />
                  </div>
                  <span>{settings?.phone || '+20 100 000 0000'}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${settings?.email}`} className="flex items-center gap-3 text-gray-400 hover:text-amber-400 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                    <FaEnvelope className="text-purple-400" />
                  </div>
                  <span>{settings?.email || 'info@vertexfinish.com'}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-green-400" />
                </div>
                <span className="mt-2">
                  {isArabic 
                    ? settings?.address?.ar || 'القاهرة، جمهورية مصر العربية'
                    : settings?.address?.en || 'Cairo, Egypt'}
                </span>
              </li>
            </ul>
          </div>

          {/* WhatsApp CTA */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-gradient-to-b from-amber-500 to-yellow-400 rounded-full"></span>
              {isArabic ? 'تواصل سريع' : 'Quick Contact'}
            </h4>
            <p className="text-gray-400 mb-6">
              {isArabic 
                ? 'تواصل معنا عبر واتساب للرد السريع على استفساراتك'
                : 'Contact us via WhatsApp for quick response to your inquiries'}
            </p>
            {settings?.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:scale-105"
              >
                <FaWhatsapp className="text-2xl" />
                <span>{isArabic ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}</span>
              </a>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-right flex items-center gap-2">
              {isArabic 
                ? `© ${currentYear} فيرتكس فينش. جميع الحقوق محفوظة`
                : `© ${currentYear} Vertex Finish. All Rights Reserved`}
              <FaHeart className="text-red-500 text-xs animate-pulse" />
            </p>
            
            <div className="flex items-center gap-4 text-gray-500 text-sm">
              <span>{isArabic ? 'صنع بحب في مصر' : 'Made with love in Egypt'}</span>
              <span>🇪🇬</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
