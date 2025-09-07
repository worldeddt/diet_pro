import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginScreen } from './src/components/auth/LoginScreen';
import { Dashboard } from './src/components/dashboard/Dashboard';
import { FoodTracker } from './src/components/food/FoodTracker';
import { ExerciseTracker } from './src/components/exercise/ExerciseTracker';
import { ProfileSettings } from './src/components/profile/ProfileSettings';
import {SafeAreaProvider} from "react-native-safe-area-context";

const queryClient = new QueryClient();

type Screen = 'login' | 'dashboard' | 'food' | 'exercise' | 'profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen('dashboard');
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const handleBack = () => {
    setCurrentScreen('dashboard');
  };

  if (!isLoggedIn) {
    return (
      <QueryClientProvider client={queryClient}>
        <LoginScreen onLogin={handleLogin} />
      </QueryClientProvider>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'food':
        return <FoodTracker onBack={handleBack} />;
      case 'exercise':
        return <ExerciseTracker onBack={handleBack} />;
      case 'profile':
        return <ProfileSettings onBack={handleBack} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
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
