# 🧠 MeApp Alzheimer Business

<div align="center">
  <img src="https://raw.githubusercontent.com/weslleson22/ImagensAppAlzheimer/main/01-Tela.png" alt="Tela Principal" width="200"/>
  <img src="https://raw.githubusercontent.com/weslleson22/ImagensAppAlzheimer/main/02-Tela.png" alt="Tela de Jogos" width="200"/>
  <img src="https://raw.githubusercontent.com/weslleson22/ImagensAppAlzheimer/main/03-Tela.png" alt="Tela de Tarefas" width="200"/>
  <img src="https://raw.githubusercontent.com/weslleson22/ImagensAppAlzheimer/main/04-Tela.png" alt="Tela de Alimentos" width="200"/>
</div>

<br>

## � Sobre o Projeto

Aplicativo mobile desenvolvido para auxiliar pacientes com Alzheimer em estágio inicial, oferecendo ferramentas de gamificação, monitoramento cognitivo e suporte diário. O app combina jogos de memória, gerenciamento de tarefas, controle de alimentação e localização de recursos próximos.

---

## 🚀 Tecnologias Utilizadas

### Frontend (React Native)
- **React Native** 0.81.5 - Framework principal para desenvolvimento mobile
- **TypeScript** 5.9.2 - Tipagem estática e segurança de código
- **Expo SDK** ~54.0.0 - Plataforma de desenvolvimento e build
- **React Navigation** 6.x - Navegação entre telas
- **React Native Reanimated** ~4.1.1 - Animações performáticas
- **React Native Gesture Handler** ~2.28.0 - Gestos touch nativos
- **AsyncStorage** 2.2.0 - Armazenamento local persistente
- **Expo Notifications** ~0.32.16 - Notificações push e locais
- **Expo Location** ~19.0.8 - Geolocalização
- **Expo Image Picker** ~17.0.10 - Seleção de imagens da galeria
- **React Native Vector Icons** ^10.1.0 - Biblioteca de ícones
- **Styled Components** ^6.1.13 - CSS-in-JS para estilização

### Backend (Node.js)
- **Node.js** 20+ - Runtime JavaScript no servidor
- **Express** - Framework web minimalista
- **TypeScript** - Tipagem forte no backend
   # Rodar migrações do banco
   cd backend
   npx knex migrate:latest --knexfile knexfile.ts
   
   # Popular banco com dados iniciais
   npx knex seed:run --knexfile knexfile.ts
   ```

---

## ▶️ Execução do Projeto

### Ambiente de Desenvolvimento

#### Backend (Servidor API)
```bash
cd backend
npm run dev
```
O servidor será iniciado em `http://localhost:3333`

#### Frontend (Aplicativo Mobile)
```bash
# Instalar Expo CLI globalmente
npm install -g expo-cli

# Iniciar aplicativo
cd frontend
expo start
```

#### Build para Produção
```bash
# Build Android
expo build:android

# Build iOS
expo build:ios

# Build Web
expo build:web
```

---

## 📁 Estrutura de Pastas

```
MeAppAlzheimerBussiness/
├── src/                          # Código fonte principal
│   ├── components/               # Componentes reutilizáveis UI
│   │   ├── Button/              # Botão customizado
│   │   └── ErrorBoundary/       # Tratamento de erros
│   ├── screens/                  # Telas do aplicativo
│   │   ├── AppMenu/            # Menu principal
│   │   ├── AppTarefas/         # Gestão de tarefas
│   │   ├── AppAlimentosIa/      # IA para alimentos
│   │   ├── AppEndereco/         # Localização e endereços
│   │   ├── Gamers/              # Jogos terapêuticos
│   │   │   ├── Memory/          # Jogo da memória
│   │   │   └── Quiz/            # Quiz cognitivo
│   │   └── Settings/           # Configurações
│   ├── services/                 # Lógica de negócio e APIs
│   │   ├── apiService.tsx       # Cliente HTTP centralizado
│   │   └── notificationService.tsx # Gerenciamento de notificações
│   ├── hooks/                    # Hooks reutilizáveis React
│   │   ├── useUser.tsx          # Gerenciamento de usuário
│   │   ├── useStorage.tsx       # Gerenciamento de storage
│   │   ├── useNavigation.tsx     # Navegação tipada
│   │   └── useAnimation.tsx     # Animações reutilizáveis
│   ├── utils/                    # Utilitários gerais
│   │   └── SoundUtils.tsx       # Feedback visual e sonoro
│   ├── context/                  # Contextos globais React
│   ├── types/                    # Tipos TypeScript
│   ├── libs/                     # Bibliotecas compartilhadas
│   │   └── storage.ts           # Armazenamento de dados
│   ├── styles/                   # Estilos globais
│   │   ├── colors.ts            # Cores do tema
│   │   └── fonts.ts             # Fontes do aplicativo
│   └── routes/                   # Configuração de navegação
│       ├── StackNavigator.tsx     # Navegação principal
│       └── tab.routes.tsx       # Navegação por abas
├── backend/                     # Código do servidor
│   ├── src/
│   │   ├── controllers/         # Controladores da API
│   │   ├── database/            # Configuração do banco
│   │   ├── middlewares/         # Middlewares Express
│   │   ├── migrations/          # Migrações do banco
│   │   └── seeds/               # Dados iniciais
│   └── knexfile.ts              # Configuração Knex
├── assets/                      # Recursos estáticos
├── docs/                        # Documentação
└── tests/                       # Testes automatizados
```

---

## 🏗️ Arquitetura Aplicada

### Princípios SOLID
- **S**ingle Responsibility: Cada módulo com responsabilidade única
- **O**pen/Closed: Extensível sem modificação direta
- **L**iskov Substitution: Interfaces bem definidas para substituição
- **I**nterface Segregation: Interfaces específicas e coesas
- **D**ependency Inversion: Injeção de dependências via hooks

### Padrões Arquiteturais
- **Hooks Pattern**: Lógica compartilhada via hooks reutilizáveis
- **Service Layer**: Separação de chamadas de API
- **Repository Pattern**: Abstração do acesso a dados
- **Error Boundary**: Tratamento robusto de erros
- **Context API**: Estado global compartilhado

### Clean Code
- **Nomenclatura clara**: Funções e variáveis com nomes descritivos
- **Comentários objetivos**: Documentação onde necessário
- **Type Safety**: TypeScript 100% tipado
- **DRY Principle**: Código seco e reutilizável

---

## 🔌 Integração com API

### API Services
- **Centralização**: Todas as chamadas HTTP através de `apiService`
- **Interceptors**: Tratamento global de erros e autenticação
- **Type Safety**: Interfaces TypeScript para todas as respostas
- **Error Handling**: Tratamento robusto com diferentes status HTTP

### Storage Management
- **AsyncStorage**: Armazenamento persistente no dispositivo
- **Hooks Reutilizáveis**: `useStorage()` para operações genéricas
- **Type Safety**: Tipos fortementes para dados armazenados
- **Error Recovery**: Tratamento de falhas no storage

---

## 🧮 Funcionalidades Principais

### 🎮 Jogos Terapêuticos
- **Memory Game**: Jogo da memória com métricas cognitivas
  - Animações suaves e feedback visual
  - Sistema de pontuação e níveis
  - Monitoramento de desempenho
  - Relatórios detalhados para especialistas
  - Compartilhamento via WhatsApp

- **Quiz Cognitivo**: Quiz com perguntas adaptativas
  - Dificuldade progressiva
  - Histórico de desempenho
  - Feedback imediato

### 📋 Gestão de Tarefas
- **Plant Manager**: Sistema completo para gestão de plantas
  - Cadastro e edição de plantas
  - Lembretes de rega automáticos
  - Fotos e informações detalhadas
  - Notificações personalizadas

### 🍎 IA para Alimentos
- **Food Recognition**: Identificação de alimentos via IA
  - Informações nutricionais
  - Recomendações personalizadas
  - Integração com gestão de saúde

### 📍 Localização e Recursos
- **Places Finder**: Localização de recursos próximos
  - Integração com IBGE API
  - Mapas interativos
  - Informações de contato e horários

---

## 🧪 Testes

### Estrutura de Testes
```typescript
// Exemplo de teste de hook
describe('useUser', () => {
  it('should save user data', async () => {
    const { saveUser } = renderHook(() => useUser());
    const success = await saveUser({ name: 'Test User' });
    expect(success).toBe(true);
  });
});
```

### Execução de Testes
```bash
# Rodar todos os testes
npm test

# Rodar com coverage
npm run test:coverage

# Rodar testes E2E
npm run test:e2e
```

---

## 📊 Métricas e Monitoramento

### Métricas Cognitivas
- **Precisão Média**: Taxa de acertos nos jogos
- **Tempo de Resposta**: Velocidade de processamento
- **Nível de Frustração**: Indicador de dificuldade
- **Progresso Semanal**: Evolução do desempenho
- **Score de Melhoria**: Métrica combinada de progresso

### Analytics
- **Event Tracking**: Interações do usuário
- **Performance Metrics**: Tempo de carregamento e resposta
- **Error Tracking**: Falhas e exceções
- **User Engagement**: Tempo de uso e frequência

---

## 🔧 Configuração e Deploy

### Variáveis de Ambiente
```bash
# .env
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_NOTIFICATION_KEY=your-notification-key
EXPO_PUBLIC_MAPS_API_KEY=your-maps-key
```

### Deploy
```bash
# Deploy para Expo Application Services
expo deploy

# Build para produção
expo build:android --release-channel production
expo build:ios --release-channel production
```

---

## 📈 Melhorias Realizadas

### Refatoração Completa (2026)
- ✅ **Arquitetura Moderna**: Aplicação de SOLID e Clean Code
- ✅ **Hooks Reutilizáveis**: 4 hooks personalizados criados
- ✅ **Serviços Centralizados**: API e notificações unificadas
- ✅ **Type Safety**: 100% tipado com TypeScript
- ✅ **Performance**: Animações com native driver
- ✅ **UX Moderna**: Feedback visual e sonoro aprimorado
- ✅ **Documentação**: Código comentado e README profissional
- ✅ **Organização**: Estrutura de pastas otimizada

### Melhorias de Performance
- **Bundle Size**: Redução através de tree shaking
- **Renderização**: Otimização com memo e useMemo
- **Animações**: Native driver para 60fps
- **Memory Management**: Centralização de estado

### Melhorias de UX
- **Animações Suaves**: Transições contextuais
- **Feedback Imediato**: Respostas visuais e táteis
- **Acessibilidade**: Alto contraste e fontes maiores
- **Loading States**: Indicadores de carregamento
- **Error Handling**: Tratamento amigável de erros

---

## 🤝 Como Contribuir

1. **Fork** o repositório
2. **Criar** uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. **Abrir** um Pull Request

### Diretrizes de Contribuição
- Seguir padrões de código estabelecidos
- Adicionar testes para novas funcionalidades
- Manter compatibilidade com React Native
- Documentar mudanças relevantes

---

## 📝 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

## 👨‍💻 Autor

**Desenvolvido por:** Weslleyson22  
**Contato:** [GitHub](https://github.com/weslleson22)

---

## 🙏 Agradecimentos

- Comunidade React Native
- Documentação Expo
- Contribuidores de código aberto
- Profissionais de saúde que colaboraram com requisitos

---

<div align="center">
  <strong>🧠 Desenvolvido com cuidado para pacientes com Alzheimer 🧠</strong>
</div>