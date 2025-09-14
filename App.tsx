import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginScreen } from './src/components/auth/LoginScreen';
import { Dashboard } from './src/components/dashboard/Dashboard';
import { FoodTracker } from './src/components/food/FoodTracker';
import { ProfileSettings } from './src/components/profile/ProfileSettings';
import { MilestoneScreen } from './src/components/milestone/MilestoneScreen';
import { PlanManagementScreen } from './src/components/plan/PlanManagementScreen';
import {SafeAreaProvider} from "react-native-safe-area-context";
import {SignUpScreen} from "./src/components/auth/SignUpScreen.tsx";
import authService from './src/services/authService';

const queryClient = new QueryClient();

type Screen = 'login' | 'dashboard' | 'food' | 'signUp' | 'profile' | 'milestone' | 'plan';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 토큰 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const accessToken = await authService.getAccessToken();
      if (accessToken) {
        setIsLoggedIn(true);
        setCurrentScreen('dashboard');
      }
    } catch (error) {
      console.error('인증 상태 확인 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen('dashboard');
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsLoggedIn(false);
      setCurrentScreen('login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const handleBack = () => {
    setCurrentScreen('dashboard');
  };

  const handleSignUpSuccess = () => {
    setCurrentScreen('login');
  };

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          {/* 로딩 화면 */}
        </QueryClientProvider>
      </SafeAreaProvider>
    );
  }

  if (!isLoggedIn) {
    if(currentScreen === "signUp") {
      return (
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <SignUpScreen onBack={handleBack} onSignUpSuccess={handleSignUpSuccess} />
          </QueryClientProvider>
        </SafeAreaProvider>
      );
    } else {
      return (
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <LoginScreen onNavigate={handleNavigate} onLogin={handleLogin} />
          </QueryClientProvider>
        </SafeAreaProvider>
      );
    }
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'food':
        return <FoodTracker onBack={handleBack} />;
      case 'profile':
        return <ProfileSettings onBack={handleBack} onLogout={handleLogout} />;
      case 'milestone':
        return <MilestoneScreen onBack={handleBack} />;
      case 'plan':
        return <PlanManagementScreen onBack={handleBack} onPlanCreated={(planId) => {
          console.log('Plan created:', planId);
          handleBack();
        }} />;
      default:
        return <Dashboard onNavigate={handleNavigate} onLogout={handleLogout} />;
    }
  };

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
          {renderScreen()}
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
