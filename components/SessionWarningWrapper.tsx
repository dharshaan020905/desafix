'use client';

import { useAuth } from '@/contexts/AuthContext';
import SessionWarning from './SessionWarning';

export default function SessionWarningWrapper() {
  const { sessionWarning, extendSession } = useAuth();

  if (!sessionWarning) return null;

  return <SessionWarning onExtend={extendSession} />;
}