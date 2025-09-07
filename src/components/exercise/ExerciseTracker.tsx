import React, { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import {
  ArrowLeft,
  Plus,
  Timer,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Dumbbell,
  Heart,
  Bike,
} from '../ui/Icons';
import { colors, spacing, fontSizes, createStyles } from '../../lib/utils';

interface ExerciseTrackerProps {
  onBack: () => void;
}

interface ExerciseEntry {
  id: string;
  name: string;
  duration: number; // 분
  calories: number;
  time: string;
  type: 'cardio' | 'strength' | 'flexibility';
}

export const ExerciseTracker: React.FC<ExerciseTrackerProps> = ({ onBack }) => {
  const [exerciseEntries, setExerciseEntries] = useState<ExerciseEntry[]>([
    { id: '1', name: '런닝머신', duration: 30, calories: 350, time: '07:00', type: 'cardio' },
    { id: '2', name: '푸시업', duration: 15, calories: 75, time: '19:00', type: 'strength' },
  ]);

  const [activeTab, setActiveTab] = useState('today');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const totalCaloriesBurned = exerciseEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalDuration = exerciseEntries.reduce((sum, entry) => sum + entry.duration, 0);

  const exerciseTypes = {
    cardio: { icon: Heart, label: '유산소', color: colors.error },
    strength: { icon: Dumbbell, label: '근력', color: colors.primary },
    flexibility: { icon: RotateCcw, label: '유연성', color: colors.success },
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 타이머 효과
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((seconds) => seconds + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

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
            <Text style={styles.headerTitle}>운동 기록</Text>
            <Text style={styles.headerSubtitle}>
              오늘 {totalCaloriesBurned}kcal 소모 • {totalDuration}분 운동
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* 탭 네비게이션 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="today">오늘 기록</TabsTrigger>
            <TabsTrigger value="timer">운동 타이머</TabsTrigger>
            <TabsTrigger value="add">운동 추가</TabsTrigger>
          </TabsList>

          <TabsContent value="today">
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.tabContent}>
                {/* 오늘의 운동 통계 */}
                <Card>
                  <CardHeader>
                    <CardTitle>오늘의 운동 성과</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <View style={styles.statsGrid}>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{totalCaloriesBurned}</Text>
                        <Text style={styles.statLabel}>소모 칼로리</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{totalDuration}분</Text>
                        <Text style={styles.statLabel}>운동 시간</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{exerciseEntries.length}</Text>
                        <Text style={styles.statLabel}>운동 세션</Text>
                      </View>
                    </View>
                  </CardContent>
                </Card>

                {/* 운동 기록 목록 */}
                <Card>
                  <CardHeader>
                    <CardTitle>운동 기록</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {exerciseEntries.length > 0 ? (
                      <View style={styles.exerciseList}>
                        {exerciseEntries.map((entry) => {
                          const ExerciseIcon = exerciseTypes[entry.type].icon;
                          return (
                            <View key={entry.id} style={styles.exerciseItem}>
                              <View style={styles.exerciseItemLeft}>
                                <ExerciseIcon size={20} color={exerciseTypes[entry.type].color} />
                                <View style={styles.exerciseInfo}>
                                  <Text style={styles.exerciseName}>{entry.name}</Text>
                                  <Text style={styles.exerciseTime}>
                                    {entry.time} • {entry.duration}분
                                  </Text>
                                </View>
                              </View>
                              <View style={styles.exerciseItemRight}>
                                <Text style={styles.exerciseCalories}>{entry.calories}kcal</Text>
                                <Badge variant="outline" size="sm">
                                  {exerciseTypes[entry.type].label}
                                </Badge>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    ) : (
                      <View style={styles.emptyExercise}>
                        <Dumbbell size={48} color={colors.textSecondary} />
                        <Text style={styles.emptyExerciseText}>아직 기록된 운동이 없습니다</Text>
                        <Button
                          title="운동 기록하기"
                          onPress={() => setActiveTab('add')}
                          variant="outline"
                          size="sm"
                          icon={<Plus size={16} color={colors.primary} />}
                          style={styles.addExerciseButton}
                        />
                      </View>
                    )}
                  </CardContent>
                </Card>
              </View>
            </ScrollView>
          </TabsContent>

          <TabsContent value="timer">
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.tabContent}>
                {/* 운동 타이머 */}
                <Card>
                  <CardHeader>
                    <CardTitle style={styles.timerTitle}>운동 타이머</CardTitle>
                    <CardDescription style={styles.timerDescription}>
                      운동 시간을 측정하고 기록하세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <View style={styles.timerContainer}>
                      <Text style={styles.timerDisplay}>
                        {formatTime(timerSeconds)}
                      </Text>
                      <View style={styles.timerControls}>
                        <Button
                          title={isTimerRunning ? '일시정지' : '시작'}
                          onPress={() => setIsTimerRunning(!isTimerRunning)}
                          variant={isTimerRunning ? 'destructive' : 'primary'}
                          size="lg"
                          icon={
                            isTimerRunning ? (
                              <Pause size={20} color={colors.white} />
                            ) : (
                              <Play size={20} color={colors.white} />
                            )
                          }
                          style={styles.timerButton}
                        />
                        <Button
                          title="리셋"
                          onPress={() => {
                            setTimerSeconds(0);
                            setIsTimerRunning(false);
                          }}
                          variant="outline"
                          size="lg"
                          icon={<RotateCcw size={20} color={colors.primary} />}
                          style={styles.timerButton}
                        />
                      </View>
                    </View>

                    {timerSeconds > 0 && (
                      <View style={styles.timerForm}>
                        <View style={styles.timerFormRow}>
                          <Input
                            label="운동명"
                            placeholder="예: 런닝"
                            value=""
                            onChangeText={() => {}}
                            style={styles.timerFormInput}
                          />
                          <View style={styles.timerFormSelect}>
                            <Text style={styles.timerFormLabel}>운동 종류</Text>
                            <View style={styles.selectContainer}>
                              <Text style={styles.selectText}>유산소</Text>
                            </View>
                          </View>
                        </View>
                        <Button
                          title="운동 기록 저장"
                          onPress={() => {}}
                          icon={<Timer size={16} color={colors.white} />}
                          style={styles.saveButton}
                        />
                      </View>
                    )}
                  </CardContent>
                </Card>
              </View>
            </ScrollView>
          </TabsContent>

          <TabsContent value="add">
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.tabContent}>
                {/* 빠른 운동 추가 */}
                <Card>
                  <CardHeader>
                    <CardTitle>자주 하는 운동</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <View style={styles.quickExerciseGrid}>
                      {[
                        { name: '런닝', type: 'cardio', icon: Heart, calories: 12 },
                        { name: '사이클링', type: 'cardio', icon: Bike, calories: 8 },
                        { name: '푸시업', type: 'strength', icon: Dumbbell, calories: 5 },
                        { name: '스쿼트', type: 'strength', icon: Dumbbell, calories: 6 },
                        { name: '플랭크', type: 'strength', icon: Timer, calories: 4 },
                        { name: '요가', type: 'flexibility', icon: RotateCcw, calories: 3 },
                      ].map((exercise, index) => {
                        const IconComponent = exercise.icon;
                        return (
                          <Button
                            key={index}
                            title={exercise.name}
                            onPress={() => {}}
                            variant="outline"
                            style={styles.quickExerciseButton}
                          />
                        );
                      })}
                    </View>
                  </CardContent>
                </Card>

                {/* 직접 입력 */}
                <Card>
                  <CardHeader>
                    <CardTitle>운동 직접 입력</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <View style={styles.manualInput}>
                      <Input
                        label="운동명"
                        placeholder="예: 테니스"
                        value=""
                        onChangeText={() => {}}
                        style={styles.manualInputField}
                      />
                      <View style={styles.manualInputRow}>
                        <Input
                          label="운동 시간 (분)"
                          placeholder="30"
                          value=""
                          onChangeText={() => {}}
                          keyboardType="numeric"
                          style={styles.manualInputField}
                        />
                        <Input
                          label="소모 칼로리"
                          placeholder="300"
                          value=""
                          onChangeText={() => {}}
                          keyboardType="numeric"
                          style={styles.manualInputField}
                        />
                      </View>
                      <View style={styles.manualInputSelect}>
                        <Text style={styles.manualInputLabel}>운동 종류</Text>
                        <View style={styles.selectContainer}>
                          <Text style={styles.selectText}>유산소</Text>
                        </View>
                      </View>
                      <Button
                        title="운동 기록 추가"
                        onPress={() => {}}
                        icon={<Plus size={16} color={colors.white} />}
                        style={styles.addButton}
                      />
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSizes['2xl'],
    fontWeight: 'bold',
    color: colors.success,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  exerciseList: {
    gap: spacing.md,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  exerciseItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: fontSizes.base,
    fontWeight: '500',
    color: colors.text,
  },
  exerciseTime: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  exerciseItemRight: {
    alignItems: 'flex-end',
  },
  exerciseCalories: {
    fontSize: fontSizes.base,
    fontWeight: '500',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptyExercise: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyExerciseText: {
    fontSize: fontSizes.base,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  addExerciseButton: {
    marginTop: spacing.sm,
  },
  timerTitle: {
    textAlign: 'center',
  },
  timerDescription: {
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  timerDisplay: {
    fontSize: 60,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: colors.primary,
  },
  timerControls: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  timerButton: {
    minWidth: 120,
  },
  timerForm: {
    gap: spacing.md,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  timerFormRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  timerFormInput: {
    flex: 1,
    marginBottom: 0,
  },
  timerFormSelect: {
    flex: 1,
  },
  timerFormLabel: {
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
  quickExerciseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  quickExerciseButton: {
    flex: 1,
    minWidth: '45%',
    height: 80,
    flexDirection: 'column',
    gap: spacing.sm,
  },
  manualInput: {
    gap: spacing.md,
  },
  manualInputField: {
    marginBottom: 0,
  },
  manualInputRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  manualInputSelect: {
    marginTop: spacing.sm,
  },
  manualInputLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  addButton: {
    marginTop: spacing.sm,
  },
});
