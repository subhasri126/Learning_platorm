import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const MascotGuide = ({
  message,
  emoji = '✨',
  onClose,
  position = 'bottom-right',
  inline = false
}) => {
  const positions = {
    'bottom-right': 'bottom-24 right-8',
    'bottom-left': 'bottom-24 left-8',
    'top-right': 'top-24 right-8'
  };

  const wrapperClass = inline
    ? 'relative'
    : `fixed ${positions[position]} z-50`;

  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.98, opacity: 0 }}
      transition={{ type: 'spring', duration: 0.4 }}
      className={wrapperClass}
    >
      <div className={`relative ${inline ? '' : 'max-w-xs'}`}>
        <motion.div
          animate={inline ? {} : { y: [0, -6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className={`bg-dark-800/90 border border-dark-700 rounded-2xl p-4 shadow-glow ${inline ? '' : 'backdrop-blur-lg'}`}
        >
          {onClose && !inline && (
            <button
              onClick={onClose}
              className="absolute -top-2 -right-2 w-6 h-6 bg-dark-800 rounded-full flex items-center justify-center hover:bg-dark-700 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-purple/30 to-accent-pink/30 flex items-center justify-center text-xl">
              {emoji}
            </div>
            <p className="text-gray-100 text-sm leading-relaxed">{message}</p>
          </div>

          {!inline && (
            <div className="absolute -bottom-2 right-8 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-dark-800/90"></div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MascotGuide;
