import { useState } from 'react';
import { X } from 'lucide-react';
import './SupportBanner.css';

const STORAGE_KEY = 'wrg_hide_support_banner';

export function SupportBanner() {
  const [isVisible, setIsVisible] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== 'true';
    } catch {
      return true;
    }
  });

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // Ignore localStorage errors (e.g. private browsing)
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <aside className="support-banner" aria-label="Support announcement" data-testid="support-banner">
      <div className="support-banner-content">
        To help keep the site ad-free, consider supporting us by using code{' '}
        <a 
          href="https://wr.my.games/Adazahi" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="support-banner-code"
        >
          Adazahi
        </a>{' '}
        on your next webstore purchase!
      </div>
      <button 
        type="button" 
        className="support-banner-close" 
        onClick={handleDismiss} 
        aria-label="Dismiss banner"
        title="Dismiss"
      >
        <X size={16} />
      </button>
    </aside>
  );
}
