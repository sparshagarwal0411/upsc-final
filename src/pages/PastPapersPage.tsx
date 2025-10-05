import React, { useState } from 'react';
import { FileText, Download, Search, Filter, Calendar } from 'lucide-react';
import PDFViewer from '../components/PDFViewer';

const PastPapersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState<{url: string, title: string} | null>(null);

  const papers = [
    {
      id: 1,
      exam: 'Civil Services',
      paper: 'General Studies Paper I',
      year: '2023',
      type: 'Prelims',
      language: 'English',
      pages: 20,
      downloadUrl: '/QP-CSM-23-GENERAL-STUDIES-PAPER-I-180923.pdf',
      previewUrl: '/QP-CSM-23-GENERAL-STUDIES-PAPER-I-180923.pdf',
    },
    {
      id: 2,
      exam: 'Civil Services',
      paper: 'General Studies Paper II (CSAT)',
      year: '2023',
      type: 'Prelims',
      language: 'English',
      pages: 18,
      downloadUrl: '/QP-CSM-23-GENERAL-STUDIES-PAPER-II-180923.pdf',
      previewUrl: '/QP-CSM-23-GENERAL-STUDIES-PAPER-II-180923.pdf',
    },
    {
      id: 3,
      exam: 'Civil Services',
      paper: 'Essay Paper',
      year: '2023',
      type: 'Mains',
      language: 'English',
      pages: 4,
      downloadUrl: '/essay paper.pdf',
      previewUrl: '/essay paper.pdf',
    },
    {
      id: 4,
      exam: 'Civil Services',
      paper: 'General Studies Paper I',
      year: '2022',
      type: 'Prelims',
      language: 'English',
      pages: 20,
      downloadUrl: '/gs 2022.pdf',
      previewUrl: '/gs 2022.pdf',
    },
    {
      id: 5,
      exam: 'NDA',
      paper: 'Mathematics',
      year: '2023',
      type: 'Written',
      language: 'English',
      pages: 16,
      downloadUrl: '/nda maths.pdf',
      previewUrl: '/nda maths.pdf',
    },
    {
      id: 6,
      exam: 'CDS',
      paper: 'Elementary Mathematics',
      year: '2023',
      type: 'Written',
      language: 'English',
      pages: 14,
      downloadUrl: '/cds maths.pdf',
      previewUrl: '/cds maths.pdf',
    },
    {
      id: 7,
      exam: 'Engineering Services',
      paper: 'General Studies & Engineering Aptitude',
      year: '2023',
      type: 'Preliminary',
      language: 'English',
      pages: 22,
      downloadUrl: '/enggineering apptitude.pdf',
      previewUrl: '/enggineering apptitude.pdf',
    },
    {
      id: 8,
      exam: 'CAPF',
      paper: 'General Ability & Intelligence',
      year: '2023',
      type: 'Written',
      language: 'English',
      pages: 18,
      downloadUrl: '/cisf.pdf',
      previewUrl: '/cisf.pdf',
    },
  ];

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = 
      paper.exam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.paper.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesExam = selectedExam === 'all' || paper.exam === selectedExam;
    const matchesYear = selectedYear === 'all' || paper.year === selectedYear;
    
    return matchesSearch && matchesExam && matchesYear;
  });

  const examTypes = [...new Set(papers.map(paper => paper.exam))];
  const years = [...new Set(papers.map(paper => paper.year))].sort((a, b) => b.localeCompare(a));

  const handleViewPDF = (paper: any) => {
    setSelectedPDF({
      url: paper.previewUrl,
      title: `${paper.paper} - ${paper.year}`
    });
    setShowPDFViewer(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="animate-slideInDown">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Previous Year Papers</h1>
        <p className="text-gray-600 dark:text-gray-300">Download and practice with authentic UPSC question papers</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-200 dark:bg-slate-800 rounded-xl shadow-lg p-6 animate-slideInUp">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search papers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400" size={20} />
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Exams</option>
              {examTypes.map(exam => (
                <option key={exam} value={exam}>{exam}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="text-gray-400" size={20} />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Papers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPapers.map((paper, index) => (
          <div 
            key={paper.id} 
            className="bg-slate-200/20 dark:bg-slate-800/30 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slideInUp"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="text-blue-600" size={20} />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{paper.exam}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{paper.paper}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{paper.type} • {paper.year}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex justify-between">
                <span>Language:</span>
                <span className="font-medium">{paper.language}</span>
              </div>
              <div className="flex justify-between">
                <span>Pages:</span>
                <span className="font-medium">{paper.pages}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleViewPDF(paper)}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-cyan-500 dark:bg-blue-800 text-white dark:text-black font-bold rounded-lg hover:bg-blue-400 dark:hover:bg-teal-400 transition-colors"
              >
                <FileText size={16} className="mr-2" />
                View PDF
              </button>
              <a 
                href={paper.downloadUrl}
                download={`${paper.paper.replace(/[^a-zA-Z0-9]/g, '_')}_${paper.year}.pdf`}
                className="px-4 py-3 bg-blue-800 dark:bg-cyan-300 text-white font-semibold dark:text-stone-800 font-bold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={16} />
              </a>
              <a 
                href={paper.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Preview
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredPapers.length === 0 && (
        <div className="text-center py-12">
          <FileText size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No papers found</h3>
          <p className="text-gray-600 dark:text-gray-300">Try adjusting your search or filter criteria</p>
        </div>
      )}

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

export default PastPapersPage;