import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { Toast } from './Toast';
import { useToast } from '../../hooks/use-toast';
import { createStyles } from '../../lib/utils';

export const Toaster: React.FC = () => {
  const { toasts, dismiss } = useToast();

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onDismiss={dismiss}
        />
      ))}
    </View>
  );
};

const styles = createStyles({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});
