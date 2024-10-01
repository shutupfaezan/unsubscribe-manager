import React from 'react';

const UnsubscribeButton = ({ unsubscribeLink }) => {
  const handleUnsubscribe = () => {
    if (unsubscribeLink.startsWith('<mailto:')) {
      window.location.href = unsubscribeLink.replace(/[<>]/g, ''); // Handle mailto links
    } else if (unsubscribeLink.startsWith('<http')) {
      window.open(unsubscribeLink.replace(/[<>]/g, ''), '_blank'); // Handle URL links
    } else {
      alert('No valid unsubscribe link found.');
    }
  };

  return (
    <button onClick={handleUnsubscribe}>
      Unsubscribe
    </button>
  );
};

export default UnsubscribeButton;
