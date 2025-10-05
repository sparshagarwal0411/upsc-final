import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Bot, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ContactPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      info: 'Dholpur House, Shahjahan Road, New Delhi - 110069',
    },
    {
      icon: Phone,
      title: 'Phone',
      info: '+91-11-23098543',
    },
    {
      icon: Mail,
      title: 'Email',
      info: 'upsc-info@nic.in',
    },
    {
      icon: Clock,
      title: 'Office Hours',
      info: 'Monday to Friday: 9:00 AM - 5:30 PM',
    },
  ];

  const departments = [
    {
      name: 'Examination Department',
      email: 'exam@upsc.gov.in',
      phone: '+91-11-23098543',
      description: 'For queries related to examinations, admit cards, and results',
    },
    {
      name: 'Recruitment Department',
      email: 'recruit@upsc.gov.in',
      phone: '+91-11-23098544',
      description: 'For recruitment-related inquiries and application status',
    },
    {
      name: 'Technical Support',
      email: 'tech@upsc.gov.in',
      phone: '+91-11-23098545',
      description: 'For website and online application technical issues',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Contact Us</h1>
        <p className="text-gray-600 dark:text-gray-300">Get in touch with us for any queries or assistance</p>
      </div>

      {/* AI Study Assistance Section - Only for logged-in users */}
      {/* {isAuthenticated && (
        <div className="bg-blue-800/90 dark:bg-cyan-500/40 rounded-xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Bot size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">AI Study Assistant</h2>
                <p className="text-blue-100">Get personalized help with your UPSC preparation. Ask questions, get study tips, and receive guidance from our AI assistant.</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/ai-study-assistance')}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-purple-50 transition-colors font-semibold flex items-center space-x-2"
            >
              <BookOpen size={20} />
              <span>Start Learning</span>
            </button>
          </div>
        </div>
      )} */}

      {/* Contact Info Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contactInfo.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="bg-slate-200/20 dark:bg-slate-800/30 rounded-xl shadow-lg p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-200 dark:bg-blue-900/30 rounded-lg mb-4">
                <Icon className="text-blue-800 dark:text-blue-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{item.info}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 flex flex-col text-center align-middle">
        {/* Contact Form */}
        <div className="bg-slate-200/20 dark:bg-slate-800/30 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject *
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select a subject</option>
                <option value="exam">Examination Related</option>
                <option value="application">Application Status</option>
                <option value="technical">Technical Support</option>
                <option value="recruitment">Recruitment Inquiry</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                placeholder="Please provide detailed information about your query..."
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send size={20} className="mr-2" />
              Send Message
            </button>
          </form>
        </div>

        {/* Department Contacts */}
        <div className="space-y-6">
          <div className="bg-slate-200/20 dark:bg-slate-800/30 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Department Contacts</h2>
            
            <div className="space-y-4">
              {departments.map((dept, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{dept.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{dept.description}</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Mail size={14} className="mr-2" />
                      {dept.email}
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Phone size={14} className="mr-2" />
                      {dept.phone}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Quick Links */}
          {/* <div className="bg-blue-800 dark:bg-cyan-600 rounded-xl p-6 text-white">
            <h3 className="text-xl font-bold mb-4">Quick Help</h3>
            <div className="space-y-3">
              <a href="/resources" className="flex items-center space-x-2 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <MessageSquare size={18} />
                <span>Check FAQ Section</span>
              </a>
              <a href="/application-status" className="flex items-center space-x-2 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <MessageSquare size={18} />
                <span>Track Application Status</span>
              </a>
              <a href="/notifications" className="flex items-center space-x-2 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <MessageSquare size={18} />
                <span>View Latest Notifications</span>
              </a>
              {isAuthenticated && (
                <button 
                  onClick={() => navigate('/ai-study-assistance')}
                  className="w-full flex items-center space-x-2 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200 transform hover:scale-105"
                >
                  <Bot size={18} />
                  <span>AI Study Assistant</span>
                </button>
              )}
            </div>
          </div> */}
        </div>
      </div>

      {/* Office Hours & Important Notes */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">Important Information</h3>
        <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
          <li>• Response time for email queries: 3-5 working days</li>
          <li>• For urgent matters, please call during office hours</li>
          <li>• Include your registration ID for application-related queries</li>
          <li>• Technical support is available Monday to Friday, 10 AM - 4 PM</li>
          <li>• For examination day issues, contact the examination center directly</li>
        </ul>
      </div>
    </div>
  );
};

export default ContactPage;