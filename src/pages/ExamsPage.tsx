import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Users, FileText, Filter, Search, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';
import PaymentModal from '../components/PaymentModal';
import SuccessToast from '../components/SuccessToast';
import SyllabusModal from '../components/SyllabusModal';
import Swal from 'sweetalert2';

const ExamsPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedExamDetails, setSelectedExamDetails] = useState<any>(null);
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);
  const [selectedExamForSyllabus, setSelectedExamForSyllabus] = useState<any>(null);
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState<{ [examId: number]: boolean }>({});
  const detailsModalRef = useRef<HTMLDivElement>(null);

  // API endpoints
  const API_BASE_URL = 'https://igdt.adityaexp.dev';
  const GET_EXAMS_ENDPOINT = `${API_BASE_URL}/getExam`;
  const SUBMIT_APPLICATION_ENDPOINT = `${API_BASE_URL}/api/submitApplication`;

  // Fetch exams from API
  const fetchExams = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(GET_EXAMS_ENDPOINT, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle different response formats
      if (Array.isArray(data)) {
        setExams(data);
      } else if (data.exams && Array.isArray(data.exams)) {
        setExams(data.exams);
      } else if (data.data && Array.isArray(data.data)) {
        setExams(data.data);
      } else {
        console.warn('Unexpected API response format:', data);
        setExams([]);
      }
    } catch (err) {
      console.error('Error fetching exams:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch exams');
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch exams on component mount
  useEffect(() => {
    fetchExams();
  }, []);

  // Handle click outside to close details modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (detailsModalRef.current && !detailsModalRef.current.contains(event.target as Node)) {
        setShowDetailsModal(false);
      }
    };

    if (showDetailsModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDetailsModal]);

  // Handle escape key to close details modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowDetailsModal(false);
      }
    };

    if (showDetailsModal) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showDetailsModal]);

  // Submit application function
  const submitApplication = async (exam: any) => {
    if (!isAuthenticated || !user?.email) {
      setShowAuthModal(true);
      return;
    }

    try {
      setApplying(prev => ({ ...prev, [exam.id]: true }));

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(SUBMIT_APPLICATION_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          exam_id: exam.id,
          exam_name: exam.name
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Application Submitted!',
          text: `You have successfully applied for ${exam.shortName}. Your remaining credit is ₹${data.remaining_credit?.toLocaleString('en-IN') || 'N/A'}`,
          confirmButtonText: 'OK'
        });
        
        // Refresh user credit in navbar by triggering a context update
        // This will be handled by the AuthContext refresh
        window.dispatchEvent(new Event('creditUpdated'));
      } else {
        if (response.status === 409) {
          // Already applied
          await Swal.fire({
            icon: 'info',
            title: 'Already Applied',
            text: data.error || 'You have already applied for this exam.',
            confirmButtonText: 'OK'
          });
        } else if (response.status === 402) {
          // Insufficient credits
          await Swal.fire({
            icon: 'warning',
            title: 'Insufficient Credits',
            text: data.error || 'You do not have enough credits to apply for this exam.',
            confirmButtonText: 'OK'
          });
        } else {
          // Other errors
          await Swal.fire({
            icon: 'error',
            title: 'Application Failed',
            text: data.error || 'Failed to submit application. Please try again.',
            confirmButtonText: 'OK'
          });
        }
      }
    } catch (error) {
      console.error('Application submission failed:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Connection Error',
        text: 'Please check your internet connection and try again.',
        confirmButtonText: 'OK'
      });
    } finally {
      setApplying(prev => ({ ...prev, [exam.id]: false }));
    }
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || exam.status.toLowerCase().includes(filterStatus.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'registration open':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'registration closed':   
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'registration upcoming':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const handleApplyClick = (exam: any) => {
    submitApplication(exam);
  };

  const handlePaymentSuccess = () => {
    setSuccessMessage(`${user?.name}, you have successfully applied for ${selectedExam?.shortName}!`);
    setShowSuccessToast(true);
    setSelectedExam(null);
  };

  const handleViewDetails = (exam: any) => {
    setSelectedExamDetails(exam);
    setShowDetailsModal(true);
  };

  const handleViewSyllabus = (exam: any) => {
    setSelectedExamForSyllabus(exam);
    setShowSyllabusModal(true);
  };

  const handleDownloadNotification = (exam: any) => {
    // Create a comprehensive notification document content
    const notificationContent = `
UPSC EXAMINATION NOTIFICATION
${exam.name}

EXAMINATION DETAILS:
• Application Period: ${exam.applicationStart} to ${exam.applicationEnd}
• Examination Date: ${exam.date}
• Result Date: ${exam.resultDate}
• Status: ${exam.status}
• Total Applicants: ${exam.applicants}

ELIGIBILITY CRITERIA:
• Educational Qualification: ${exam.eligibility}
• Age Limit: ${exam.ageLimit}
• Maximum Attempts: ${exam.attempts}
• Application Fee: ${exam.fee}

EXAMINATION CATEGORY: ${exam.category}

IMPORTANT INSTRUCTIONS:
1. Read the official notification carefully before applying
2. Ensure you meet all eligibility criteria
3. Keep all required documents ready
4. Apply well before the deadline
5. Check the official UPSC website for updates

For more details, visit: https://upsc.gov.in
Downloaded on: ${new Date().toLocaleDateString()}
    `;

    // Create and download the file
    const blob = new Blob([notificationContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${exam.shortName}_Notification_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="animate-slideInDown">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">UPSC Examinations</h1>
        <p className="text-gray-600 dark:text-gray-300">Complete information about all UPSC examinations</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading examinations...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <FileText size={16} className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-800 dark:text-red-300">Failed to load examinations</h3>
              <p className="text-red-600 dark:text-red-400 mt-1">{error}</p>
              <button
                onClick={fetchExams}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content - only show when not loading and no error */}
      {!loading && !error && (
        <>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-slideInUp">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search examinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400" size={20} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="registration open">Registration Open</option>
              <option value="registration closed">Registration Closed</option>
              <option value="registration upcoming">Registration Upcoming</option>
            </select>
            <button
              onClick={fetchExams}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Exam Cards */}
      <div className="space-y-6">
        {filteredExams.map((exam, index) => (
          <div 
            key={exam.id} 
            className="bg-slate-200/20 dark:bg-slate-800/20 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:bg-slate-400/20 animate-slideInUp"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{exam.name}</h2>
                <p className="text-gray-600 dark:text-gray-300">({exam.shortName}) - {exam.category}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium mt-2 lg:mt-0 w-fit ${getStatusColor(exam.status)}`}>
                {exam.status}
              </span>
            </div>

            {/* Exam Details Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Exam Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Calendar size={16} className="mr-2 text-blue-600" />
                    <span>Exam Date: {exam.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Users size={16} className="mr-2 text-blue-600" />
                    <span>Applicants: {exam.applicants}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <FileText size={16} className="mr-2 text-blue-600" />
                    <span>Fee: {exam.fee}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Eligibility</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p><strong>Education:</strong> {exam.eligibility}</p>
                  <p><strong>Age Limit:</strong> {exam.ageLimit}</p>
                  <p><strong>Attempts:</strong> {exam.attempts}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Application Period</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2 text-green-600" />
                    <span>Start: {exam.applicationStart}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2 text-red-600" />
                    <span>End: {exam.applicationEnd}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => handleViewDetails(exam)}
                className="px-4 py-2 bg-cyan-400 dark:bg-blue-600 text-white dark:text-black font-semibold rounded-lg hover:bg-teal-400 dark:hover:bg-teal-400 transition-colors"
              >
                View Details
              </button>
              <button 
                onClick={() => handleApplyClick(exam)}
                disabled={applying[exam.id]}
                className="px-4 py-2 bg-blue-800 dark:bg-cyan-400 text-white dark:text-black font-semibold rounded-lg hover:bg-teal-400 dark:hover:bg-teal-400 transition-colors"
              >
                {applying[exam.id] ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Applying...</span>
                  </>
                ) : (
                  <span>{isAuthenticated ? 'Apply Now' : 'Login to Apply'}</span>
                )}
              </button>
              <button 
                onClick={() => handleDownloadNotification(exam)}
                className="px-4 py-2 bg-cyan-400 dark:bg-blue-600 text-white dark:text-black font-semibold rounded-lg hover:bg-teal-400 dark:hover:bg-teal-400 transition-colors"
              >
                Download Notification
              </button>
              <button 
                onClick={() => handleViewSyllabus(exam)}
                className="px-4 py-2 bg-blue-800 dark:bg-cyan-400 text-white dark:text-black font-semibold rounded-lg hover:bg-teal-400 dark:hover:bg-teal-400 transition-colors"
              >
                Syllabus
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredExams.length === 0 && (
        <div className="text-center py-12">
          <FileText size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No examinations found</h3>
          <p className="text-gray-600 dark:text-gray-300">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        message="You need to register and login to apply for UPSC examinations. Please create an account or sign in to continue with your application."
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        examName={selectedExam?.name || ''}
        fee={selectedExam?.fee || ''}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Success Toast */}
      <SuccessToast
        isVisible={showSuccessToast}
        message={successMessage}
        onClose={() => setShowSuccessToast(false)}
      />

      {/* Syllabus Modal */}
      <SyllabusModal
        isOpen={showSyllabusModal}
        onClose={() => setShowSyllabusModal(false)}
        examName={selectedExamForSyllabus?.name || ''}
        examId={selectedExamForSyllabus?.id || 0}
      />

      {/* Exam Details Modal */}
      {showDetailsModal && selectedExamDetails && (
        <div className="fixed inset-10 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div ref={detailsModalRef} className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-max max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedExamDetails.name}
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>

              {selectedExamDetails.details && (
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedExamDetails.details.description}</p>
                  </div>

                  {/* Examination Stages */}
                  {selectedExamDetails.details.stages && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Examination Stages</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        {selectedExamDetails.details.stages.map((stage: string, index: number) => (
                          <li key={index}>{stage}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Papers */}
                  {(selectedExamDetails.details.papers || selectedExamDetails.details.prelimsPapers) && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Examination Papers</h3>
                      <div className="grid gap-3">
                        {(selectedExamDetails.details.papers || selectedExamDetails.details.prelimsPapers).map((paper: any, index: number) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <div className="font-medium text-gray-900 dark:text-white">{paper.name}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Duration: {paper.duration} | Marks: {paper.marks}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Syllabus */}
                  {selectedExamDetails.details.syllabus && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Syllabus</h3>
                      <p className="text-gray-700 dark:text-gray-300">{selectedExamDetails.details.syllabus}</p>
                    </div>
                  )}

                  {/* Services/Academies */}
                  {(selectedExamDetails.details.services || selectedExamDetails.details.academies) && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {selectedExamDetails.details.services ? 'Services' : 'Academies'}
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        {(selectedExamDetails.details.services || selectedExamDetails.details.academies).map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Age Relaxation */}
                  {selectedExamDetails.details.ageRelaxation && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Age Relaxation</h3>
                      <p className="text-gray-700 dark:text-gray-300">{selectedExamDetails.details.ageRelaxation}</p>
                    </div>
                  )}

                  {/* Exam Centers */}
                  {selectedExamDetails.details.examCenters && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Exam Centers</h3>
                      <p className="text-gray-700 dark:text-gray-300">{selectedExamDetails.details.examCenters}</p>
                    </div>
                  )}

                  {/* Language */}
                  {selectedExamDetails.details.language && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Language</h3>
                      <p className="text-gray-700 dark:text-gray-300">{selectedExamDetails.details.language}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Basic Information */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Application Period:</span>
                    <span className="ml-2 text-gray-700 dark:text-gray-300">
                      {selectedExamDetails.applicationStart} to {selectedExamDetails.applicationEnd}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Examination Date:</span>
                    <span className="ml-2 text-gray-700 dark:text-gray-300">{selectedExamDetails.date}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Result Date:</span>
                    <span className="ml-2 text-gray-700 dark:text-gray-300">{selectedExamDetails.resultDate}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Status:</span>
                    <span className="ml-2 text-gray-700 dark:text-gray-300">{selectedExamDetails.status}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Eligibility:</span>
                    <span className="ml-2 text-gray-700 dark:text-gray-300">{selectedExamDetails.eligibility}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Age Limit:</span>
                    <span className="ml-2 text-gray-700 dark:text-gray-300">{selectedExamDetails.ageLimit}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Application Fee:</span>
                    <span className="ml-2 text-gray-700 dark:text-gray-300">{selectedExamDetails.fee}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Total Applicants:</span>
                    <span className="ml-2 text-gray-700 dark:text-gray-300">{selectedExamDetails.applicants}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default ExamsPage;