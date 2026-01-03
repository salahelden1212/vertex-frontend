import { Outlet } from 'react-router-dom';
import { FloatingWhatsApp } from 'react-floating-whatsapp';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      
      {/* WhatsApp Floating Widget */}
      <FloatingWhatsApp
        phoneNumber="+201120068410"
        accountName="Vertex Finish"
        statusMessage="متصل الآن"
        chatMessage="مرحباً! 👋 كيف يمكننا مساعدتك اليوم؟"
        placeholder="اكتب رسالتك..."
        avatar="/images/logo-dark.png"
        allowClickAway
        notification
        notificationDelay={30}
        notificationSound
        darkMode={false}
        style={{
          color:"black",
          left: '20px',
          right: 'unset',
        }}
        buttonStyle={{
          left: '20px',
          right: 'unset',
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)',
        }}
        chatboxStyle={{
          left: '20px',
          right: 'unset',
        }}
      />
    </div>
  );
};

export default PublicLayout;
