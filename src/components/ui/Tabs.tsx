import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, fontSizes, spacing, createStyles } from '../../lib/utils';

interface TabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  style?: ViewStyle;
}

interface TabsListProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Tabs: React.FC<TabsProps> = ({
  children,
  defaultValue,
  value,
  onValueChange,
  style,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const currentValue = value !== undefined ? value : internalValue;

  const handleValueChange = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <View style={[styles.tabs, style]}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            currentValue,
            onValueChange: handleValueChange,
          } as any);
        }
        return child;
      })}
    </View>
  );
};

export const TabsList: React.FC<TabsListProps> = ({ children, style }) => {
  return <View style={[styles.tabsList, style]}>{children}</View>;
};

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  style,
  textStyle,
  ...props
}) => {
  const { currentValue, onValueChange } = props as any;
  const isActive = currentValue === value;

  const triggerStyle = [
    styles.trigger,
    isActive && styles.activeTrigger,
    style,
  ];

  const triggerTextStyle = [
    styles.triggerText,
    isActive && styles.activeTriggerText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={triggerStyle}
      onPress={() => onValueChange?.(value)}
      activeOpacity={0.7}
    >
      <Text style={triggerTextStyle}>{children}</Text>
    </TouchableOpacity>
  );
};

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  style,
  ...props
}) => {
  const { currentValue } = props as any;
  
  if (currentValue !== value) {
    return null;
  }

  return <View style={[styles.content, style]}>{children}</View>;
};

const styles = createStyles({
  tabs: {
    flex: 1,
  },
  tabsList: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 4,
    marginBottom: spacing.md,
  },
  trigger: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTrigger: {
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  triggerText: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTriggerText: {
    color: colors.text,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
});
