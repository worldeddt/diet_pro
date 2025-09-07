import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { colors, fontSizes, spacing, createStyles } from '../../lib/utils';

interface ToastProps {
  toast: {
    id: string;
    title?: string;
    description?: string;
    variant?: 'default' | 'destructive';
  };
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleDismiss = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDismiss(toast.id);
    });
  };

  const toastStyle = [
    styles.toast,
    toast.variant === 'destructive' && styles.destructiveToast,
  ];

  const titleStyle = [
    styles.title,
    toast.variant === 'destructive' && styles.destructiveTitle,
  ];

  const descriptionStyle = [
    styles.description,
    toast.variant === 'destructive' && styles.destructiveDescription,
  ];

  return (
    <Animated.View
      style={[
        toastStyle,
        {
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={handleDismiss}
        activeOpacity={0.8}
      >
        {toast.title && <Text style={titleStyle}>{toast.title}</Text>}
        {toast.description && <Text style={descriptionStyle}>{toast.description}</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = createStyles({
  toast: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  destructiveToast: {
    borderLeftColor: colors.error,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  destructiveTitle: {
    color: colors.error,
  },
  description: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  destructiveDescription: {
    color: colors.textSecondary,
  },
});
