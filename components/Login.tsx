import React, { useState } from 'react';
import { LogoIcon } from './icons';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'evo' && password === '0001') {
      setError('');
      onLoginSuccess();
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <header className="text-center mb-10 flex flex-col items-center">
            <LogoIcon className="w-20 h-20 text-green-400" />
            <h1 className="text-4xl mt-4 sm:text-5xl font-bold text-green-400 font-orbitron tracking-wider">
              AI Product Stylizer
            </h1>
            <p className="mt-3 text-lg text-gray-400 font-tech-mono">Please log in to continue</p>
        </header>
        <div className="glass-pane rounded-xl p-8 shadow-2xl shadow-green-500/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-green-300 mb-2 font-tech-mono"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/80 border border-green-800/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-green-300 mb-2 font-tech-mono"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/80 border border-green-800/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                placeholder="Enter password"
                required
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm text-center bg-red-900/30 p-2 rounded-md border border-red-700/50">
                {error}
              </p>
            )}
            <div>
              <button
                type="submit"
                className="w-full py-3 mt-2 px-6 bg-green-500 text-black text-lg font-bold rounded-lg hover:bg-green-400 transition-all duration-300 disabled:bg-gray-700 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(74,222,128,0.4)] hover:shadow-[0_0_25px_rgba(74,222,128,0.6)]"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;