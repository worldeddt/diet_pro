import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import {
  ArrowLeft,
  User,
  Target,
  Calendar,
  Scale,
  Activity,
  TrendingDown,
  Edit,
} from '../ui/Icons';
import { colors, spacing, fontSizes, createStyles } from '../../lib/utils';

interface ProfileSettingsProps {
  onBack: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onBack }) => {
  const [userProfile, setUserProfile] = useState({
    name: '김건강',
    age: 28,
    height: 170,
    currentWeight: 70,
    targetWeight: 65,
    targetCalories: 1800,
    activityLevel: 'moderate',
    startDate: '2024-01-01',
  });

  const [bodyRecords, setBodyRecords] = useState([
    { date: '2024-01-01', weight: 72, bodyFat: 22, muscle: 32 },
    { date: '2024-01-15', weight: 71, bodyFat: 21, muscle: 32.5 },
    { date: '2024-02-01', weight: 70, bodyFat: 20, muscle: 33 },
  ]);

  const weightProgress = ((userProfile.currentWeight - userProfile.targetWeight) / (72 - userProfile.targetWeight)) * 100;
  const daysInDiet = Math.floor((new Date().getTime() - new Date(userProfile.startDate).getTime()) / (1000 * 3600 * 24));

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
            <Text style={styles.headerTitle}>프로필 & 설정</Text>
            <Text style={styles.headerSubtitle}>
              다이어트 {daysInDiet}일차
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* 탭 네비게이션 */}
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">프로필</TabsTrigger>
            <TabsTrigger value="goals">목표 설정</TabsTrigger>
            <TabsTrigger value="records">체성분 기록</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.tabContent}>
                {/* 기본 정보 */}
                <Card>
                  <CardHeader>
                    <CardTitle style={styles.cardTitleWithIcon}>
                      <User size={20} color={colors.primary} />
                      <Text style={styles.cardTitleText}>기본 정보</Text>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <View style={styles.profileForm}>
                      <View style={styles.profileFormRow}>
                        <Input
                          label="이름"
                          value={userProfile.name}
                          onChangeText={(text) => setUserProfile({ ...userProfile, name: text })}
                          style={styles.profileInput}
                        />
                        <Input
                          label="나이"
                          value={userProfile.age.toString()}
                          onChangeText={(text) => setUserProfile({ ...userProfile, age: Number(text) })}
                          keyboardType="numeric"
                          style={styles.profileInput}
                        />
                      </View>
                      <View style={styles.profileFormRow}>
                        <Input
                          label="신장 (cm)"
                          value={userProfile.height.toString()}
                          onChangeText={(text) => setUserProfile({ ...userProfile, height: Number(text) })}
                          keyboardType="numeric"
                          style={styles.profileInput}
                        />
                        <View style={styles.activitySelect}>
                          <Text style={styles.activityLabel}>활동 수준</Text>
                          <View style={styles.selectContainer}>
                            <Text style={styles.selectText}>
                              {userProfile.activityLevel === 'low' && '낮음 (주 1-2회 운동)'}
                              {userProfile.activityLevel === 'moderate' && '보통 (주 3-4회 운동)'}
                              {userProfile.activityLevel === 'high' && '높음 (주 5-6회 운동)'}
                              {userProfile.activityLevel === 'very-high' && '매우 높음 (매일 운동)'}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <Button
                        title="프로필 저장"
                        onPress={() => {}}
                        style={styles.saveButton}
                      />
                    </View>
                  </CardContent>
                </Card>

                {/* 현재 진행 상황 */}
                <Card>
                  <CardHeader>
                    <CardTitle style={styles.cardTitleWithIcon}>
                      <TrendingDown size={20} color={colors.primary} />
                      <Text style={styles.cardTitleText}>다이어트 진행 상황</Text>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <View style={styles.progressStats}>
                      <View style={styles.progressStatItem}>
                        <Text style={styles.progressStatValue}>{userProfile.currentWeight}kg</Text>
                        <Text style={styles.progressStatLabel}>현재 체중</Text>
                      </View>
                      <View style={styles.progressStatItem}>
                        <Text style={styles.progressStatValue}>{userProfile.targetWeight}kg</Text>
                        <Text style={styles.progressStatLabel}>목표 체중</Text>
                      </View>
                      <View style={styles.progressStatItem}>
                        <Text style={styles.progressStatValue}>-{72 - userProfile.currentWeight}kg</Text>
                        <Text style={styles.progressStatLabel}>감량한 체중</Text>
                      </View>
                    </View>
                    <View style={styles.progressBar}>
                      <View style={styles.progressBarHeader}>
                        <Text style={styles.progressBarText}>목표까지</Text>
                        <Text style={styles.progressBarText}>
                          {userProfile.currentWeight - userProfile.targetWeight}kg 남음
                        </Text>
                      </View>
                      <Progress value={100 - weightProgress} style={styles.progressBarFill} />
                    </View>
                  </CardContent>
                </Card>
              </View>
            </ScrollView>
          </TabsContent>

          <TabsContent value="goals">
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.tabContent}>
                {/* 목표 설정 */}
                <Card>
                  <CardHeader>
                    <CardTitle style={styles.cardTitleWithIcon}>
                      <Target size={20} color={colors.primary} />
                      <Text style={styles.cardTitleText}>다이어트 목표</Text>
                    </CardTitle>
                    <CardDescription>
                      개인 맞춤 목표를 설정하세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <View style={styles.goalsForm}>
                      <View style={styles.goalsFormRow}>
                        <Input
                          label="목표 체중 (kg)"
                          value={userProfile.targetWeight.toString()}
                          onChangeText={(text) => setUserProfile({ ...userProfile, targetWeight: Number(text) })}
                          keyboardType="numeric"
                          style={styles.goalsInput}
                        />
                        <Input
                          label="일일 목표 칼로리"
                          value={userProfile.targetCalories.toString()}
                          onChangeText={(text) => setUserProfile({ ...userProfile, targetCalories: Number(text) })}
                          keyboardType="numeric"
                          style={styles.goalsInput}
                        />
                      </View>
                      <View style={styles.dietPeriodSelect}>
                        <Text style={styles.dietPeriodLabel}>다이어트 기간</Text>
                        <View style={styles.selectContainer}>
                          <Text style={styles.selectText}>3개월</Text>
                        </View>
                      </View>
                      <Button
                        title="목표 저장"
                        onPress={() => {}}
                        style={styles.saveButton}
                      />
                    </View>
                  </CardContent>
                </Card>

                {/* 권장 칼로리 */}
                <Card>
                  <CardHeader>
                    <CardTitle>권장 칼로리</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <View style={styles.recommendedCalories}>
                      <View style={styles.recommendedCalorieItem}>
                        <Text style={styles.recommendedCalorieValue}>1,650</Text>
                        <Text style={styles.recommendedCalorieLabel}>기초 대사량</Text>
                      </View>
                      <View style={styles.recommendedCalorieItem}>
                        <Text style={styles.recommendedCalorieValue}>1,800</Text>
                        <Text style={styles.recommendedCalorieLabel}>권장 섭취량</Text>
                      </View>
                    </View>
                    <Text style={styles.recommendedCalorieNote}>
                      현재 활동 수준과 목표를 바탕으로 계산된 값입니다
                    </Text>
                  </CardContent>
                </Card>
              </View>
            </ScrollView>
          </TabsContent>

          <TabsContent value="records">
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.tabContent}>
                {/* 새 기록 추가 */}
                <Card>
                  <CardHeader>
                    <CardTitle style={styles.cardTitleWithIcon}>
                      <Scale size={20} color={colors.primary} />
                      <Text style={styles.cardTitleText}>새 체성분 기록</Text>
                    </CardTitle>
                    <CardDescription>
                      체중, 체지방률, 근육량을 기록하세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <View style={styles.recordForm}>
                      <View style={styles.recordFormRow}>
                        <Input
                          label="체중 (kg)"
                          placeholder="70.0"
                          value=""
                          onChangeText={() => {}}
                          keyboardType="numeric"
                          style={styles.recordInput}
                        />
                        <Input
                          label="체지방률 (%)"
                          placeholder="20.0"
                          value=""
                          onChangeText={() => {}}
                          keyboardType="numeric"
                          style={styles.recordInput}
                        />
                        <Input
                          label="근육량 (kg)"
                          placeholder="33.0"
                          value=""
                          onChangeText={() => {}}
                          keyboardType="numeric"
                          style={styles.recordInput}
                        />
                      </View>
                      <Button
                        title="기록 추가"
                        onPress={() => {}}
                        icon={<Edit size={16} color={colors.white} />}
                        style={styles.addRecordButton}
                      />
                    </View>
                  </CardContent>
                </Card>

                {/* 기록 히스토리 */}
                <Card>
                  <CardHeader>
                    <CardTitle style={styles.cardTitleWithIcon}>
                      <Calendar size={20} color={colors.primary} />
                      <Text style={styles.cardTitleText}>기록 히스토리</Text>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <View style={styles.recordHistory}>
                      {bodyRecords.map((record, index) => (
                        <View key={index} style={styles.recordHistoryItem}>
                          <View style={styles.recordHistoryLeft}>
                            <Text style={styles.recordHistoryDate}>{record.date}</Text>
                            <Text style={styles.recordHistoryDay}>
                              {daysInDiet - index * 15}일차
                            </Text>
                          </View>
                          <View style={styles.recordHistoryRight}>
                            <View style={styles.recordHistoryStats}>
                              <View style={styles.recordHistoryStat}>
                                <Text style={styles.recordHistoryStatValue}>{record.weight}kg</Text>
                                <Text style={styles.recordHistoryStatLabel}>체중</Text>
                              </View>
                              <View style={styles.recordHistoryStat}>
                                <Text style={styles.recordHistoryStatValue}>{record.bodyFat}%</Text>
                                <Text style={styles.recordHistoryStatLabel}>체지방</Text>
                              </View>
                              <View style={styles.recordHistoryStat}>
                                <Text style={styles.recordHistoryStatValue}>{record.muscle}kg</Text>
                                <Text style={styles.recordHistoryStatLabel}>근육량</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  </CardContent>
                </Card>

                {/* 변화 그래프 요약 */}
                <Card>
                  <CardHeader>
                    <CardTitle>변화 요약</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <View style={styles.changeSummary}>
                      <View style={styles.changeSummaryItem}>
                        <Text style={styles.changeSummaryValue}>-2kg</Text>
                        <Text style={styles.changeSummaryLabel}>체중 변화</Text>
                      </View>
                      <View style={styles.changeSummaryItem}>
                        <Text style={styles.changeSummaryValue}>-2%</Text>
                        <Text style={styles.changeSummaryLabel}>체지방률 변화</Text>
                      </View>
                      <View style={styles.changeSummaryItem}>
                        <Text style={styles.changeSummaryValue}>+1kg</Text>
                        <Text style={styles.changeSummaryLabel}>근육량 변화</Text>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              </View>
            </ScrollView>
          </TabsContent>
        </Tabs>
      </View>
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
    padding: spacing.lg,
  },
  tabContent: {
    gap: spacing.lg,
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
  profileForm: {
    gap: spacing.md,
  },
  profileFormRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  profileInput: {
    flex: 1,
    marginBottom: 0,
  },
  activitySelect: {
    flex: 1,
  },
  activityLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  selectContainer: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  selectText: {
    fontSize: fontSizes.base,
    color: colors.text,
  },
  saveButton: {
    marginTop: spacing.sm,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  progressStatItem: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: fontSizes['2xl'],
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  progressStatLabel: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  progressBar: {
    gap: spacing.sm,
  },
  progressBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressBarText: {
    fontSize: fontSizes.sm,
    color: colors.text,
  },
  progressBarFill: {
    height: 8,
  },
  goalsForm: {
    gap: spacing.md,
  },
  goalsFormRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  goalsInput: {
    flex: 1,
    marginBottom: 0,
  },
  dietPeriodSelect: {
    marginTop: spacing.sm,
  },
  dietPeriodLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  recommendedCalories: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  recommendedCalorieItem: {
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  recommendedCalorieValue: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  recommendedCalorieLabel: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  recommendedCalorieNote: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  recordForm: {
    gap: spacing.md,
  },
  recordFormRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  recordInput: {
    flex: 1,
    marginBottom: 0,
  },
  addRecordButton: {
    marginTop: spacing.sm,
  },
  recordHistory: {
    gap: spacing.md,
  },
  recordHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  recordHistoryLeft: {
    flex: 1,
  },
  recordHistoryDate: {
    fontSize: fontSizes.base,
    fontWeight: '500',
    color: colors.text,
  },
  recordHistoryDay: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  recordHistoryRight: {
    flex: 1,
  },
  recordHistoryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  recordHistoryStat: {
    alignItems: 'center',
  },
  recordHistoryStatValue: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    color: colors.text,
  },
  recordHistoryStatLabel: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  changeSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  changeSummaryItem: {
    alignItems: 'center',
  },
  changeSummaryValue: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  changeSummaryLabel: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
});
