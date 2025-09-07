import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { colors, createStyles } from '../../lib/utils';

interface IconProps {
  size?: number;
  color?: string;
  style?: TextStyle;
}

// Lucide React 아이콘들을 React Native Text로 구현
export const Target: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>🎯</Text>
);

export const TrendingUp: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>📈</Text>
);

export const Calendar: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>📅</Text>
);

export const Plus: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>➕</Text>
);

export const Flame: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>🔥</Text>
);

export const Activity: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>💪</Text>
);

export const Trophy: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>🏆</Text>
);

export const Clock: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>⏰</Text>
);

export const XCircle: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>❌</Text>
);

export const History: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>📊</Text>
);

export const ArrowLeft: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>←</Text>
);

export const Search: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>🔍</Text>
);

export const Camera: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>📷</Text>
);

export const Coffee: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>☕</Text>
);

export const UtensilsCrossed: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>🍽️</Text>
);

export const Moon: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>🌙</Text>
);

export const Timer: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>⏱️</Text>
);

export const Zap: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>⚡</Text>
);

export const Play: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>▶️</Text>
);

export const Pause: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>⏸️</Text>
);

export const RotateCcw: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>🔄</Text>
);

export const Dumbbell: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>🏋️</Text>
);

export const Heart: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>❤️</Text>
);

export const Bike: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>🚴</Text>
);

export const User: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>👤</Text>
);

export const Scale: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>⚖️</Text>
);

export const TrendingDown: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>📉</Text>
);

export const Edit: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>✏️</Text>
);

export const Mail: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>📧</Text>
);

export const Lock: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>🔒</Text>
);

export const Eye: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>👁️</Text>
);

export const EyeOff: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>🙈</Text>
);

export const Apple: React.FC<IconProps> = ({ size = 24, color = colors.text, style }) => (
  <Text style={[styles.icon, { fontSize: size, color }, style]}>🍎</Text>
);

const styles = createStyles({
  icon: {
    textAlign: 'center',
  },
});
