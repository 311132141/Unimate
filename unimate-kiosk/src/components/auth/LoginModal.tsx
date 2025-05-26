import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, User, Lock, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (credentials: { username: string; password: string }) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  lastScannedCard?: string;
}

export function LoginModal({ 
  isOpen, 
  onClose, 
  onLogin, 
  isLoading, 
  error,
  lastScannedCard 
}: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  // Auto-fill username if card was scanned
  useEffect(() => {
    if (lastScannedCard && isOpen) {
      setUsername(lastScannedCard);
    }
  }, [lastScannedCard, isOpen]);

  // Clear form and errors when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setUsername('');
      setPassword('');
      setLocalError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!username.trim()) {
      setLocalError('Username is required');
      return;
    }

    if (!password.trim()) {
      setLocalError('Password is required');
      return;
    }

    try {
      await onLogin({ username: username.trim(), password });
    } catch (error) {
      // Error is handled by the parent component
    }
  };

  const handleCardLogin = () => {
    if (lastScannedCard) {
      setUsername(lastScannedCard);
      // Focus password field for quick entry
      setTimeout(() => {
        const passwordInput = document.getElementById('password-input');
        passwordInput?.focus();
      }, 100);
    }
  };

  const displayError = error || localError;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Login to Unimate</span>
          </DialogTitle>
          <DialogDescription>
            Enter your credentials to access your academic information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card Scan Notification */}
          {lastScannedCard && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Card detected: {lastScannedCard}
                </span>
              </div>
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={handleCardLogin}
                className="p-0 h-auto text-blue-600 hover:text-blue-800"
              >
                Use this card for login
              </Button>
            </div>
          )}

          {/* Error Alert */}
          {displayError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{displayError}</AlertDescription>
            </Alert>
          )}

          {/* Username Field */}
          <div className="space-y-2">
            <label htmlFor="username-input" className="text-sm font-medium text-gray-700">
              Username or Student ID
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="username-input"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="pl-9"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password-input" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="pl-9"
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !username.trim() || !password.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </div>
        </form>

        {/* Help Text */}
        <div className="text-xs text-gray-500 text-center pt-4 border-t">
          <p>Scan your student card or enter your credentials manually.</p>
          <p className="mt-1">Contact IT support if you need assistance.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
