import React from 'react';
import { Calendar, Bell, BookOpen, FileText, TrendingUp, Users, Clock, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';
import AnimatedCounter from '../components/AnimatedCounter';
// import NotificationBanner from '../components/NotificationBanner';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { notifications } = useNotifications();
  const { isDark } = useTheme();

  const upcomingExams = [
    {
      name: 'UPSC Civil Services Prelims 2025',
      date: '2025-05-25',
      daysLeft: 95,
      applicants: '11,45,000',
      status: 'Registration Closed',
    },
    {
      name: 'UPSC CDS (I) 2025',
      date: '2025-04-14',
      daysLeft: 45,
      applicants: '3,21,000',
      status: 'Registration Closed',
    },
    {
      name: 'UPSC NDA (I) 2025',
      date: '2025-04-13',
      daysLeft: 44,
      applicants: '5,67,000',
      status: 'Registration Closed',
    },
    {
      name: 'Engineering Services 2025',
      date: '2025-06-08',
      daysLeft: 100,
      applicants: '2,85,000',
      status: 'Registration Closed',
    },
    {
      name: 'CAPF 2025',
      date: '2025-08-03',
      daysLeft: 155,
      applicants: '4,25,000',
      status: 'Registration Upcoming',
    },
  ];

  const quickLinks = [
    { name: 'Download Admit Card', icon: FileText, href: '/login', color: 'bg-blue-700 dark:bg-cyan-400' },
    { name: 'Previous Year Papers', icon: BookOpen, href: '/past-papers', color: 'bg-cyan-500 dark:bg-blue-700' },
    { name: 'Syllabus & Pattern', icon: Star, href: '/resources', color: 'bg-blue-700 dark:bg-cyan-400' },
    { name: 'Current Affairs', icon: TrendingUp, href: '/resources', color: 'bg-cyan-500 dark:bg-blue-700' },
  ];

  const stats = [
    { label: 'Total Applicants (2025)', value: '15.8L', icon: Users },
    { label: 'Success Rate', value: '0.18%', icon: TrendingUp },
    { label: 'Exam Centers', value: '2,800+', icon: FileText },
    { label: 'Services Available', value: '24', icon: Star },
  ];

  const ministries = [
    { name: 'Government of India',logoSrc: '/i0.png', alt: 'Government of India'},
    { name: 'Ministry of Education',logoSrc: '/i1.png', alt: 'Ministry of Education'},
    { name: 'Digital India', logoSrc: '/i2.png', alt: 'Digital India' },
    { name: 'Ministry of Defence',logoSrc: '/i3.png', alt: 'Ministry of Defence'},
    { name: 'Ministry of Home Affairs',logoSrc: '/i7.png', alt: 'Ministry of Home Affairs'},
    { name: 'Ministry of Culture',logoSrc: '/i6.png', alt: 'Ministry of Culture'},
    { name: 'Ministry of Railways',logoSrc: '/i5.png', alt: 'Ministry of Railways'},
    { name: 'Ministry of Finance',logoSrc: '/i4.png', alt: 'Ministry of Finance'},
    { name: 'NITI Aayog',logoSrc: '/i8.png', alt: 'NITI Aayog'},
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section - Full-bleed background */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-gradient-to-r from-teal-300 to-blue-400 dark:from-teal-800 dark:to-blue-900 text-black dark:text-white animate-fade-in-up hover-lift">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('home.welcome')}</h1>
          <p className="text-xl md:text-2xl opacity-90 mb-6">{t('home.subtitle')}</p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur rounded-lg p-4 min-w-[140px] glass-morphism hover-lift">
              <div className="flex items-center justify-center mb-2">
                <stat.icon size={24} />
              </div>
              <div className="text-2xl font-bold">
                {stat.label.includes('Applicants') ? (
                  <AnimatedCounter key={`applicants-${isDark}`} end={1220000} suffix="+" />
                ) : stat.label.includes('Centers') ? (
                  <AnimatedCounter key={`centers-${isDark}`} end={2500} suffix="+" />
                ) : stat.label.includes('Services') ? (
                  <AnimatedCounter key={`services-${isDark}`} end={24} />
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-sm opacity-80">{stat.label}</div>
            </div>
          ))}
          </div>
        </div>
      </div>

      {/* Scrolling Ministries Logos - Full-bleed strip (moved under hero) */}
      <div className="bg-transparent dark:bg-transparent py-7 relative left-1/2 right-1/2 -mx-[50vw] w-screen">
        <div className="container mx-auto px-1000 mb-10 text-center">
          <div className="inline-block">
            <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Proudly Supported By
            </span>
            <div className="h-0.5 w-full mt-1 bg-gradient-to-r from-teal-300 to-blue-400 dark:from-teal-800 dark:to-blue-900"></div>
          </div>
        </div>
        <div className="marquee-container h-28">
          <div className="marquee-track items-center gap-12 sm:gap-16 md:gap-20 h-full">
            {[...ministries, ...ministries].map((m, idx) => (
              <div
                key={`${m.name}-${idx}`}
                className="flex items-center mx-10 px-5 py-20 bg-transparent border-0 whitespace-nowrap shrink-0"
              >
                {m.logoSrc ? (
                  <img
                    src={m.logoSrc}
                    alt={m.alt || m.name}
                    className="h-16 w-auto object-contain"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-xl"></span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NotificationBanner removed per request */}

      {/* Dashboard Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Upcoming Exams */}
        <div className="xl:col-span-2">
          <div className="bg-slate-200/20 dark:bg-slate-800/30 rounded-xl shadow-lg p-6 hover-lift animate-slide-in-left">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <Calendar className="mr-3 text-blue-600" size={24} />
                {t('dashboard.upcomingExams')}
              </h2>
            </div>
            <div className="space-y-4">
              {upcomingExams.map((exam, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{exam.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      exam.status === 'Registration Open' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {exam.status}
                    </span> 
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {exam.date}
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {exam.daysLeft} days left
                    </div>
                    <div className="flex items-center">
                      <Users size={14} className="mr-1" />
                      {exam.applicants}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        <div>
          <div className="bg-slate-200/20 dark:bg-slate-800/30 rounded-xl shadow-lg p-6 hover-lift animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center mb-6">
              <Bell className="mr-3 text-blue-600" size={24} />
              {t('dashboard.recentNotifications')}
            </h2>
            <div className="space-y-3">
              {notifications.slice(0, 4).map((notification) => (
                <div key={notification.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">{notification.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">{notification.message}</p>
                  <span className="text-xs text-gray-500">{notification.date}</span>
                </div>
              ))}
            </div>
            <a href="/notifications" className="block mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
              View all notifications →
            </a>
          </div>
        </div>
      </div>

      
      {/* Quick Links */}
      <div className="bg-slate-200/20 dark:bg-slate-800/30 rounded-lg shadow-lg p-7 hover-lift">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {t('dashboard.quickLinks')}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="flex items-center p-5 bg-gray-300/20 dark:bg-gray-900 rounded-lg hover:shadow-md transition-all duration-200 hover:scale-105 hover-lift"
            >
              <div className={`${link.color} p-3 rounded-lg mr-4`}>
                <link.icon size={20} className="text-white" />
              </div>
              <span className="font-medium text-gray-900 dark:text-white">{link.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Coming Soon Features */}
      {/* <div className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-800 dark:to-pink-800 text-white rounded-2xl p-8 hover-lift">
        <h2 className="text-3xl font-bold mb-4">Coming Soon Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 glass-morphism hover-lift">
            <h3 className="font-semibold mb-2">🎮 Gamified Learning</h3>
            <p className="text-sm opacity-90">Earn points and badges while studying</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 glass-morphism hover-lift">
            <h3 className="font-semibold mb-2">📊 Performance Analytics</h3>
            <p className="text-sm opacity-90">Track your preparation progress</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 glass-morphism hover-lift">
            <h3 className="font-semibold mb-2">📱 Offline Mode</h3>
            <p className="text-sm opacity-90">Study without internet connection</p>
          </div>
        </div> */}
      {/* </div> */}
      

    </div>
  );
};

export default HomePage;
