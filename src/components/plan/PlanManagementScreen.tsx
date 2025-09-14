import React, { useState, useEffect } from 'react';
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
  Calendar,
  Target,
  Plus,
  Edit,
  XCircle,
} from '../ui/Icons';
import { colors, spacing, fontSizes, createStyles } from '../../lib/utils';
import authService from '../../services/authService';

interface PlanManagementScreenProps {
  onBack: () => void;
  onPlanCreated?: (planId: number) => void;
}

interface PlanData {
  id: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  goal: {
    targetWeight: number;
    currentWeight: number;
  };
  createdAt: string;
}

export const PlanManagementScreen: React.FC<PlanManagementScreenProps> = ({ 
  onBack, 
  onPlanCreated 
}) => {
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    currentWeight: '',
    targetWeight: '',
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setIsLoading(true);
    try {
      const response = await authService.authenticatedRequest(
        'http://localhost:8080/api/plans'
      );
      
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      }
    } catch (error) {
      console.error('계획 로드 실패:', error);
      Alert.alert('오류', '다이어트 계획을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.startDate.trim()) {
      Alert.alert('오류', '시작 날짜를 선택해주세요.');
      return false;
    }
    if (!formData.endDate.trim()) {
      Alert.alert('오류', '종료 날짜를 선택해주세요.');
      return false;
    }
    if (!formData.currentWeight.trim()) {
      Alert.alert('오류', '현재 체중을 입력해주세요.');
      return false;
    }
    if (!formData.targetWeight.trim()) {
      Alert.alert('오류', '목표 체중을 입력해주세요.');
      return false;
    }
    
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const currentWeight = parseFloat(formData.currentWeight);
    const targetWeight = parseFloat(formData.targetWeight);
    
    if (startDate >= endDate) {
      Alert.alert('오류', '종료 날짜는 시작 날짜보다 늦어야 합니다.');
      return false;
    }
    
    if (isNaN(currentWeight) || currentWeight < 20 || currentWeight > 300) {
      Alert.alert('오류', '올바른 현재 체중을 입력해주세요. (20-300kg)');
      return false;
    }
    
    if (isNaN(targetWeight) || targetWeight < 20 || targetWeight > 300) {
      Alert.alert('오류', '올바른 목표 체중을 입력해주세요. (20-300kg)');
      return false;
    }
    
    if (targetWeight >= currentWeight) {
      Alert.alert('오류', '목표 체중은 현재 체중보다 작아야 합니다.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const requestData = {
        startDate: formData.startDate,
        endDate: formData.endDate,
        goal: {
          currentWeight: parseFloat(formData.currentWeight),
          targetWeight: parseFloat(formData.targetWeight),
        },
        status: 'ACTIVE',
      };

      let response;
      if (editingId) {
        // 수정
        response = await authService.authenticatedRequest(
          `http://localhost:8080/api/plans/${editingId}`,
          {
            method: 'PUT',
            body: JSON.stringify(requestData),
          }
        );
      } else {
        // 생성
        response = await authService.authenticatedRequest(
          'http://localhost:8080/api/plans',
          {
            method: 'POST',
            body: JSON.stringify(requestData),
          }
        );
      }

      if (response.ok) {
        const data = await response.json();
        Alert.alert('성공', editingId ? '계획이 수정되었습니다.' : '새로운 다이어트 계획이 생성되었습니다!');
        resetForm();
        loadPlans();
        
        if (!editingId && onPlanCreated) {
          onPlanCreated(data.id);
        }
      } else {
        const errorData = await response.json();
        Alert.alert('오류', errorData.message || '계획 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('계획 저장 실패:', error);
      Alert.alert('오류', '계획 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (plan: PlanData) => {
    setFormData({
      startDate: plan.startDate,
      endDate: plan.endDate,
      currentWeight: plan.goal.currentWeight.toString(),
      targetWeight: plan.goal.targetWeight.toString(),
    });
    setEditingId(plan.id);
    setIsCreating(true);
  };

  const handleCancel = async (planId: number) => {
    Alert.alert(
      '계획 취소',
      '이 다이어트 계획을 취소하시겠습니까?',
      [
        { text: '아니오', style: 'cancel' },
        {
          text: '예',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await authService.authenticatedRequest(
                `http://localhost:8080/api/plans/${planId}/cancel`,
                { method: 'PATCH' }
              );

              if (response.ok) {
                Alert.alert('성공', '다이어트 계획이 취소되었습니다.');
                loadPlans();
              } else {
                Alert.alert('오류', '계획 취소에 실패했습니다.');
              }
            } catch (error) {
              console.error('계획 취소 실패:', error);
              Alert.alert('오류', '계획 취소에 실패했습니다.');
            }
          },
        },
      ]
    );
  };

  const handleComplete = async (planId: number) => {
    Alert.alert(
      '계획 완료',
      '이 다이어트 계획을 완료로 표시하시겠습니까?',
      [
        { text: '아니오', style: 'cancel' },
        {
          text: '예',
          onPress: async () => {
            try {
              const response = await authService.authenticatedRequest(
                `http://localhost:8080/api/plans/${planId}/complete`,
                { method: 'PATCH' }
              );

              if (response.ok) {
                Alert.alert('성공', '다이어트 계획이 완료되었습니다!');
                loadPlans();
              } else {
                Alert.alert('오류', '계획 완료 처리에 실패했습니다.');
              }
            } catch (error) {
              console.error('계획 완료 실패:', error);
              Alert.alert('오류', '계획 완료 처리에 실패했습니다.');
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setFormData({ startDate: '', endDate: '', currentWeight: '', targetWeight: '' });
    setIsCreating(false);
    setEditingId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="default" size="sm">진행중</Badge>;
      case 'COMPLETED':
        return <Badge variant="success" size="sm">완료</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive" size="sm">취소</Badge>;
      default:
        return <Badge variant="secondary" size="sm">{status}</Badge>;
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
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
            <Text style={styles.headerTitle}>다이어트 계획</Text>
            <Text style={styles.headerSubtitle}>
              새로운 다이어트 여정을 시작해보세요
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentPadding}>
          {/* 계획 생성/수정 폼 */}
          {isCreating && (
            <Card style={styles.formCard}>
              <CardHeader>
                <CardTitle style={styles.cardTitleWithIcon}>
                  <Plus size={20} color={colors.primary} />
                  <Text style={styles.cardTitleText}>
                    {editingId ? '계획 수정' : '새 다이어트 계획'}
                  </Text>
                </CardTitle>
                <CardDescription>
                  목표를 설정하고 다이어트 계획을 만들어보세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <View style={styles.form}>
                  <View style={styles.formRow}>
                    <Input
                      label="시작 날짜"
                      placeholder="YYYY-MM-DD"
                      value={formData.startDate}
                      onChangeText={(text) => setFormData({ ...formData, startDate: text })}
                      leftIcon={<Calendar size={16} color={colors.textSecondary} />}
                      style={styles.inputHalf}
                    />
                    <Input
                      label="종료 날짜"
                      placeholder="YYYY-MM-DD"
                      value={formData.endDate}
                      onChangeText={(text) => setFormData({ ...formData, endDate: text })}
                      leftIcon={<Calendar size={16} color={colors.textSecondary} />}
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
                      // leftIcon={<Weight size={16} color={colors.textSecondary} />}
                      style={styles.inputHalf}
                    />
                    <Input
                      label="목표 체중 (kg)"
                      placeholder="65"
                      value={formData.targetWeight}
                      onChangeText={(text) => setFormData({ ...formData, targetWeight: text })}
                      keyboardType="numeric"
                      leftIcon={<Target size={16} color={colors.textSecondary} />}
                      style={styles.inputHalf}
                    />
                  </View>
                  
                  <View style={styles.formButtons}>
                    <Button
                      title="취소"
                      onPress={resetForm}
                      variant="outline"
                      style={styles.cancelButton}
                    />
                    <Button
                      title={editingId ? '수정' : '생성'}
                      onPress={handleSubmit}
                      disabled={isLoading}
                      style={styles.submitButton}
                    />
                  </View>
                </View>
              </CardContent>
            </Card>
          )}

          {/* 계획 목록 */}
          <Card style={styles.listCard}>
            <CardHeader>
              <View style={styles.listHeader}>
                <View>
                  <CardTitle style={styles.cardTitleWithIcon}>
                    <Calendar size={20} color={colors.primary} />
                    <Text style={styles.cardTitleText}>다이어트 계획</Text>
                  </CardTitle>
                  <CardDescription>
                    총 {plans.length}개의 계획이 있습니다
                  </CardDescription>
                </View>
                {!isCreating && (
                  <Button
                    title="새 계획"
                    onPress={() => setIsCreating(true)}
                    variant="primary"
                    size="sm"
                    icon={<Plus size={16} color={colors.white} />}
                  />
                )}
              </View>
            </CardHeader>
            <CardContent>
              {plans.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    아직 생성된 다이어트 계획이 없습니다.
                  </Text>
                  <Text style={styles.emptyStateSubtext}>
                    첫 번째 다이어트 계획을 만들어보세요!
                  </Text>
                </View>
              ) : (
                <View style={styles.planList}>
                  {plans.map((plan) => (
                    <View key={plan.id} style={styles.planItem}>
                      <View style={styles.planContent}>
                        <View style={styles.planHeader}>
                          <Text style={styles.planPeriod}>
                            {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                          </Text>
                          {getStatusBadge(plan.status)}
                        </View>
                        
                        <View style={styles.planStats}>
                          <View style={styles.statItem}>
                            {/*<Weight size={16} color={colors.textSecondary} />*/}
                            <Text style={styles.statLabel}>현재</Text>
                            <Text style={styles.statValue}>{plan.goal.currentWeight}kg</Text>
                          </View>
                          
                          <View style={styles.statItem}>
                            <Target size={16} color={colors.textSecondary} />
                            <Text style={styles.statLabel}>목표</Text>
                            <Text style={styles.statValue}>{plan.goal.targetWeight}kg</Text>
                          </View>
                          
                          {plan.status === 'ACTIVE' && (
                            <View style={styles.statItem}>
                              <Calendar size={16} color={colors.textSecondary} />
                              <Text style={styles.statLabel}>남은 일</Text>
                              <Text style={styles.statValue}>{getDaysRemaining(plan.endDate)}일</Text>
                            </View>
                          )}
                        </View>
                      </View>
                      
                      <View style={styles.planActions}>
                        {plan.status === 'ACTIVE' && (
                          <>
                            <Button
                              title=""
                              onPress={() => handleEdit(plan)}
                              variant="ghost"
                              size="sm"
                              icon={<Edit size={16} color={colors.textSecondary} />}
                              style={styles.actionButton}
                            />
                            <Button
                              title=""
                              onPress={() => handleComplete(plan.id)}
                              variant="ghost"
                              size="sm"
                              // icon={<CheckCircle size={16} color={colors.success} />}
                              style={styles.actionButton}
                            />
                            <Button
                              title=""
                              onPress={() => handleCancel(plan.id)}
                              variant="ghost"
                              size="sm"
                              // icon={<XCircle size={16} color={colors.destructive} />}
                              style={styles.actionButton}
                            />
                          </>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </CardContent>
          </Card>
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
  formCard: {
    marginBottom: spacing.lg,
  },
  listCard: {
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
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  formButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateText: {
    fontSize: fontSizes.base,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  emptyStateSubtext: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    opacity: 0.7,
  },
  planList: {
    gap: spacing.md,
  },
  planItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  planContent: {
    flex: 1,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  planPeriod: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    color: colors.text,
  },
  planStats: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statLabel: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    color: colors.text,
  },
  planActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  actionButton: {
    width: 32,
    height: 32,
    padding: 0,
  },
});
