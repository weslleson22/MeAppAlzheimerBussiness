import { useNavigation, useRoute } from '@react-navigation/core';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

interface Params {
    title: string;
    subtitle: string;
    buttonTitle: string;
    icon: 'smile' | 'hug',
    nextScreen: string;
}

const emojis = {
    hug: '🤗',
    smile: '😄'
}

export function Confirmation() {
    const navigation = useNavigation();
    type Nav = {
        navigate: (value: string) => void;
      }
      
      const { navigate } = useNavigation<Nav>()
    const routes = useRoute();

    const {
        title,
        subtitle,
        buttonTitle,
        icon,
        nextScreen,
    } = routes.params as Params;

    function handleMoveOn() {
      //  navigation.
      navigate(nextScreen)
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.emoji}>{emojis[icon]}</Text>

                <Text style={styles.title}>
                    {title}
                </Text>

                <Text style={styles.subtitle}>
                    {subtitle}
                </Text>

                <View style={styles.footer}>
                    <Button
                        title={buttonTitle}
                        onPress={handleMoveOn}
                    />
                </View>
            </View>
        </SafeAreaView>
    )   
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 30
    },
    title: {
        fontSize: 22,
        fontFamily: fonts.heading,
        textAlign: 'center',
        color: colors.blue,
        lineHeight: 38,
        marginTop: 15
    },
    emoji: {
        fontSize: 78
    },
    subtitle: {
        fontFamily: fonts.text,
        textAlign: 'center',
        fontSize: 17,
        paddingVertical: 10,
        color: colors.blue
    },
    footer: {
        width: '100%',
        paddingHorizontal: 50,
        marginTop: 20
    }
})