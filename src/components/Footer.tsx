import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Youtube, 
  Instagram,
  MapPin,
  Phone,
  Mail,
  Shield
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      name: 'Facebook', 
      url: 'https://www.facebook.com/upsc.gov.in', 
      icon: Facebook, 
      color: 'hover:text-blue-500' 
    },
    { 
      name: 'Twitter', 
      url: 'https://twitter.com/upsc_epfo', 
      icon: Twitter, 
      color: 'hover:text-sky-400' 
    },
    { 
      name: 'YouTube', 
      url: 'https://www.youtube.com/c/UPSC', 
      icon: Youtube, 
      color: 'hover:text-red-500' 
    },
    { 
      name: 'Instagram', 
      url: 'https://www.instagram.com/upsc_official', 
      icon: Instagram, 
      color: 'hover:text-pink-500' 
    },
  ];

  const quickLinks = [
    { name: 'About UPSC', url: 'https://www.upsc.gov.in/about-us' },
    { name: 'Examinations', url: 'https://www.upsc.gov.in/examinations' },
    { name: 'Recruitment', url: 'https://www.upsc.gov.in/recruitment' },
    { name: "What's New", url: 'https://www.upsc.gov.in/whats-new' },
    { name: 'Forms & Downloads', url: 'https://www.upsc.gov.in/forms-downloads' },
    { name: 'FAQs', url: 'https://www.upsc.gov.in/faqs' },
    { name: 'Contact Us', url: 'https://www.upsc.gov.in/contact-us' },
    { name: 'Site Map', url: 'https://www.upsc.gov.in/sitemap' },
  ];

  return (
    <footer className="bg-stone-800 dark:bg-slate-700 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-10 grid md:grid-cols-3 gap-10">
        
        {/* About UPSC */}
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Union Public Service Commission</h2>
          <p className="text-sm mb-4">
            The UPSC is India’s premier recruiting agency responsible for conducting
            examinations like Civil Services (IAS/IPS/IFS), NDA, CDS, CAPF and others 
            for recruitment to government services.
          </p>
          <div className="flex items-center mb-2 text-sm">
            <MapPin size={16} className="mr-2 text-cyan-400" />
            Dholpur House, Shahjahan Road, New Delhi - 110069
          </div>
          <div className="flex items-center mb-2 text-sm">
            <Phone size={16} className="mr-2 text-cyan-400" />
            +91-11-23098543
          </div>
          <div className="flex items-center text-sm">
            <Mail size={16} className="mr-2 text-cyan-400" />
            <a href="mailto:upsc-info@nic.in" className="hover:underline">upsc-info@nic.in</a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Quick Links</h2>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-cyan-400 transition-colors"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Connect With Us</h2>
          <div className="flex space-x-4">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-700 hover:scale-110 transition ${social.color}`}
                  aria-label={social.name}
                >
                  <Icon size={25} />
                </a>
              );
            })}
          </div>
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/logo.png" 
              alt="UPSC Logo" 
              className="h-[150px] w-auto"
            />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-800 py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          <div className="mb-2">
            © {currentYear} Union Public Service Commission, India. All rights reserved. | Developed by{' '}
            <span className="text-cyan-400 font-semibold">CodeXcel</span>
          </div>
          <div className="flex items-center justify-center space-x-4">
            <a href="https://upsc.gov.in/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="https://upsc.gov.in/terms-conditions" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <Link to="/admin" className="hover:text-cyan-400 transition-colors flex items-center">
              <Shield size={14} className="mr-1" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
