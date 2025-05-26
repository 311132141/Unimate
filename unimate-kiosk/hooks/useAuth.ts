import { useEffect, useState } from 'react';
import { StorageService } from '@/lib/services/storage.service';
import { AuthService } from '@/lib/services/auth.service';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = StorageService.getAccessToken();
      const user = StorageService.getUsername();
      setIsAuthenticated(!!token);
      setUsername(user);
    };

    checkAuth();
    
    // Check auth on storage events
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      await AuthService.login(username, password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUsername(null);
    router.push('/');
  };

  return {
    isAuthenticated,
    username,
    login,
    logout
  };
};
