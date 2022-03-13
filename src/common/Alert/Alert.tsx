import React from 'react';

interface AlertProps {
  children: string;
}

const Alert: React.FC<AlertProps> = ({ children }) => {
  return (
    <div className="bg-green-100 rounded-lg py-5 px-6 mb-4 text-base text-green-700 mb-3" role="alert">
      {children}
    </div>
  );
};

export default Alert;
