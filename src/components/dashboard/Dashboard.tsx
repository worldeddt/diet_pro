import React, { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Progress } from '../ui/Progress';
import { Badge } from '../ui/Badge';
import {
  Activity,
  Calendar,
  Clock,
  Flame,
  History,
  Plus,
  TrendingUp,
  Trophy,
  XCircle,
} from '../ui/Icons';
import { colors, createStyles, fontSizes, spacing } from '../../lib/utils';

interface DashboardProps {
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

function LogOut(props: { size: number; color: string }) {
  return null;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onLogout,
}) => {
  const [todayCalories] = useState({
    consumed: 1250,
    target: 1800,
    burned: 350,
  });

  // 다이어트 기간 상태 (실제로는 API에서 가져올 데이터)
  const [dietStatus] = useState({
    isOnDiet: true, // 다이어트 중 여부
    startDate: '2024-01-01',
    endDate: '2024-03-01',
    currentWeight: 70,
    targetWeight: 65,
  });

  // 지난 다이어트 기록 (다이어트 중이 아닐 때 표시)
  const [pastDietRecords] = useState([
    {
      period: '2023년 9월 - 11월',
      weightLoss: '3kg',
      duration: '60일',
      success: true,
    },
    {
      period: '2023년 6월 - 7월',
      weightLoss: '1.5kg',
      duration: '30일',
      success: false,
    },
  ]);

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '로그아웃', style: 'destructive', onPress: onLogout },
    ]);
  };

  const progressPercentage =
    (todayCalories.consumed / todayCalories.target) * 100;
  const isOnTrack = progressPercentage <= 100;

  // D-Day 계산
  const getDaysRemaining = () => {
    if (!dietStatus.isOnDiet) return null;
    const today = new Date();
    const endDate = new Date(dietStatus.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleGiveUp = () => {
    // 포기 기능 구현 (실제로는 API 호출)
    console.log('다이어트 포기');
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>안녕하세요! 👋</Text>
            {dietStatus.isOnDiet ? (
              <Text style={styles.headerSubtitle}>
                목표까지 D-{getDaysRemaining()}일 남았어요!
              </Text>
            ) : (
              <Text style={styles.headerSubtitle}>
                새로운 다이어트를 시작해보세요
              </Text>
            )}
          </View>
          <View style={styles.headerActions}>
            <Button
              title=""
              onPress={() => onNavigate('profile')}
              variant="ghost"
              size="sm"
              // icon={<Settings size={20} color={colors.white} />}
              style={styles.settingsButton}
            />
            <Button
              title=""
              onPress={handleLogout}
              variant="ghost"
              size="sm"
              icon={<LogOut size={50} color={colors.black} />}
              style={styles.logoutButton}
            />
            {dietStatus.isOnDiet && (
              <Button
                title="포기"
                onPress={handleGiveUp}
                variant="destructive"
                size="sm"
                icon={<XCircle size={16} color={colors.white} />}
                style={styles.giveUpButton}
              />
            )}
          </View>
        </View>

        {/* 오늘의 칼로리 요약 - 다이어트 중일 때만 표시 */}
        {dietStatus.isOnDiet && (
          <Card style={styles.calorieCard}>
            <CardContent style={styles.calorieContent}>
              <View style={styles.calorieHeader}>
                <Text style={styles.calorieTitle}>오늘의 칼로리</Text>
                <Badge variant={isOnTrack ? 'secondary' : 'destructive'}>
                  {isOnTrack ? '목표 달성 중!' : '목표 초과'}
                </Badge>
              </View>
              <View style={styles.calorieStats}>
                <View style={styles.calorieRow}>
                  <Text style={styles.calorieText}>
                    섭취: {todayCalories.consumed}kcal
                  </Text>
                  <Text style={styles.calorieText}>
                    목표: {todayCalories.target}kcal
                  </Text>
                </View>
                <Progress
                  value={progressPercentage}
                  style={styles.progressBar}
                />
                <View style={styles.calorieFooter}>
                  <Text style={styles.calorieFooterText}>
                    남은 칼로리: {todayCalories.target - todayCalories.consumed}
                    kcal
                  </Text>
                  <View style={styles.burnedCalories}>
                    <Flame size={12} color={colors.textSecondary} />
                    <Text style={styles.calorieFooterText}>
                      소모: {todayCalories.burned}kcal
                    </Text>
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>
        )}

        {/* 지난 다이어트 기록 - 다이어트 중이 아닐 때 표시 */}
        {!dietStatus.isOnDiet && (
          <Card style={styles.calorieCard}>
            <CardContent style={styles.calorieContent}>
              <View style={styles.historyHeader}>
                <History size={20} color={colors.text} />
                <Text style={styles.historyTitle}>지난 다이어트 기록</Text>
              </View>
              <View style={styles.historyList}>
                {pastDietRecords.map((record, index) => (
                  <View key={index} style={styles.historyItem}>
                    <View style={styles.historyItemLeft}>
                      <Text style={styles.historyPeriod}>{record.period}</Text>
                      <Text style={styles.historyDuration}>
                        {record.duration} 동안
                      </Text>
                    </View>
                    <View style={styles.historyItemRight}>
                      <Text style={styles.historyWeight}>
                        {record.weightLoss}
                      </Text>
                      <Badge
                        variant={record.success ? 'secondary' : 'outline'}
                        size="sm"
                      >
                        {record.success ? '성공' : '중단'}
                      </Badge>
                    </View>
                  </View>
                ))}
              </View>
              <Button
                title="새 다이어트 계획 만들기"
                onPress={() => onNavigate('plan')}
                variant="primary"
                size="lg"
                icon={<Plus size={20} color={colors.white} />}
                style={styles.createPlanButton}
              />
            </CardContent>
          </Card>
        )}
      </View>

      {/* 메인 컨텐츠 */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentPadding}>
          {/* 빠른 액션 버튼들 */}
          <View style={styles.actionButtons}>
            <Button
              title="음식 기록"
              onPress={() => onNavigate('food')}
              variant="outline"
              size="lg"
              icon={<Plus size={24} color={colors.primary} />}
              style={styles.actionButton}
            />
            <Button
              title="체성분 기록"
              onPress={() => onNavigate('milestone')}
              variant="outline"
              size="lg"
              icon={<Activity size={24} color={colors.primary} />}
              style={styles.actionButton}
            />
          </View>

          {/* 주간 통계 */}
          <Card>
            <CardHeader>
              <CardTitle style={styles.cardTitleWithIcon}>
                <TrendingUp size={20} color={colors.primary} />
                <Text style={styles.cardTitleText}>이번 주 성과</Text>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <View style={styles.weeklyStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>5</Text>
                  <Text style={styles.statLabel}>목표 달성일</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>-1.2kg</Text>
                  <Text style={styles.statLabel}>체중 변화</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>2,450</Text>
                  <Text style={styles.statLabel}>평균 칼로리</Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* 오늘의 식단 미리보기 */}
          <Card>
            <CardHeader>
              <View style={styles.mealHeader}>
                <View style={styles.cardTitleWithIcon}>
                  <Calendar size={20} color={colors.primary} />
                  <Text style={styles.cardTitleText}>오늘의 식단</Text>
                </View>
                <Button
                  title="전체보기"
                  onPress={() => onNavigate('food')}
                  variant="ghost"
                  size="sm"
                />
              </View>
            </CardHeader>
            <CardContent>
              <View style={styles.mealList}>
                <View style={styles.mealItem}>
                  <View style={styles.mealItemLeft}>
                    <View
                      style={[
                        styles.mealDot,
                        { backgroundColor: colors.success },
                      ]}
                    />
                    <View>
                      <Text style={styles.mealName}>아침식사</Text>
                      <Text style={styles.mealDescription}>오트밀, 바나나</Text>
                    </View>
                  </View>
                  <Text style={styles.mealCalories}>320kcal</Text>
                </View>
                <View style={styles.mealItem}>
                  <View style={styles.mealItemLeft}>
                    <View
                      style={[
                        styles.mealDot,
                        { backgroundColor: colors.warning },
                      ]}
                    />
                    <View>
                      <Text style={styles.mealName}>점심식사</Text>
                      <Text style={styles.mealDescription}>
                        샐러드, 닭가슴살
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.mealCalories}>450kcal</Text>
                </View>
                <Button
                  title="저녁식사 추가하기"
                  onPress={() => onNavigate('food')}
                  variant="outline"
                  icon={<Plus size={16} color={colors.primary} />}
                  style={styles.addMealButton}
                />
              </View>
            </CardContent>
          </Card>

          {/* 도전과제 */}
          <Card>
            <CardHeader>
              <CardTitle style={styles.cardTitleWithIcon}>
                <Trophy size={20} color={colors.primary} />
                <Text style={styles.cardTitleText}>오늘의 도전</Text>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <View style={styles.challengeList}>
                <View
                  style={[
                    styles.challengeItem,
                    { backgroundColor: colors.success },
                  ]}
                >
                  <View style={styles.challengeItemLeft}>
                    <Clock size={16} color={colors.white} />
                    <Text style={styles.challengeText}>물 8잔 마시기</Text>
                  </View>
                  <Badge variant="secondary">6/8</Badge>
                </View>
                <View style={styles.challengeItem}>
                  <View style={styles.challengeItemLeft}>
                    <Activity size={16} color={colors.text} />
                    <Text style={styles.challengeText}>10,000보 걷기</Text>
                  </View>
                  <Badge variant="outline">7,234/10,000</Badge>
                </View>
              </View>
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
    paddingBottom: spacing.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: fontSizes['2xl'],
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSizes.base,
    color: colors.white,
    opacity: 0.8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  giveUpButton: {
    marginRight: spacing.sm,
  },
  settingsButton: {
    width: 40,
    height: 40,
  },
  logoutButton: {
    width: 40,
    height: 40,
  },
  createPlanButton: {
    marginTop: spacing.lg,
  },
  calorieCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 0,
    marginTop: -spacing.lg,
  },
  calorieContent: {
    padding: spacing.lg,
  },
  calorieHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  calorieTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.text,
  },
  calorieStats: {
    gap: spacing.md,
  },
  calorieRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calorieText: {
    fontSize: fontSizes.sm,
    color: colors.text,
  },
  progressBar: {
    height: 12,
  },
  calorieFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calorieFooterText: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  burnedCalories: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  historyTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.text,
  },
  historyList: {
    gap: spacing.md,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  historyItemLeft: {
    flex: 1,
  },
  historyPeriod: {
    fontSize: fontSizes.base,
    fontWeight: '500',
    color: colors.text,
  },
  historyDuration: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  historyItemRight: {
    alignItems: 'flex-end',
  },
  historyWeight: {
    fontSize: fontSizes.base,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  actionButton: {
    flex: 1,
    height: 80,
    flexDirection: 'column',
    gap: spacing.sm,
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
  weeklyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSizes['2xl'],
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealList: {
    gap: spacing.md,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  mealItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  mealDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  mealName: {
    fontSize: fontSizes.base,
    fontWeight: '500',
    color: colors.text,
  },
  mealDescription: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  mealCalories: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    color: colors.text,
  },
  addMealButton: {
    marginTop: spacing.sm,
  },
  challengeList: {
    gap: spacing.md,
  },
  challengeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  challengeItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  challengeText: {
    fontSize: fontSizes.base,
    fontWeight: '500',
    color: colors.text,
  },
});
