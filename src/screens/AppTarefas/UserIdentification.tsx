import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { 
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/Button";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { useUser } from "../../hooks/useUser";

export function UserIdentification(){
    const[isFocused, setIsFocused]=useState(false);
    const[isFilled, setIsFilled]=useState(false);
    const [name, setName] =useState<string>();
    const { saveUser } = useUser();

    function handleInputBlur(){
        setIsFocused(false)
        setIsFilled(!!name);
    }
    function handleInputForcus(){
        setIsFocused(true)
    }
    function handleInputChange(value: string){
        setIsFilled(!!value);
        setName(value);
    }

    const navigation =useNavigation();
   
    async function handleSumit(){
        if(!name || !name.trim())
            return Alert.alert('Nome obrigatório', 'Por favor, digite seu nome');

        try {
            const success = await saveUser({ name: name.trim() });
            if (!success) {
                return Alert.alert('Erro', 'Não foi possível salvar seu nome');
            }
        } catch {
            return Alert.alert('Erro', 'Não foi possível salvar seu nome');
        }
        
        (navigation.navigate as any)('TelaPrincipal', {
            title: 'Prontinho',
            subtitle: 'Agora vamos começar a cuidar das suas rotinas com muito cuidado.',
            buttonTitle: 'Começar',
            icon: 'smile',
            nextScreen: 'HomeSelect'
        });
	}

    return(
        <SafeAreaView style={styles.container}>
           <KeyboardAvoidingView style={styles.container}
           behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
           >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
                
                    <View style={styles.content}>
                        <View style={styles.form}>
                            <View style={styles.header}>
                            <Text style={styles.emoji}>
                            {isFilled? '😆':'😊'} 
                            </Text >

                            <Text style={styles.title}>
                                Como podemos{'\n'} 
                                chamar você?
                            </Text>
                            </View>
                            <TextInput
                            style={[
                                styles.input,
                                (isFocused || isFilled) && { borderColor: colors.blue }
                            ]}
                            placeholder="Digite um nome"
                            onBlur={handleInputBlur}
                            onFocus={handleInputForcus}
                            onChangeText={(text) => {
                                if (text.length <= 15) {
                                handleInputChange(text);
                                } else {
                                handleInputChange(text.substring(0, 15));
                                }
                            }}
                            maxLength={15} // Define o número máximo de caracteres
                            />


                            <View style={styles.footer}>

                            <Button 
                                title="Confirmar"
                                onPress={handleSumit}
                            /> 
                            </View>
                            </View>               
                    </View>
                
            </View>
            </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',


    },
    content:{
        flex: 1,
        width: '100%',

    },
    form:{
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 54,
        alignItems: 'center'
    },
    emoji:{
        fontSize: 44
    },
    input:{
        borderBottomWidth: 1,
        borderBottomColor: colors.blue,
        color: colors.blue,
        width: '100%',
        fontSize: 18,
        marginTop: 50,
        padding: 10,
        textAlign: 'center'
    },
    title:{
        fontSize: 32,
        textAlign: 'center',
        color: colors.blue,
        fontFamily: fonts.heading,
        marginTop:20
    }, 
    footer:{
        marginTop: 40,
        width: '100%',
        paddingHorizontal: 20
    },
    header:{
        alignItems: 'center'
    }
});