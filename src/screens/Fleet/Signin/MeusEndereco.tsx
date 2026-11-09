import React from "react";
import { ThemeProvider } from "styled-components/native";
import backgroudImg from '../assets/background.png';
import { Container, Slogan, Title } from "./styles";
import theme from "../theme";
import { Button } from "../components/Button";

export function MeusEndereco() {
    return (
        <ThemeProvider theme={theme}>
            <Container source={backgroudImg}>
                <Title>
                    Meus Endereços
                </Title>
                <Slogan>Gestão de uso do veículo</Slogan>
                <Button title="Entrar com o Google" />
            </Container>
        </ThemeProvider>
    );
}