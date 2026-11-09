import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import { useUser } from '../../hooks/useUser';

const UserImg = require('../../../assets/idoso.png');

export function Header() {
    const { user } = useUser();

    return(
        <View style={styles.container}>
            <View>
                <Text style={styles.greeting}>Olá,</Text>
                <Text style={styles.userName}>{user?.name || 'Visitante'}</Text>
            </View>

            <Image
                source={user?.profilePhoto ? { uri: user.profilePhoto } : UserImg}
                style={styles.image}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        marginTop: getStatusBarHeight(),
    },
    greeting: {
        fontSize: 32,
        color: colors.blue,
        fontFamily: fonts.text
    },
    userName: {
        fontSize: 32,
        fontFamily: fonts.heading,
        color: colors.blue,
        lineHeight: 40
    },
    image: {
        width:85,
        height:85,
        borderRadius: 40
    }
})
