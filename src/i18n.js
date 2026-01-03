import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        home: 'Home',
        packages: 'Packages',
        projects: 'Projects',
        about: 'About',
        contact: 'Contact',
      },
      // Hero
      hero: {
        title: 'VERTEX FINISH',
        slogan: 'Finishing at the Highest Level',
        cta: 'Request Consultation',
        whatsapp: 'Contact via WhatsApp',
      },
      // Common
      common: {
        learnMore: 'Learn More',
        viewAll: 'View All',
        readMore: 'Read More',
        getStarted: 'Get Started',
        contactUs: 'Contact Us',
        submit: 'Submit',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        loading: 'Loading...',
        search: 'Search',
      },
      // Footer
      footer: {
        rights: 'All Rights Reserved',
        company: 'Vertex Finish',
        quickLinks: 'Quick Links',
        contactInfo: 'Contact Info',
        followUs: 'Follow Us',
      },
    },
  },
  ar: {
    translation: {
      // Navigation
      nav: {
        home: 'الرئيسية',
        packages: 'الباقات',
        projects: 'المشاريع',
        about: 'من نحن',
        contact: 'تواصل معنا',
      },
      // Hero
      hero: {
        title: 'فيرتكس فينش',
        slogan: 'التشطيبات على أعلى مستوى',
        cta: 'اطلب استشارة',
        whatsapp: 'تواصل عبر واتساب',
      },
      // Common
      common: {
        learnMore: 'اعرف المزيد',
        viewAll: 'عرض الكل',
        readMore: 'قراءة المزيد',
        getStarted: 'ابدأ الآن',
        contactUs: 'تواصل معنا',
        submit: 'إرسال',
        cancel: 'إلغاء',
        save: 'حفظ',
        delete: 'حذف',
        edit: 'تعديل',
        loading: 'جاري التحميل...',
        search: 'بحث',
      },
      // Footer
      footer: {
        rights: 'جميع الحقوق محفوظة',
        company: 'فيرتكس فينش',
        quickLinks: 'روابط سريعة',
        contactInfo: 'معلومات التواصل',
        followUs: 'تابعنا',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
