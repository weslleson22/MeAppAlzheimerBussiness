import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import colors from '../../styles/colors';

export function Load() {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.green} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

