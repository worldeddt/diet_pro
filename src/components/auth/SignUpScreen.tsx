import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  Ruler,
  Weight,
  Activity,
} from '../ui/Icons';
import { colors, spacing, fontSizes, createStyles } from '../../lib/utils';

interface SignUpScreenProps {
  onBack: () => void;
  onSignUpSuccess: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ onBack, onSignUpSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    height: '',
    currentWeight: '',
    targetWeight: '',
    activityLevel: 'moderate',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const activityLevels = [
    { value: 'low', label: '낮음 (주 1-2회 운동)' },
    { value: 'moderate', label: '보통 (주 3-4회 운동)' },
    { value: 'high', label: '높음 (주 5-6회 운동)' },
    { value: 'very-high', label: '매우 높음 (매일 운동)' },
  ];

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('오류', '이름을 입력해주세요.');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('오류', '이메일을 입력해주세요.');
      return false;
    }
    if (!formData.email.includes('@')) {
      Alert.alert('오류', '올바른 이메일 형식을 입력해주세요.');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('오류', '비밀번호는 6자 이상이어야 합니다.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return false;
    }
    if (!formData.age || parseInt(formData.age) < 1 || parseInt(formData.age) > 150) {
      Alert.alert('오류', '올바른 나이를 입력해주세요.');
      return false;
    }
    if (!formData.height || parseFloat(formData.height) < 50 || parseFloat(formData.height) > 250) {
      Alert.alert('오류', '올바른 신장을 입력해주세요.');
      return false;
    }
    if (!formData.currentWeight || parseFloat(formData.currentWeight) < 20 || parseFloat(formData.currentWeight) > 300) {
      Alert.alert('오류', '올바른 현재 체중을 입력해주세요.');
      return false;
    }
    if (!formData.targetWeight || parseFloat(formData.targetWeight) < 20 || parseFloat(formData.targetWeight) > 300) {
      Alert.alert('오류', '올바른 목표 체중을 입력해주세요.');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // TODO: API 호출
      console.log('회원가입 데이터:', formData);
      
      // 임시 성공 처리
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert('성공', '회원가입이 완료되었습니다!', [
          { text: '확인', onPress: onSignUpSuccess }
        ]);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('오류', '회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Button
            title=""
            onPress={onBack}
            variant="ghost"
            size="sm"
            icon={<ArrowLeft size={20} color={colors.white} />}
            style={styles.backButton}
          />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>회원가입</Text>
            <Text style={styles.headerSubtitle}>
              다이어트 여정을 시작해보세요
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentPadding}>
          {/* 기본 정보 */}
          <Card style={styles.card}>
            <CardHeader>
              <CardTitle style={styles.cardTitleWithIcon}>
                <User size={20} color={colors.primary} />
                <Text style={styles.cardTitleText}>기본 정보</Text>
              </CardTitle>
              <CardDescription>
                회원가입에 필요한 기본 정보를 입력해주세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <View style={styles.form}>
                <Input
                  label="이름"
                  placeholder="홍길동"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  leftIcon={<User size={16} color={colors.textSecondary} />}
                  style={styles.input}
                />
                
                <Input
                  label="이메일"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon={<Mail size={16} color={colors.textSecondary} />}
                  style={styles.input}
                />
                
                <Input
                  label="비밀번호"
                  placeholder="6자 이상 입력해주세요"
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  secureTextEntry={!showPassword}
                  leftIcon={<Lock size={16} color={colors.textSecondary} />}
                  rightIcon={
                    <Button
                      title=""
                      onPress={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      size="sm"
                      icon={showPassword ? <EyeOff size={16} color={colors.textSecondary} /> : <Eye size={16} color={colors.textSecondary} />}
                      style={styles.eyeButton}
                    />
                  }
                  style={styles.input}
                />
                
                <Input
                  label="비밀번호 확인"
                  placeholder="비밀번호를 다시 입력해주세요"
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                  secureTextEntry={!showConfirmPassword}
                  leftIcon={<Lock size={16} color={colors.textSecondary} />}
                  rightIcon={
                    <Button
                      title=""
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      variant="ghost"
                      size="sm"
                      icon={showConfirmPassword ? <EyeOff size={16} color={colors.textSecondary} /> : <Eye size={16} color={colors.textSecondary} />}
                      style={styles.eyeButton}
                    />
                  }
                  style={styles.input}
                />
              </View>
            </CardContent>
          </Card>

          {/* 신체 정보 */}
          <Card style={styles.card}>
            <CardHeader>
              <CardTitle style={styles.cardTitleWithIcon}>
                <Weight size={20} color={colors.primary} />
                <Text style={styles.cardTitleText}>신체 정보</Text>
              </CardTitle>
              <CardDescription>
                정확한 다이어트 계획을 위해 신체 정보를 입력해주세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <View style={styles.form}>
                <View style={styles.formRow}>
                  <Input
                    label="나이"
                    placeholder="25"
                    value={formData.age}
                    onChangeText={(text) => setFormData({ ...formData, age: text })}
                    keyboardType="numeric"
                    leftIcon={<Calendar size={16} color={colors.textSecondary} />}
                    style={styles.inputHalf}
                  />
                  <Input
                    label="신장 (cm)"
                    placeholder="170"
                    value={formData.height}
                    onChangeText={(text) => setFormData({ ...formData, height: text })}
                    keyboardType="numeric"
                    leftIcon={<Ruler size={16} color={colors.textSecondary} />}
                    style={styles.inputHalf}
                  />
                </View>
                
                <View style={styles.formRow}>
                  <Input
                    label="현재 체중 (kg)"
                    placeholder="70"
                    value={formData.currentWeight}
                    onChangeText={(text) => setFormData({ ...formData, currentWeight: text })}
                    keyboardType="numeric"
                    leftIcon={<Weight size={16} color={colors.textSecondary} />}
                    style={styles.inputHalf}
                  />
                  <Input
                    label="목표 체중 (kg)"
                    placeholder="65"
                    value={formData.targetWeight}
                    onChangeText={(text) => setFormData({ ...formData, targetWeight: text })}
                    keyboardType="numeric"
                    leftIcon={<Weight size={16} color={colors.textSecondary} />}
                    style={styles.inputHalf}
                  />
                </View>
              </View>
            </CardContent>
          </Card>

          {/* 활동 수준 */}
          <Card style={styles.card}>
            <CardHeader>
              <CardTitle style={styles.cardTitleWithIcon}>
                <Activity size={20} color={colors.primary} />
                <Text style={styles.cardTitleText}>활동 수준</Text>
              </CardTitle>
              <CardDescription>
                평소 운동 빈도를 선택해주세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <View style={styles.activityLevels}>
                {activityLevels.map((level) => (
                  <Button
                    key={level.value}
                    title={level.label}
                    onPress={() => setFormData({ ...formData, activityLevel: level.value })}
                    variant={formData.activityLevel === level.value ? 'primary' : 'outline'}
                    style={[
                      styles.activityButton,
                      formData.activityLevel === level.value && styles.activityButtonActive
                    ]}
                  />
                ))}
              </View>
            </CardContent>
          </Card>

          {/* 회원가입 버튼 */}
          <Button
            title="회원가입"
            onPress={handleSignUp}
            disabled={isLoading}
            style={styles.signUpButton}
          />

          {/* 로그인 링크 */}
          <View style={styles.loginLink}>
            <Text style={styles.loginLinkText}>
              이미 계정이 있으신가요?{' '}
            </Text>
            <Button
              title="로그인"
              onPress={onBack}
              variant="ghost"
              size="sm"
              style={styles.loginButton}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = createStyles({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSizes.sm,
    color: colors.white,
    opacity: 0.8,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  card: {
    marginBottom: spacing.lg,
  },
  cardTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardTitleText: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.text,
  },
  form: {
    gap: spacing.md,
  },
  formRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  input: {
    marginBottom: 0,
  },
  inputHalf: {
    flex: 1,
    marginBottom: 0,
  },
  eyeButton: {
    width: 32,
    height: 32,
    padding: 0,
  },
  activityLevels: {
    gap: spacing.sm,
  },
  activityButton: {
    justifyContent: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  activityButtonActive: {
    backgroundColor: colors.primary,
  },
  signUpButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  loginButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
});