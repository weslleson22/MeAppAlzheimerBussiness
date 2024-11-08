import { View } from "react-native";
import { ThemeProvider } from "styled-components/native";
import backgroudImg from '../assets/background.png';
import { Container } from "../components/Loading/styles";
import { Slogan, Title } from "./styles";
import theme from "../theme";
import { Button } from "../components/Button";
export function MeusEndereco (){
    return(
        <Container source={backgroudImg}>
           <Title>
            Meus Endereço
           </Title>
           <Slogan>Gestão de uso do veiculo</Slogan>
        
        <Button title="       Entra com o Google       "></Button>
        </Container>

        
    )
}