import React from "react";
import { StyleSheet, Text } from "react-native";
import { RectButton, RectButtonProps } from "react-native-gesture-handler";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import {SvgFromUri} from 'react-native-svg';
interface CardProps extends RectButtonProps{
    data:{
        name: string;
        photo: string,
        
    }
}
//Para fazer uso do SVG
//expo install react-native-svg
//asdasd

export const CardPrimary = ({data, ...rest}: CardProps) =>{
    return(

        <RectButton
            style={styles.container}
            {...rest}
        >
            <SvgFromUri uri={data.photo} width={70} height={70}/>
            
            <Text style={styles.text}>
                { data.name }
            </Text>
        </RectButton>
    )
}
const styles = StyleSheet.create({
    container:{
         flex: 1,
         maxWidth: '45%',
         backgroundColor: colors.shape,
         borderRadius: 20,
         paddingVertical: 10,
         alignItems: 'center',
         margin: 10
    },
    text:{
        color: colors.blue,
        fontFamily: fonts.heading,
        marginVertical: 16

    }

})