import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import loadAnimation from '../../../assets/carregando.json';


export function Load() {
    return (
        <View style={styles.container}>
            <LottieView
                source={loadAnimation}
                autoPlay
                loop
                style={styles.animation}
            ></LottieView>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    animation: {
        backgroundColor: 'transparent',
        width: 200,
        height: 200
    }
})