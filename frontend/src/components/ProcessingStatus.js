import React from 'react';
import './ProcessingStatus.css';

function ProcessingStatus({ status, progress }) {
  if (!status || status === 'idle') {
    return null;
  }

  const getStatusIcon = () => {
    switch(status) {
      case 'processing':
        return '⏳';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '📊';
    }
  };

  const getStatusText = () => {
    switch(status) {
      case 'processing':
        return `Processing companies... ${progress || ''}`;
      case 'success':
        return 'Processing complete!';
      case 'error':
        return 'Error occurred during processing';
      default:
        return '';
    }
  };

  return (
    <div className={`processing-status status-${status}`}>
      <span className="status-icon">{getStatusIcon()}</span>
      <span className="status-text">{getStatusText()}</span>
    </div>
  );
}

export default ProcessingStatus;
