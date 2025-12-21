
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (signUpError) throw signUpError;

        // If data.session exists, email confirmation is disabled and we are logged in
        if (data.session) {
          navigate('/admin');
        } else {
          alert('Check your inbox for a verification email!');
          setIsSignUp(false);
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetRequest = async () => {
    if (!email) {
      setError('Enter your email first to receive a reset link.');
      return;
    }
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
    if (resetError) setError(resetError.message);
    else alert('Password reset link has been sent to your email!');
  };

  return (
    <div className="max-w-sm mx-auto mt-24 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">{isSignUp ? 'Create Admin Account' : 'Admin Sign In'}</h1>
        <p className="text-sm opacity-50">
          {isSignUp 
            ? 'Set up your credentials for the portfolio.' 
            : 'Access your portfolio management dashboard.'}
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="block text-[11px] uppercase tracking-widest font-bold opacity-30 mb-2">Email Address</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
            placeholder="admin@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-widest font-bold opacity-30 mb-2">Password</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
            placeholder="••••••••"
            required
          />
        </div>
        
        {error && (
          <div className="text-red-500 text-xs bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-100 dark:border-red-500/20">
            {error}
          </div>
        )}

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : (
            isSignUp ? 'Create Account' : 'Sign In'
          )}
        </button>

        <div className="flex flex-col gap-3 pt-4 items-center">
          <button 
            type="button" 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs opacity-40 hover:opacity-100 hover:underline"
          >
            {isSignUp ? 'Already have an account? Sign In' : 'First time? Create Admin Account'}
          </button>
          
          {!isSignUp && (
            <button 
              type="button" 
              onClick={handleResetRequest}
              className="text-[10px] opacity-30 hover:opacity-100 hover:underline"
            >
              Forgot password?
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
