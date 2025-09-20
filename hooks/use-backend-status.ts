import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api';

interface BackendStatus {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  lastChecked: Date | null;
}

export const useBackendStatus = () => {
  const [status, setStatus] = useState<BackendStatus>({
    isConnected: false,
    isLoading: true,
    error: null,
    lastChecked: null,
  });

  const checkBackendStatus = async () => {
    setStatus(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      
      if (response.ok) {
        setStatus({
          isConnected: true,
          isLoading: false,
          error: null,
          lastChecked: new Date(),
        });
      } else {
        throw new Error(`Backend responded with status: ${response.status}`);
      }
    } catch (error) {
      setStatus({
        isConnected: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        lastChecked: new Date(),
      });
    }
  };

  useEffect(() => {
    // Check immediately on mount
    checkBackendStatus();

    // Check every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    ...status,
    checkStatus: checkBackendStatus,
  };
};