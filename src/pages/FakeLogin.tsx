import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const FakeLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const doLogin = async () => {
      await login({ email: 'demo@admin.test' });
      navigate('/admin', { replace: true });
    };
    doLogin();
  }, [login, navigate]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold mb-2">Signing you in…</h1>
      <p className="text-gray-600 dark:text-gray-300">Redirecting to Admin Dashboard</p>
    </div>
  );
};

export default FakeLogin;


