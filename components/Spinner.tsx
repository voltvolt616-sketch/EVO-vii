import React from 'react';

const Spinner = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-black bg-opacity-70 rounded-lg">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-400"></div>
      <p className="mt-4 text-green-300 text-lg font-mono">{message}</p>
    </div>
  );
};

export default Spinner;
