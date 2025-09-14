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
  Weight,
  Activity,
  TrendingUp,
  Calendar,
  Plus,
  Edit,
  Trash2,
} from '../ui/Icons';
import { colors, spacing, fontSizes, createStyles } from '../../lib/utils';
import authService from '../../services/authService';

interface MilestoneScreenProps {
  onBack: () => void;
  planId?: number;
}

interface MilestoneData {
  id: number;
  weight: number;
  fat: number;
  muscle: number;
  date: string;
  createdAt: string;
}

export const MilestoneScreen: React.FC<MilestoneScreenProps> = ({ onBack, planId }) => {
  const [milestones, setMilestones] = useState<MilestoneData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    weight: '',
    fat: '',
    muscle: '',
  });

  useEffect(() => {
    loadMilestones();
  }, [planId]);

  const loadMilestones = async () => {
    if (!planId) return;
    
    setIsLoading(true);
    try {
      const response = await authService.authenticatedRequest(
        `http://localhost:8080/api/mile-stone/plan/${planId}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setMilestones(data);
      }
    } catch (error) {
      console.error('마일스톤 로드 실패:', error);
      Alert.alert('오류', '마일스톤 데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.weight.trim()) {
      Alert.alert('오류', '체중을 입력해주세요.');
      return false;
    }
    if (!formData.fat.trim()) {
      Alert.alert('오류', '체지방률을 입력해주세요.');
      return false;
    }
    if (!formData.muscle.trim()) {
      Alert.alert('오류', '근육량을 입력해주세요.');
      return false;
    }
    
    const weight = parseFloat(formData.weight);
    const fat = parseFloat(formData.fat);
    const muscle = parseFloat(formData.muscle);
    
    if (isNaN(weight) || weight < 20 || weight > 300) {
      Alert.alert('오류', '올바른 체중을 입력해주세요. (20-300kg)');
      return false;
    }
    if (isNaN(fat) || fat < 0 || fat > 100) {
      Alert.alert('오류', '올바른 체지방률을 입력해주세요. (0-100%)');
      return false;
    }
    if (isNaN(muscle) || muscle < 0 || muscle > 100) {
      Alert.alert('오류', '올바른 근육량을 입력해주세요. (0-100kg)');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (!planId) {
      Alert.alert('오류', '다이어트 계획이 없습니다.');
      return;
    }

    setIsLoading(true);
    try {
      const requestData = {
        planId,
        weight: parseFloat(formData.weight),
        fat: parseFloat(formData.fat),
        muscle: parseFloat(formData.muscle),
      };

      let response;
      if (editingId) {
        // 수정
        response = await authService.authenticatedRequest(
          `http://localhost:8080/api/mile-stone/${editingId}`,
          {
            method: 'PUT',
            body: JSON.stringify(requestData),
          }
        );
      } else {
        // 추가
        response = await authService.authenticatedRequest(
          'http://localhost:8080/api/mile-stone',
          {
            method: 'POST',
            body: JSON.stringify(requestData),
          }
        );
      }

      if (response.ok) {
        Alert.alert('성공', editingId ? '마일스톤이 수정되었습니다.' : '마일스톤이 추가되었습니다.');
        resetForm();
        loadMilestones();
      } else {
        const errorData = await response.json();
        Alert.alert('오류', errorData.message || '마일스톤 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('마일스톤 저장 실패:', error);
      Alert.alert('오류', '마일스톤 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (milestone: MilestoneData) => {
    setFormData({
      weight: milestone.weight.toString(),
      fat: milestone.fat.toString(),
      muscle: milestone.muscle.toString(),
    });
    setEditingId(milestone.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      '삭제 확인',
      '이 마일스톤을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await authService.authenticatedRequest(
                `http://localhost:8080/api/mile-stone/${id}`,
                { method: 'DELETE' }
              );

              if (response.ok) {
                Alert.alert('성공', '마일스톤이 삭제되었습니다.');
                loadMilestones();
              } else {
                Alert.alert('오류', '마일스톤 삭제에 실패했습니다.');
              }
            } catch (error) {
              console.error('마일스톤 삭제 실패:', error);
              Alert.alert('오류', '마일스톤 삭제에 실패했습니다.');
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setFormData({ weight: '', fat: '', muscle: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
            <Text style={styles.headerTitle}>체성분 기록</Text>
            <Text style={styles.headerSubtitle}>
              다이어트 진행 상황을 기록해보세요
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentPadding}>
          {/* 추가/수정 폼 */}
          {isAdding && (
            <Card style={styles.formCard}>
              <CardHeader>
                <CardTitle style={styles.cardTitleWithIcon}>
                  <Plus size={20} color={colors.primary} />
                  <Text style={styles.cardTitleText}>
                    {editingId ? '마일스톤 수정' : '새 마일스톤 추가'}
                  </Text>
                </CardTitle>
                <CardDescription>
                  현재 체성분을 정확히 측정하여 입력해주세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <View style={styles.form}>
                  <Input
                    label="체중 (kg)"
                    placeholder="70.5"
                    value={formData.weight}
                    onChangeText={(text) => setFormData({ ...formData, weight: text })}
                    keyboardType="numeric"
                    leftIcon={<Weight size={16} color={colors.textSecondary} />}
                    style={styles.input}
                  />
                  
                  <Input
                    label="체지방률 (%)"
                    placeholder="25.3"
                    value={formData.fat}
                    onChangeText={(text) => setFormData({ ...formData, fat: text })}
                    keyboardType="numeric"
                    leftIcon={<Activity size={16} color={colors.textSecondary} />}
                    style={styles.input}
                  />
                  
                  <Input
                    label="근육량 (kg)"
                    placeholder="35.2"
                    value={formData.muscle}
                    onChangeText={(text) => setFormData({ ...formData, muscle: text })}
                    keyboardType="numeric"
                    leftIcon={<TrendingUp size={16} color={colors.textSecondary} />}
                    style={styles.input}
                  />
                  
                  <View style={styles.formButtons}>
                    <Button
                      title="취소"
                      onPress={resetForm}
                      variant="outline"
                      style={styles.cancelButton}
                    />
                    <Button
                      title={editingId ? '수정' : '추가'}
                      onPress={handleSubmit}
                      disabled={isLoading}
                      style={styles.submitButton}
                    />
                  </View>
                </View>
              </CardContent>
            </Card>
          )}

          {/* 마일스톤 목록 */}
          <Card style={styles.listCard}>
            <CardHeader>
              <View style={styles.listHeader}>
                <View>
                  <CardTitle style={styles.cardTitleWithIcon}>
                    <Calendar size={20} color={colors.primary} />
                    <Text style={styles.cardTitleText}>기록된 마일스톤</Text>
                  </CardTitle>
                  <CardDescription>
                    총 {milestones.length}개의 기록이 있습니다
                  </CardDescription>
                </View>
                {!isAdding && (
                  <Button
                    title="추가"
                    onPress={() => setIsAdding(true)}
                    variant="primary"
                    size="sm"
                    icon={<Plus size={16} color={colors.white} />}
                  />
                )}
              </View>
            </CardHeader>
            <CardContent>
              {milestones.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    아직 기록된 마일스톤이 없습니다.
                  </Text>
                  <Text style={styles.emptyStateSubtext}>
                    첫 번째 체성분을 기록해보세요!
                  </Text>
                </View>
              ) : (
                <View style={styles.milestoneList}>
                  {milestones.map((milestone, index) => (
                    <View key={milestone.id} style={styles.milestoneItem}>
                      <View style={styles.milestoneContent}>
                        <View style={styles.milestoneHeader}>
                          <Text style={styles.milestoneDate}>
                            {formatDate(milestone.date || milestone.createdAt)}
                          </Text>
                          {index === 0 && (
                            <Badge variant="success" size="sm">
                              최신
                            </Badge>
                          )}
                        </View>
                        
                        <View style={styles.milestoneStats}>
                          <View style={styles.statItem}>
                            <Weight size={16} color={colors.textSecondary} />
                            <Text style={styles.statLabel}>체중</Text>
                            <Text style={styles.statValue}>{milestone.weight}kg</Text>
                          </View>
                          
                          <View style={styles.statItem}>
                            <Activity size={16} color={colors.textSecondary} />
                            <Text style={styles.statLabel}>체지방</Text>
                            <Text style={styles.statValue}>{milestone.fat}%</Text>
                          </View>
                          
                          <View style={styles.statItem}>
                            <TrendingUp size={16} color={colors.textSecondary} />
                            <Text style={styles.statLabel}>근육량</Text>
                            <Text style={styles.statValue}>{milestone.muscle}kg</Text>
                          </View>
                        </View>
                      </View>
                      
                      <View style={styles.milestoneActions}>
                        <Button
                          title=""
                          onPress={() => handleEdit(milestone)}
                          variant="ghost"
                          size="sm"
                          icon={<Edit size={16} color={colors.textSecondary} />}
                          style={styles.actionButton}
                        />
                        <Button
                          title=""
                          onPress={() => handleDelete(milestone.id)}
                          variant="ghost"
                          size="sm"
                          icon={<Trash2 size={16} color={colors.destructive} />}
                          style={styles.actionButton}
                        />
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
  input: {
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
  milestoneList: {
    gap: spacing.md,
  },
  milestoneItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  milestoneDate: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    color: colors.text,
  },
  milestoneStats: {
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
  milestoneActions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  actionButton: {
    width: 32,
    height: 32,
    padding: 0,
  },
});
