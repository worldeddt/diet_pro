import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet, Alert,
} from 'react-native';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import {
  ArrowLeft,
  Plus,
  Search,
  Camera,
  Coffee,
  UtensilsCrossed,
  Moon,
} from '../ui/Icons';
import { colors, spacing, fontSizes, createStyles } from '../../lib/utils';
import axios from "axios";

interface FoodTrackerProps {
  onBack: () => void;
}

type MealLogPostProps = {
   planId : number,
   mealName : string,
   calories : number,
   mealType : string, // breakfast, lunch, dinner, snack
   data : string,
   mealImages : MealImageProps[]
}

interface MealImageProps {
  imageUrl : string
}

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  time: string;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export const FoodTracker: React.FC<FoodTrackerProps> = ({ onBack }) => {
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([
    { id: '1', name: '오트밀', calories: 150, time: '08:00', meal: 'breakfast' },
    { id: '2', name: '바나나', calories: 105, time: '08:05', meal: 'breakfast' },
    { id: '3', name: '닭가슴살 샐러드', calories: 350, time: '12:30', meal: 'lunch' },
    { id: '4', name: '요거트', calories: 100, time: '15:00', meal: 'snack' },
  ]);

  console.log('rendered')

  const [addFoodName, setAddFoodName] = useState<string>("");
  const [addFoodCalorie, setAddFoodCalorie] = useState<number>(0)
  const [foodImageUrl, setFoodImageUrl] = useState<string>("")

  const [activeTab, setActiveTab] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');

  const mealIcons = {
    breakfast: Coffee,
    lunch: UtensilsCrossed,
    dinner: Moon,
    snack: Plus,
  };

  const mealNames = {
    breakfast: '아침',
    lunch: '점심',
    dinner: '저녁',
    snack: '간식',
  };

  const totalCalories = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);

  const groupedEntries = foodEntries.reduce((groups, entry) => {
    if (!groups[entry.meal]) {
      groups[entry.meal] = [];
    }
    groups[entry.meal].push(entry);
    return groups;
  }, {} as Record<string, FoodEntry[]>);

  const mealLogPost = () => {

    if (!addFoodCalorie) {
      Alert.alert('오류', '음식 이름을 입력해 주세요.');
      return;
    }

    if (!addFoodCalorie) {
      Alert.alert('오류', '음식 칼로리를 입력해 주세요.');
      return;
    }

    axios.post(`http://localhost:8082/api/meal-logs`, {
      planId : 1,
      mealName : addFoodName,
      calories : addFoodCalorie,
      mealImages : {
        imageUrl : foodImageUrl
      }
    })
      .catch(e => {
        console.error(e)
      })
      .then(response => {
        console.log(response)
      })
  }

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
            <Text style={styles.headerTitle}>음식 기록</Text>
            <Text style={styles.headerSubtitle}>
              오늘 총 {totalCalories}kcal 섭취
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* 탭 네비게이션 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="today">오늘 기록</TabsTrigger>
            <TabsTrigger value="add">음식 추가</TabsTrigger>
          </TabsList>

          <TabsContent value="today">
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.tabContent}>
                {/* 식사별 그룹 */}
                {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(
                  meal => {
                    const entries = groupedEntries[meal] || [];
                    const mealCalories = entries.reduce(
                      (sum, entry) => sum + entry.calories,
                      0,
                    );
                    const IconComponent = mealIcons[meal];

                    return (
                      <Card key={meal} style={styles.mealCard}>
                        <CardHeader style={styles.mealCardHeader}>
                          <View style={styles.mealHeader}>
                            <View style={styles.mealHeaderLeft}>
                              <IconComponent size={20} color={colors.primary} />
                              <Text style={styles.mealTitle}>
                                {mealNames[meal]}
                              </Text>
                            </View>
                            <Badge variant="secondary">
                              {mealCalories}kcal
                            </Badge>
                          </View>
                        </CardHeader>
                        <CardContent>
                          {entries.length > 0 ? (
                            <View style={styles.mealEntries}>
                              {entries.map(entry => (
                                <View key={entry.id} style={styles.mealEntry}>
                                  <View style={styles.mealEntryLeft}>
                                    <Text style={styles.mealEntryName}>
                                      {entry.name}
                                    </Text>
                                    <Text style={styles.mealEntryTime}>
                                      {entry.time}
                                    </Text>
                                  </View>
                                  <Text style={styles.mealEntryCalories}>
                                    {entry.calories}kcal
                                  </Text>
                                </View>
                              ))}
                            </View>
                          ) : (
                            <View style={styles.emptyMeal}>
                              <Text style={styles.emptyMealText}>
                                아직 기록된 음식이 없습니다
                              </Text>
                              <Button
                                title="추가하기"
                                onPress={() => setActiveTab('add')}
                                variant="outline"
                                size="sm"
                                icon={<Plus size={16} color={colors.primary} />}
                                style={styles.addMealButton}
                              />
                            </View>
                          )}
                        </CardContent>
                      </Card>
                    );
                  },
                )}
              </View>
            </ScrollView>
          </TabsContent>

          <TabsContent value="add">
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.tabContent}>
                {/* 검색 섹션 */}
                <Card>
                  <CardHeader>
                    <CardTitle>음식 검색</CardTitle>
                    <CardDescription>
                      음식명을 검색하거나 직접 입력하세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="음식명 검색..."
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      leftIcon={
                        <Search size={16} color={colors.textSecondary} />
                      }
                      style={styles.searchInput}
                    />

                    <Button
                      title="사진으로 음식 인식하기"
                      onPress={() => {}}
                      variant="outline"
                      icon={<Camera size={16} color={colors.primary} />}
                      style={styles.cameraButton}
                    />
                  </CardContent>
                </Card>

                {/* 빠른 추가 */}
                <Card>
                  <CardHeader>
                    <CardTitle>자주 먹는 음식</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <View style={styles.quickFoodGrid}>
                      {[
                        { name: '현미밥', calories: 150 },
                        { name: '닭가슴살', calories: 200 },
                        { name: '브로콜리', calories: 55 },
                        { name: '계란', calories: 78 },
                        { name: '아보카도', calories: 234 },
                        { name: '그릭요거트', calories: 130 },
                      ].map((food, index) => (
                        <Button
                          key={index}
                          title={food.name}
                          onPress={() => {}}
                          variant="outline"
                          style={styles.quickFoodButton}
                        />
                      ))}
                    </View>
                  </CardContent>
                </Card>

                {/* 직접 입력 */}
                <Card>
                  <CardHeader>
                    <CardTitle>직접 입력</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <View style={styles.manualInput}>
                      <Input
                        label="음식명"
                        placeholder="예: 김치찌개"
                        value=""
                        onChangeText={e => {
                          setAddFoodName(e);
                        }}
                        style={styles.manualInputField}
                      />
                      <Input
                        label="칼로리"
                        placeholder="300"
                        value=""
                        onChangeText={e => {
                          setAddFoodCalorie(e);
                        }}
                        keyboardType="numeric"
                        style={styles.manualInputField}
                      />
                      <Button
                        title="기록 추가"
                        onPress={() => {
                          mealLogPost();
                        }}
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
  mealCard: {
    marginBottom: spacing.md,
  },
  mealCardHeader: {
    paddingBottom: spacing.sm,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  mealTitle: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.text,
  },
  mealEntries: {
    gap: spacing.sm,
  },
  mealEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  mealEntryLeft: {
    flex: 1,
  },
  mealEntryName: {
    fontSize: fontSizes.base,
    fontWeight: '500',
    color: colors.text,
  },
  mealEntryTime: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  mealEntryCalories: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
    color: colors.text,
  },
  emptyMeal: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  emptyMealText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  addMealButton: {
    marginTop: spacing.sm,
  },
  searchInput: {
    marginBottom: spacing.md,
  },
  cameraButton: {
    marginTop: spacing.sm,
  },
  quickFoodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  quickFoodButton: {
    flex: 1,
    minWidth: '45%',
    height: 60,
    flexDirection: 'column',
    gap: spacing.xs,
  },
  manualInput: {
    gap: spacing.md,
  },
  manualInputField: {
    marginBottom: 0,
  },
  addButton: {
    marginTop: spacing.sm,
  },
});
