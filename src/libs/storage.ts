import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { format } from 'date-fns';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface PlantProps {
    id: string;
    name: string;
    about: string;
    water_tips: string;
    photo: string;
    environments: [string];
    frequency: {
      times: number;
      repeat_every: string;
    };
    hour: string;
    dateTimeNotification: Date;
}

export interface StoragePlantProps {
    [id: string]: {
        data: PlantProps;
        notificationId: string;
    }
}

export async function savePlant(plant: PlantProps) : Promise<void> {
    try {
        const permission = await Notifications.requestPermissionsAsync({
            ios: {
              allowAlert: true,
              allowBadge: true,
              allowSound: true,
            },
        });

        const isGranted =
            (permission as any).granted === true ||
            (permission as any).status === 'granted';

        if (!isGranted) {
            throw new Error('Permissão de notificações negada.');
        }

        const now = new Date();
        const nextTime = new Date(plant.dateTimeNotification);

        if (nextTime <= now) {
            nextTime.setDate(nextTime.getDate() + 1);
        }

        const repeatEvery = plant.frequency?.repeat_every ?? 'day';
        const trigger: any = {
            hour: nextTime.getHours(),
            minute: nextTime.getMinutes(),
            repeats: true,
        };

        if (repeatEvery === 'week') {
            trigger.weekday = nextTime.getDay() === 0 ? 7 : nextTime.getDay();
        }

        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Heeey, ',
                body: `Está na hora de cuidar da sua ${plant.name}`,
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
                data: {
                    plant,
                },
            },
            trigger,
        });

        const data = await AsyncStorage.getItem('@plantmanager:plants');
        const oldPlants = data ? (JSON.parse(data) as StoragePlantProps) : {};

        const newPlant = {
            [plant.id]: {
                data: plant,
                notificationId,
            },
        };

        await AsyncStorage.setItem(
            '@plantmanager:plants',
            JSON.stringify({
                ...newPlant,
                ...oldPlants,
            })
        );
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}

export async function loadPlant() : Promise<PlantProps[]> {
    try {
        const data = await AsyncStorage.getItem('@plantmanager:plants');
        const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

        const plantsSorted = Object
        .keys(plants)
        .map((plant) => ({
            ...plants[plant].data,
            hour: format(new Date(plants[plant].data.dateTimeNotification), 'HH:mm'),
        }))
        .sort((a, b) =>
            new Date(a.dateTimeNotification).getTime() -
            new Date(b.dateTimeNotification).getTime()
        );

        return plantsSorted;

    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}

export async function removePlant(id: string): Promise<void> {
    const data = await AsyncStorage.getItem('@plantmanager:plants');
    const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

    await Notifications.cancelScheduledNotificationAsync(plants[id].notificationId);
    delete plants[id];

    await AsyncStorage.setItem(
        '@plantmanager:plants',
        JSON.stringify(plants)
    );
}

// Memory Game Storage
export interface MemoryGameResult {
    id: string;
    level: 'easy' | 'medium' | 'hard';
    score: number;
    moves: number;
    time: number;
    stars: number;
    date: Date;
    // New detailed metrics for Alzheimer monitoring
    averageTimePerMove: number;
    mistakes: number;
    accuracy: number;
    completionRate: number;
    cognitiveLoad: 'low' | 'medium' | 'high';
    sessionDuration: number;
    hintsUsed?: number;
    frustrationLevel?: 'none' | 'low' | 'medium' | 'high';
    improvementScore: number;
}

export interface MemoryGameStats {
    totalGames: number;
    totalScore: number;
    bestScore: number;
    averageTime: number;
    levelStats: {
        easy: { games: number; bestScore: number; averageTime: number };
        medium: { games: number; bestScore: number; averageTime: number };
        hard: { games: number; bestScore: number; averageTime: number };
    };
    // Enhanced metrics for patient monitoring
    cognitiveMetrics: {
        averageAccuracy: number;
        averageMistakes: number;
        averageTimePerMove: number;
        cognitiveLoadDistribution: {
            low: number;
            medium: number;
            high: number;
        };
        frustrationTrend: 'improving' | 'stable' | 'declining';
        improvementTrend: 'improving' | 'stable' | 'declining';
        consistencyScore: number;
        engagementLevel: 'low' | 'medium' | 'high';
    };
    weeklyProgress: {
        week: string;
        gamesPlayed: number;
        averageScore: number;
        averageAccuracy: number;
        improvementRate: number;
    }[];
}

export async function saveMemoryGameResult(result: Omit<MemoryGameResult, 'id' | 'date'>): Promise<void> {
    try {
        const gameResult: MemoryGameResult = {
            ...result,
            id: Date.now().toString(),
            date: new Date(),
        };

        const data = await AsyncStorage.getItem('@memorygame:results');
        const results = data ? (JSON.parse(data) as MemoryGameResult[]) : [];

        results.push(gameResult);

        // Keep only last 50 results
        if (results.length > 50) {
            results.splice(0, results.length - 50);
        }

        await AsyncStorage.setItem('@memorygame:results', JSON.stringify(results));
    } catch (error) {
        throw new Error(error as string);
    }
}

export async function loadMemoryGameResults(): Promise<MemoryGameResult[]> {
    try {
        const data = await AsyncStorage.getItem('@memorygame:results');
        const results = data ? (JSON.parse(data) as MemoryGameResult[]) : [];

        return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
        throw new Error(error as string);
    }
}

export async function getMemoryGameStats(): Promise<MemoryGameStats> {
    try {
        const results = await loadMemoryGameResults();

        if (results.length === 0) {
            return {
                totalGames: 0,
                totalScore: 0,
                bestScore: 0,
                averageTime: 0,
                levelStats: {
                    easy: { games: 0, bestScore: 0, averageTime: 0 },
                    medium: { games: 0, bestScore: 0, averageTime: 0 },
                    hard: { games: 0, bestScore: 0, averageTime: 0 },
                },
                cognitiveMetrics: {
                    averageAccuracy: 0,
                    averageMistakes: 0,
                    averageTimePerMove: 0,
                    cognitiveLoadDistribution: {
                        low: 0,
                        medium: 0,
                        high: 0,
                    },
                    frustrationTrend: 'stable',
                    improvementTrend: 'stable',
                    consistencyScore: 0,
                    engagementLevel: 'low',
                },
                weeklyProgress: [],
            };
        }

        const totalGames = results.length;
        const totalScore = results.reduce((sum, game) => sum + game.score, 0);
        const bestScore = Math.max(...results.map(game => game.score));
        const averageTime = results.reduce((sum, game) => sum + game.time, 0) / totalGames;

        const levelStats = {
            easy: { games: 0, bestScore: 0, averageTime: 0 },
            medium: { games: 0, bestScore: 0, averageTime: 0 },
            hard: { games: 0, bestScore: 0, averageTime: 0 },
        };

        results.forEach(game => {
            levelStats[game.level].games++;
            levelStats[game.level].bestScore = Math.max(levelStats[game.level].bestScore, game.score);
        });

        Object.keys(levelStats).forEach(level => {
            const levelResults = results.filter(game => game.level === level);
            if (levelResults.length > 0) {
                levelStats[level as keyof typeof levelStats].averageTime =
                    levelResults.reduce((sum, game) => sum + game.time, 0) / levelResults.length;
            }
        });

        // Calculate cognitive metrics
        const cognitiveMetrics = {
            averageAccuracy: results.reduce((sum, game) => sum + game.accuracy, 0) / totalGames,
            averageMistakes: results.reduce((sum, game) => sum + game.mistakes, 0) / totalGames,
            averageTimePerMove: results.reduce((sum, game) => sum + game.averageTimePerMove, 0) / totalGames,
            cognitiveLoadDistribution: {
                low: results.filter(game => game.cognitiveLoad === 'low').length,
                medium: results.filter(game => game.cognitiveLoad === 'medium').length,
                high: results.filter(game => game.cognitiveLoad === 'high').length,
            },
            frustrationTrend: 'stable' as const,
            improvementTrend: 'stable' as const,
            consistencyScore: calculateConsistencyScore(results),
            engagementLevel: 'medium' as const,
        };

        // Calculate weekly progress
        const weeklyProgress = calculateWeeklyProgress(results);

        return {
            totalGames,
            totalScore,
            bestScore,
            averageTime,
            levelStats,
            cognitiveMetrics,
            weeklyProgress,
        };
    } catch (error) {
        throw new Error(error as string);
    }
}

function calculateConsistencyScore(results: MemoryGameResult[]): number {
    if (results.length < 2) return 0;
    
    const recentResults = results.slice(0, 10);
    const scores = recentResults.map(r => r.score);
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Consistency score: higher score means more consistent performance
    return Math.max(0, 100 - (standardDeviation / average) * 100);
}

function calculateWeeklyProgress(results: MemoryGameResult[]): {
    week: string;
    gamesPlayed: number;
    averageScore: number;
    averageAccuracy: number;
    improvementRate: number;
}[] {
    const weeklyData: { [key: string]: MemoryGameResult[] } = {};
    
    results.forEach(result => {
        const date = new Date(result.date);
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
        const weekKey = format(weekStart, 'yyyy-MM-dd');
        
        if (!weeklyData[weekKey]) {
            weeklyData[weekKey] = [];
        }
        weeklyData[weekKey].push(result);
    });
    
    return Object.entries(weeklyData)
        .map(([week, weekResults]) => {
            const gamesPlayed = weekResults.length;
            const averageScore = weekResults.reduce((sum, r) => sum + r.score, 0) / gamesPlayed;
            const averageAccuracy = weekResults.reduce((sum, r) => sum + r.accuracy, 0) / gamesPlayed;
            
            // Calculate improvement rate compared to previous week
            const weeks = Object.keys(weeklyData).sort();
            const currentIndex = weeks.indexOf(week);
            let improvementRate = 0;
            
            if (currentIndex > 0) {
                const previousWeek = weeks[currentIndex - 1];
                const previousAverageScore = weeklyData[previousWeek]
                    .reduce((sum, r) => sum + r.score, 0) / weeklyData[previousWeek].length;
                
                improvementRate = ((averageScore - previousAverageScore) / previousAverageScore) * 100;
            }
            
            return {
                week,
                gamesPlayed,
                averageScore,
                averageAccuracy,
                improvementRate,
            };
        })
        .sort((a, b) => b.week.localeCompare(a.week))
        .slice(0, 8); // Last 8 weeks
}