import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    LogBox,
    ScrollView
} from "react-native";
import { EnviromentButton } from "../components/EnviromentButton";
import { Header } from "../components/Header";
import api from "../../services/api"; 
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { CardPrimary } from "../components/Primary";
import { Load } from '../components/Load';
import { useNavigation } from "@react-navigation/native";
import { PlantProps } from "../../libs/storage";

interface EnviromentProps {
    key: string;
    title: string;
}

export function HomeSelect() {
    const [enviroments, setEnvirtoments] = useState<EnviromentProps[]>([]);
    const [functioons, setFunctioons] = useState<PlantProps[]>([]);
    const [filterfunctioons, setFilterFunctioons] = useState<PlantProps[]>([]);
    const [environmentSelected, setEnvironmentSelected] = useState('all');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    const navigation = useNavigation();
    type Nav = {
        navigate: (value: string, params?: any) => void;
    }
    const { navigate } = useNavigation<Nav>();

    function handleEnrivomentSelected(environment: string) {
        setEnvironmentSelected(environment);

        if (environment === 'all')
            return setFilterFunctioons(functioons);

        const filtered = functioons.filter(functioon =>
            functioon.environments.includes(environment)
        );
        setFilterFunctioons(filtered);
    }

    async function fetchFunctioons() {
        try {
            const { data } = await api.get(`plants?_sort=name&order=asc&_page=${page}&_limit=10`);
            console.log('fetchFunctioons data:', data);

            if (!data)
                return setLoading(false);

            if (page > 1) {
                setFunctioons(oldValue => [...oldValue, ...data]);
                setFilterFunctioons(oldValue => [...oldValue, ...data]);
            } else {
                setFunctioons(data);
                setFilterFunctioons(data);
            }
        } catch (error) {
            console.error('fetchFunctioons error:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }

    function handleFetchMore(distance: number) {
        if (distance < 1)
            return;

        setLoadingMore(true);
        setPage(oldValue => oldValue + 1);
        fetchFunctioons();
    }

    function handlePlantSelect(plant: PlantProps) {
        navigate('PlantSave', { plant });
    }

    useEffect(() => {
        async function fetchEnviroment() {
            try {
                const { data } = await api.get('plants_environments?_sort=title&order=asc');
                console.log('fetchEnviroment data:', data);

                setEnvirtoments([
                    {
                        key: 'all',
                        title: 'Todos',
                    },
                    ...data
                ]);
                LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
            } catch (error) {
                console.error('fetchEnviroment error:', error);
            }
        }

        fetchEnviroment();
    }, []);

    useEffect(() => {
        fetchFunctioons();
    }, []);

    useEffect(() => {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    }, []);

    if (loading)
        return <Load />;

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <View style={styles.Header}>
                    <Header />
                    <Text style={styles.title}>
                        Estamos aqui para ajudar
                    </Text>
                    <Text style={styles.subtitle}>
                        Escolha uma função abaixo.
                    </Text>
                    <View>
                    <FlatList
                        data={enviroments}
                        keyExtractor={(item) => String(item.key)}
                        renderItem={({ item }) => (
                            <EnviromentButton
                                title={item.title}
                                active={item.key === environmentSelected}
                                onPress={() => handleEnrivomentSelected(item.key)}
                            />
                        )}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.EnviromentList}
                    />
                </View>
                </View>



                <View style={styles.funcoes}>
                    <FlatList
                        data={filterfunctioons}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => (
                            <CardPrimary
                                data={item}
                                onPress={() => handlePlantSelect(item)}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        numColumns={2}
                        onEndReached={({ distanceFromEnd }) => handleFetchMore(distanceFromEnd)}
                        onEndReachedThreshold={0.1}
                        ListFooterComponent={
                            loadingMore ? <ActivityIndicator color={colors.blue} /> : null
                        }
                    />
                </View>
            </View>
            
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    Header: {
        paddingHorizontal: 30
    },
    title: {
        fontSize: 17,
        color: colors.blue,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 20
    },
    subtitle: {
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.blue
    },
    EnviromentList: {
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        marginLeft: 32,
        marginVertical: 32
    },
    funcoes: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center'
    }
});
