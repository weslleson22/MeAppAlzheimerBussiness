import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, View, LogBox } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
const waterdrop = require ( '../../../assets/waterdrop.png');
import { Header } from '../components/Header';
import { Load } from '../components/Load';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { useTasks } from '../../hooks/useTasks';
import { notificationService } from '../../services/notificationService';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export function MyPlants() {
    const { tasks, isLoading, deleteTask, getTaskStats } = useTasks();
    const [nextReminder, setNextReminder] = useState<string>();

    const handleRemoveTask = async (taskId: string, taskName: string) => {
        Alert.alert('Remover Tarefa', `Deseja remover a tarefa "${taskName}"?`, [
            {
                text: 'Não \ud83d\ude4f\ud83c\udffc',
                style: 'cancel'
            },
            {
                text: 'Sim \ud83e\udd72',
                onPress: async () => {
                    try {
                        const success = await deleteTask(taskId);
                        if (success) {
                            Alert.alert('Sucesso', 'Tarefa removida com sucesso!');
                        } else {
                            Alert.alert('Erro', 'Não foi possível remover a tarefa.');
                        }
                    } catch (error) {
                        console.error('Erro ao remover tarefa:', error);
                        Alert.alert('Erro', 'Não foi possível remover! \ud83e\udd72');
                    }
                }
            }
        ]);
    };

    useEffect(() => {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
        
        // Configurar próximo lembrete
        if (tasks.length > 0) {
            const pendingTasks = tasks.filter(task => !task.completed);
            if (pendingTasks.length > 0) {
                const nextTask = pendingTasks.sort((a, b) => {
                    const dateA = a.dueDate ? new Date(a.dueDate).getTime() : new Date(a.createdAt).getTime();
                    const dateB = b.dueDate ? new Date(b.dueDate).getTime() : new Date(b.createdAt).getTime();
                    return dateA - dateB;
                })[0];

                const targetDate = nextTask.dueDate || nextTask.createdAt;
                const nextTime = formatDistance(
                    new Date(targetDate).getTime(),
                    new Date().getTime(),
                    { locale: pt }
                );

                setNextReminder(
                    `Não esqueça da tarefa "${nextTask.title}" em ${nextTime}.`
                );
            } else {
                setNextReminder(
                    'Nenhuma tarefa pendente. Parabéns! \ud83c\udf89'
                );
            }
        } else {
            setNextReminder(
                'Nenhuma tarefa agendada ainda. Crie uma nova tarefa para receber lembretes.'
            );
        }
    }, [tasks]);

    if (isLoading) {
        return <Load />;
    }

    // Converter tasks para o formato esperado pelo PlantCardSecondary
    const formattedTasks = tasks.map(task => ({
        id: task.id,
        name: task.title,
        about: task.description || '',
        water_tips: `Prioridade: ${task.priority}`,
        photo: '',
        environments: [''] as [string],
        frequency: {
            times: 1,
            repeat_every: 'day'
        },
        hour: task.dueDate ? new Date(task.dueDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '00:00',
        dateTimeNotification: task.dueDate || task.createdAt
    }));

    return (
        <View style={styles.container1}>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    <Header />

                    <View style={styles.spotlight}>
                        <Image 
                            source={waterdrop}
                            style={styles.spotlightImage}
                        />
                        <Text style={styles.spotlightText}>{nextReminder}</Text>
                    </View>

                    <View style={styles.plants}>
                        <Text style={styles.plantsTitle}>
                            Próximas tarefas
                        </Text>

                        <FlatList
                            data={formattedTasks}
                            keyExtractor={(item) => String(item.id)}
                            renderItem={({ item }) => (
                                <PlantCardSecondary 
                                    data={item}
                                    handleRemove={() => handleRemoveTask(item.id, item.name)}
                                />
                            )}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={() => (
                                <View style={styles.emptyContainer}>
                                    <Ionicons name="calendar-outline" size={48} color={colors.blue} />
                                    <Text style={styles.emptyText}>
                                        Nenhuma tarefa encontrada. Adicione novas tarefas para receber lembretes.
                                    </Text>
                                </View>
                            )}
                            contentContainerStyle={formattedTasks.length === 0 ? styles.emptyList : { flex: 1 }}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 32,
        paddingTop: 50,
        backgroundColor: colors.background
    },
    spotlight: {
        width: '100%',
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    spotlightImage: {
        width: 60,
        height: 60
    },
    spotlightText: {
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 20,
        
    },
    plants: {
        flex: 1,
        width: '100%'
    },
    plantsTitle: {
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.blue,
        marginVertical: 20
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30,
    },
    emptyText: {
        fontSize: 16,
        color: colors.blue,
        textAlign: 'center',
        fontFamily: fonts.text,
        paddingHorizontal: 20,
    },
    emptyList: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    container1:{
        flex:1,
        backgroundColor: colors.background
       
    },
})