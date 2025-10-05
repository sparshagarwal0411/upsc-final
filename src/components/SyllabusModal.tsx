import React, { useState, useRef, useEffect } from 'react';
import { X, FileText, ExternalLink, Download } from 'lucide-react';
import PDFViewer from './PDFViewer';

interface SyllabusModalProps {
  isOpen: boolean;
  onClose: () => void;
  examName: string;
  examId: number;
}

interface SyllabusLink {
  id: string;
  name: string;
  url: string;
  description: string;
}

const SyllabusModal: React.FC<SyllabusModalProps> = ({ isOpen, onClose, examName, examId }) => {
  const [selectedSyllabus, setSelectedSyllabus] = useState<SyllabusLink | null>(null);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Syllabus links mapping based on exam IDs
  const syllabusLinks: { [key: number]: SyllabusLink[] } = {
    1: [ // Civil Services (Preliminary) Examination 2025
      {
        id: 'civil-service-prelims',
        name: 'Civil Service Prelims Syllabus',
        url: 'https://www.civilserviceindia.com/general-studies-syllabus-paper1.pdf',
        description: 'Complete syllabus for Civil Service Preliminary Examination including General Studies Paper I and II'
      }
    ],
    2: [ // Combined Defence Services Examination (I) 2025
      {
        id: 'cds-syllabus',
        name: 'CDS Syllabus',
        url: 'https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS_BLOGS/ae30e861-3a13-43f1-a9d5-6150e94cb0bc.pdf',
        description: 'Syllabus for Combined Defence Services Examination including English, General Knowledge, and Elementary Mathematics'
      }
    ],
    3: [ // National Defence Academy & Naval Academy Examination (I) 2025
      {
        id: 'nda-syllabus',
        name: 'NDA Syllabus',
        url: 'https://cdn.testbook.com/1715941350370-NDA%20Syll.pdf/1715941352.pdf',
        description: 'Complete syllabus for NDA & NA Examination including Mathematics and General Ability Test'
      }
    ],
    4: [ // Engineering Services Examination 2025
      {
        id: 'ese-syllabus',
        name: 'Engineering Services Syllabus',
        url: 'https://upsc.gov.in/sites/default/files/Notif-ESEP-25-Engl-18092024.pdf',
        description: 'Syllabus for Engineering Services Examination including various engineering disciplines'
      }
    ],
    5: [ // Central Armed Police Forces (ACs) Examination 2025
      {
        id: 'capf-syllabus',
        name: 'CAPF Syllabus',
        url: 'https://pwonlyias.com/wp-content/uploads/2025/01/CAFP-Syllabus-2025.pdf',
        description: 'Syllabus for Central Armed Police Forces Assistant Commandants Examination'
      }
    ],
    6: [ // NDA & NA Examination (II) 2025
      {
        id: 'nda-ii-syllabus',
        name: 'NDA (II) Syllabus',
        url: 'https://cdn.testbook.com/1715941350370-NDA%20Syll.pdf/1715941352.pdf',
        description: 'Syllabus for NDA & NA Examination (II) including Mathematics and General Ability Test'
      }
    ],
    7: [ // CDS Examination (II) 2025
      {
        id: 'cds-ii-syllabus',
        name: 'CDS (II) Syllabus',
        url: 'https://static.pw.live/5eb393ee95fab7468a79d189/GLOBAL_CMS_BLOGS/ae30e861-3a13-43f1-a9d5-6150e94cb0bc.pdf',
        description: 'Syllabus for Combined Defence Services Examination (II) including English, General Knowledge, and Elementary Mathematics'
      }
    ],
    8: [ // Indian Forest Service (Preliminary) Examination 2025
      {
        id: 'ifs-syllabus',
        name: 'Indian Forest Services Syllabus',
        url: 'https://upsc.gov.in/sites/default/files/Notif-IFSP-24-engl-140224.pdf',
        description: 'Syllabus for Indian Forest Service Preliminary Examination including General Studies and Forest Ecology'
      }
    ],
    9: [ // Combined Medical Services Examination 2025
      {
        id: 'cms-syllabus',
        name: 'Combined Medical Services Syllabus',
        url: 'https://cdn.testbook.com/1740036235788-UPSC%20CMS%20Syllabus.pdf/1740036240.pdf',
        description: 'Syllabus for Combined Medical Services Examination including various medical subjects'
      }
    ]
  };

  const currentSyllabus = syllabusLinks[examId] || [];

  const handleViewPDF = (syllabus: SyllabusLink) => {
    setSelectedSyllabus(syllabus);
    setShowPDFViewer(true);
  };

  const handleDownloadPDF = (syllabus: SyllabusLink) => {
    const link = document.createElement('a');
    link.href = syllabus.url;
    link.download = `${syllabus.name}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = (syllabus: SyllabusLink) => {
    window.open(syllabus.url, '_blank');
  };

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Syllabus for {examName}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Download or view the official syllabus documents
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>

            {currentSyllabus.length > 0 ? (
              <div className="space-y-4">
                {currentSyllabus.map((syllabus) => (
                  <div
                    key={syllabus.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <FileText className="text-blue-600" size={24} />
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {syllabus.name}
                          </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {syllabus.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleViewPDF(syllabus)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <FileText size={16} />
                        <span>View PDF</span>
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(syllabus)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <Download size={16} />
                        <span>Download</span>
                      </button>
                      <button
                        onClick={() => handleOpenInNewTab(syllabus)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                      >
                        <ExternalLink size={16} />
                        <span>Open in New Tab</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No syllabus available
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Syllabus documents are not yet available for this examination.
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      {showPDFViewer && selectedSyllabus && (
        <PDFViewer
          isOpen={showPDFViewer}
          onClose={() => setShowPDFViewer(false)}
          pdfUrl={selectedSyllabus.url}
          title={selectedSyllabus.name}
        />
      )}
    </>
  );
};

export default SyllabusModal;
