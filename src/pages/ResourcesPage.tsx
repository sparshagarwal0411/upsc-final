import React, { useState } from 'react';
import { BookOpen, FileText, Download, ExternalLink, Search, Filter } from 'lucide-react';
import PDFViewer from '../components/PDFViewer';

const ResourcesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState<{url: string, title: string} | null>(null);

  const resources = [
    {
      id: 1,
      title: 'Civil Services General Studies Paper I - 2023',
      category: 'Past Papers',
      type: 'PDF',
      description: 'Official UPSC Civil Services General Studies Paper I from 2023',
      icon: FileText,
      downloadUrl: '/QP-CSM-23-GENERAL-STUDIES-PAPER-I-180923.pdf',
      previewUrl: '/QP-CSM-23-GENERAL-STUDIES-PAPER-I-180923.pdf',
      size: '2.5 MB',
    },
    {
      id: 2,
      title: 'Civil Services General Studies Paper II - 2023',
      category: 'Past Papers',
      type: 'PDF',
      description: 'Official UPSC Civil Services General Studies Paper II (CSAT) from 2023',
      icon: FileText,
      downloadUrl: '/QP-CSM-23-GENERAL-STUDIES-PAPER-II-180923.pdf',
      previewUrl: '/QP-CSM-23-GENERAL-STUDIES-PAPER-II-180923.pdf',
      size: '2.1 MB',
    },
    {
      id: 3,
      title: 'Essay Paper - Civil Services Mains',
      category: 'Writing Skills',
      type: 'PDF',
      description: 'Official UPSC Essay Paper from Civil Services Mains examination',
      icon: BookOpen,
      downloadUrl: '/essay paper.pdf',
      previewUrl: '/essay paper.pdf',
      size: '1.8 MB',
    },
    {
      id: 4,
      title: 'General Studies Paper - 2022',
      category: 'Past Papers',
      type: 'PDF',
      description: 'UPSC General Studies Paper from 2022 examination',
      icon: BookOpen,
      downloadUrl: '/gs 2022.pdf',
      previewUrl: '/gs 2022.pdf',
      size: '2.3 MB',
    },
    {
      id: 5,
      title: 'NDA Mathematics Paper',
      category: 'Defence Exams',
      type: 'PDF',
      description: 'Mathematics paper from National Defence Academy examination',
      icon: FileText,
      downloadUrl: '/nda maths.pdf',
      previewUrl: '/nda maths.pdf',
      size: '1.6 MB',
    },
    {
      id: 6,
      title: 'CDS Mathematics Paper',
      category: 'Defence Exams',
      type: 'PDF',
      description: 'Elementary Mathematics paper from Combined Defence Services examination',
      icon: BookOpen,
      downloadUrl: '/cds maths.pdf',
      previewUrl: '/cds maths.pdf',
      size: '1.4 MB',
    },
    {
      id: 7,
      title: 'Engineering Services Aptitude Paper',
      category: 'Engineering Exams',
      type: 'PDF',
      description: 'General Studies & Engineering Aptitude paper from Engineering Services examination',
      icon: FileText,
      downloadUrl: '/enggineering apptitude.pdf',
      previewUrl: '/enggineering apptitude.pdf',
      size: '2.2 MB',
    },
    {
      id: 8,
      title: 'CAPF General Ability Paper',
      category: 'Defence Exams',
      type: 'PDF',
      description: 'General Ability & Intelligence paper from Central Armed Police Forces examination',
      icon: BookOpen,
      downloadUrl: '/cisf.pdf',
      previewUrl: '/cisf.pdf',
      size: '1.8 MB',
    },
  ];

  const faqs = [
    {
      question: 'What is the eligibility criteria for UPSC CSE?',
      answer: 'Candidates must be 21-32 years old (with age relaxation for reserved categories), hold a graduate degree from a recognized university, and meet the attempt limits (6 for General, 9 for OBC, unlimited for SC/ST).',
    },
    {
      question: 'How many attempts are allowed for UPSC CSE?',
      answer: 'General category candidates get 6 attempts, OBC candidates get 9 attempts, and SC/ST candidates have unlimited attempts until the upper age limit.',
    },
    {
      question: 'What is the exam pattern for UPSC CSE?',
      answer: 'The exam has three stages: Preliminary (2 objective papers), Mains (9 descriptive papers), and Personality Test (Interview). Only Mains and Interview marks count for final selection.',
    },
    {
      question: 'Which optional subject should I choose?',
      answer: 'Choose based on your interest, academic background, availability of study material, and scoring potential. Popular choices include Public Administration, Sociology, Geography, and Political Science.',
    },
    {
      question: 'How to prepare for current affairs?',
      answer: 'Read daily newspapers (The Hindu, Indian Express), monthly magazines (Yojana, Kurukshetra), follow government schemes, and maintain notes on important events.',
    },
    {
      question: 'Is coaching necessary for UPSC preparation?',
      answer: 'Coaching is not mandatory. Many candidates clear the exam through self-study. However, coaching can provide structure and guidance, especially for beginners.',
    },
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(resources.map(resource => resource.category))];

  const handleViewPDF = (resource: any) => {
    setSelectedPDF({
      url: resource.previewUrl,
      title: resource.title
    });
    setShowPDFViewer(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="animate-slideInDown">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Study Resources</h1>
        <p className="text-gray-600 dark:text-gray-300">Comprehensive study materials and resources for UPSC preparation</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-slate-200 dark:bg-slate-800 rounded-xl shadow-lg p-6 animate-slideInUp">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400" size={20} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <div 
              key={resource.id} 
              className="bg-slate-200/20 dark:bg-slate-800/30 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slideInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start space-x-3 mb-4">
                <div className="p-3 bg-blue-200 dark:bg-blue-900/30 rounded-lg">
                  <Icon className="text-blue-800 dark:text-blue-300" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{resource.title}</h3>
                  <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                    {resource.category}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{resource.description}</p>
              
              <div className="flex items-center justify-between mb-4 text-sm text-gray-500 dark:text-gray-400">
                <span>Type: {resource.type}</span>
                <span>Size: {resource.size}</span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewPDF(resource)}
                  className="flex-10 flex items-center justify-center px-4 py-2 bg-cyan-500 dark:bg-blue-800 text-white dark:text-black font-bold rounded-lg hover:bg-blue-400 dark:hover:bg-blue-400 transition-colors"
                >
                  <FileText size={16} className="mr-2" />
                  View PDF
                </button>
                <a 
                  href={resource.downloadUrl}
                  download={`${resource.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`}
                  className="px-4 py-3 bg-blue-800 dark:bg-cyan-300 text-white dark:text-black font-bold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
                >
                  <Download size={16} />
                </a>
                <a 
                  href={resource.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-500 dark:bg-cyan-500 rounded-xl p-6 text-white dark:text-black">
        <h2 className="text-2xl font-bold mb-4">Useful Links</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <a href="#" className="flex items-center space-x-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
            <ExternalLink size={20} />
            <span>Official UPSC Website</span>
          </a>
          <a href="#" className="flex items-center space-x-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
            <ExternalLink size={20} />
            <span>NCERT Books Online</span>
          </a>
          <a href="#" className="flex items-center space-x-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
            <ExternalLink size={20} />
            <span>PIB Press Releases</span>
          </a>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="group border border-gray-200 dark:border-gray-700 rounded-lg">
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white">{faq.question}</h3>
                <span className="ml-6 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="px-4 pb-4">
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      
      {/* PDF Viewer */}
      {showPDFViewer && selectedPDF && (
        <PDFViewer
          isOpen={showPDFViewer}
          onClose={() => setShowPDFViewer(false)}
          pdfUrl={selectedPDF.url}
          title={selectedPDF.title}
        />
      )}
    </div>
  );
};

export default ResourcesPage;