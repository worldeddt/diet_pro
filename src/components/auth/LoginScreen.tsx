import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Mail, Lock, Eye, EyeOff, Apple } from '../ui/Icons';
import { colors, spacing, fontSizes, createStyles } from '../../lib/utils';
import authService from '../../services/authService';

interface LoginScreenProps {
  onNavigate: (screen: string) => void;
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate, onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('오류', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.login(email, password);
      Alert.alert('성공', '로그인되었습니다!', [
        { text: '확인', onPress: onLogin }
      ]);
    } catch (error) {
      Alert.alert('오류', error instanceof Error ? error.message : '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* 앱 로고 섹션 */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>🍎</Text>
              </View>
            </View>
            <View style={styles.titleSection}>
              <Text style={styles.title}>헬시다이어트</Text>
              <Text style={styles.subtitle}>건강한 다이어트의 시작</Text>
            </View>
          </View>

          {/* 로그인 카드 */}
          <Card style={styles.loginCard}>
            <CardHeader style={styles.cardHeader}>
              <CardTitle style={styles.cardTitle}>로그인</CardTitle>
              <CardDescription style={styles.cardDescription}>
                계정에 로그인하여 다이어트 여정을 시작하세요
              </CardDescription>
            </CardHeader>
            <CardContent style={styles.cardContent}>
              <Input
                label="이메일"
                placeholder="your@email.com"
                value={email}
                keyboardType="email-address"
                leftIcon={<Mail size={16} color={colors.textSecondary} />}
                style={styles.input}
                onChangeText={e => {
                  console.log(e);
                  setEmail(e)
                }}
              />

              <Input
                label="비밀번호"
                placeholder="비밀번호를 입력하세요"
                value={password}
                secureTextEntry={!showPassword}
                rightIcon={
                  showPassword ? (
                    <EyeOff size={16} color={colors.textSecondary} />
                  ) : (
                    <Eye size={16} color={colors.textSecondary} />
                  )
                }
                onRightIconPress={() => setShowPassword(!showPassword)}
                style={styles.input}
                onChangeText={e => setPassword(e)}
              />

              <Button
                title="로그인"
                onPress={handleLogin}
                disabled={isLoading}
                style={styles.loginButton}
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>또는</Text>
                <View style={styles.dividerLine} />
              </View>

              <Button
                title="Apple로 계속하기"
                onPress={() => {}}
                variant="outline"
                icon={<Apple size={16} color={colors.primary} />}
                style={styles.appleButton}
              />

              <View style={styles.signupSection}>
                <Text style={styles.signupText}>
                  계정이 없으신가요?{' '}
                  <Text
                    onPress={() => onNavigate('signUp')}
                    style={styles.signupLink}
                  >
                    회원가입
                  </Text>
                </Text>
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = createStyles({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    marginBottom: spacing.lg,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 40,
  },
  titleSection: {
    alignItems: 'center',
  },
  title: {
    fontSize: fontSizes['3xl'],
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSizes.base,
    color: colors.white,
    opacity: 0.8,
  },
  loginCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 0,
  },
  cardHeader: {
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: fontSizes['2xl'],
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  cardDescription: {
    textAlign: 'center',
  },
  cardContent: {
    paddingTop: 0,
  },
  input: {
    marginBottom: spacing.md,
  },
  loginButton: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  appleButton: {
    marginBottom: spacing.lg,
  },
  signupSection: {
    alignItems: 'center',
  },
  signupText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  signupLink: {
    color: colors.primary,
    fontWeight: '500',
  },
});
