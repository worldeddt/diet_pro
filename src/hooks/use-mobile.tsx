import { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const { width } = Dimensions.get('window');
    setIsMobile(width < 768);
  }, []);

  return isMobile;
}

export function useScreenSize() {
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  useEffect(() => {
    const onChange = (result: any) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  return screenData;
}

export function usePlatform() {
  return {
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
    platform: Platform.OS,
  };
}
