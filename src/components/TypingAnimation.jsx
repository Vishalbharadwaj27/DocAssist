import React from 'react';

/**
 * Typing Animation Component
 * Displays animated dots to indicate that someone is typing
 * @returns {JSX.Element} Animated typing indicator
 */
export const TypingAnimation = () => {
  return (
    <div className="typing-dot-animation">
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </div>
  );
};

export default TypingAnimation; 