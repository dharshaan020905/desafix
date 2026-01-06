'use client';

import { validatePassword } from '@/lib/security';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export default function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const validation = validatePassword(password);
  
  const getColor = () => {
    if (!validation.valid) return 'bg-red-500';
    switch (validation.strength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const getWidth = () => {
    if (!validation.valid) return 'w-1/3';
    switch (validation.strength) {
      case 'weak': return 'w-1/3';
      case 'medium': return 'w-2/3';
      case 'strong': return 'w-full';
      default: return 'w-0';
    }
  };

  const getTextColor = () => {
    if (!validation.valid) return 'text-red-600';
    switch (validation.strength) {
      case 'weak': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'strong': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="mt-2">
      {/* Strength Bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColor()} ${getWidth()} transition-all duration-300`}
        ></div>
      </div>
      
      {/* Strength Text */}
      <p className={`text-xs mt-1 ${getTextColor()} font-medium`}>
        {validation.message}
      </p>

      {/* Requirements Checklist */}
      {password.length > 0 && (
        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-3 h-3 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className={password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
              At least 8 characters
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-3 h-3 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
              One uppercase letter
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-3 h-3 rounded-full ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className={/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
              One lowercase letter
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-3 h-3 rounded-full ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className={/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
              One number
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-3 h-3 rounded-full ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
              One special character
            </span>
          </div>
        </div>
      )}
    </div>
  );
}