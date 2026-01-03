import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h1 className="text-9xl font-bold text-gradient mb-4">404</h1>
        <h2 className="text-3xl font-bold text-white mb-4">
          {isArabic ? 'الصفحة غير موجودة' : 'Page Not Found'}
        </h2>
        <p className="text-gray-400 mb-8">
          {isArabic
            ? 'عذراً، الصفحة التي تبحث عنها غير موجودة'
            : 'Sorry, the page you are looking for does not exist'}
        </p>
        <Link to="/" className="btn-primary">
          {isArabic ? 'العودة للرئيسية' : 'Back to Home'}
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
