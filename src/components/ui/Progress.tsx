import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors, createStyles } from '../../lib/utils';

interface ProgressProps {
  value: number; // 0-100
  style?: ViewStyle;
  backgroundColor?: string;
  progressColor?: string;
  height?: number;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  style,
  backgroundColor = colors.surface,
  progressColor = colors.primary,
  height = 8,
}) => {
  const clampedValue = Math.max(0, Math.min(100, value));

  const containerStyle = [
    styles.container,
    { backgroundColor, height },
    style,
  ];

  const progressStyle = [
    styles.progress,
    {
      backgroundColor: progressColor,
      width: `${clampedValue}%`,
      height,
    },
  ];

  return (
    <View style={containerStyle}>
      <View style={progressStyle} />
    </View>
  );
};

const styles = createStyles({
  container: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: 4,
  },
});
