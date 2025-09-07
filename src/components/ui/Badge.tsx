import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, fontSizes, spacing, createStyles } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
}) => {
  const badgeStyle = [
    styles.badge,
    styles[variant],
    styles[size],
    style,
  ];

  const badgeTextStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    textStyle,
  ];

  return (
    <View style={badgeStyle}>
      <Text style={badgeTextStyle}>{children}</Text>
    </View>
  );
};

const styles = createStyles({
  badge: {
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  // Variants
  default: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  destructive: {
    backgroundColor: colors.error,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  success: {
    backgroundColor: colors.success,
  },
  warning: {
    backgroundColor: colors.warning,
  },
  // Sizes
  sm: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  md: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  lg: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  // Text styles
  text: {
    fontWeight: '500',
    textAlign: 'center',
  },
  defaultText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.white,
  },
  destructiveText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.text,
  },
  successText: {
    color: colors.white,
  },
  warningText: {
    color: colors.white,
  },
  // Size text
  smText: {
    fontSize: fontSizes.xs,
  },
  mdText: {
    fontSize: fontSizes.sm,
  },
  lgText: {
    fontSize: fontSizes.base,
  },
});
