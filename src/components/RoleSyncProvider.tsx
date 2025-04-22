
import { ReactNode } from 'react';
import { useRoleSync } from '@/hooks/useRoleSync';

interface RoleSyncProviderProps {
  children: ReactNode;
}

export const RoleSyncProvider = ({ children }: RoleSyncProviderProps) => {
  useRoleSync();
  return <>{children}</>;
};
