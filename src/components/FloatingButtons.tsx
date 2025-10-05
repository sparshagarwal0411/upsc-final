import React, { useState, useEffect } from 'react';
import { ArrowUp, Share2, Copy, Check } from 'lucide-react';

const FloatingButtons: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Share function
  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'UPSC Helper',
          text: 'Check out this UPSC preparation resource!',
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  // Copy to clipboard function
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.log('Failed to copy:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col space-y-3">
      {/* Share Button */}
      <button
        onClick={handleShare}
        className="group relative w-12 h-12 bg-blue-400 hover:bg-blue-500 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
        title="Share this page"
      >
        {isCopied ? (
          <Check size={20} className="text-green-200" />
        ) : (
          <Share2 size={20} />
        )}
        
        {/* Tooltip */}
        <div className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          {isCopied ? 'Copied!' : 'Share Page'}
        </div>
      </button>

      {/* Go to Top Button */}
      <button
        onClick={scrollToTop}
        className="group relative w-12 h-12 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
        title="Go to top"
      >
        <ArrowUp size={20} />
        
        {/* Tooltip */}
        <div className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Go to Top
        </div>
      </button>
    </div>
  );
};

export default FloatingButtons;
