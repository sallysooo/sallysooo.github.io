import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import '../css/terminal-overlay.css';

function TerminalOverlay({ onClose }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    const handleMessage = (e) => {
      if (e.origin === window.location.origin && e.data?.type === 'webshell:exit') {
        onClose();
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('message', handleMessage);
    };
  }, [onClose]);

  return (
    <div className="terminal-overlay" role="dialog" aria-modal="true" aria-label="Terminal">
      <button
        type="button"
        className="terminal-overlay__close"
        onClick={onClose}
        aria-label="Close terminal"
      >
        ×
      </button>
      <iframe
        className="terminal-overlay__frame"
        src="/terminal/index.html"
        title="Terminal"
      />
    </div>
  );
}

TerminalOverlay.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default TerminalOverlay;
