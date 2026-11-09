export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Welcome: undefined;
      Welcome01: undefined;
      WelcomeApp: undefined;
      UserIdentification: undefined;
      Settings: undefined;
      UserSettings: undefined;
      Confirmation: {
        plantId?: string;
        title?: string;
        subtitle?: string;
        buttonTitle?: string;
        icon?: 'smile' | 'hug';
        nextScreen?: string;
        initialTab?: string;
      };
      TelaPrincipal: undefined;
      TelaEndereco: undefined;
      Points: { uf: string; city: string };
      TelaPoints: { uf: string; city: string };
      Detail: { points_id: number; uf?: string; city?: string };
      TelaDetail: { points_id?: number; plantId?: string };
      TelaAlimentos: undefined;
      MemoryGame: undefined;
      TarefasSelect: undefined;
      HomeSelect: { initialTab?: string } | undefined;
      MyPlants: { initialTab?: string } | undefined;
      PlantSave: { plantId?: string; plant?: any };
      Fleet: undefined;
      home: undefined;
      quiz: { id?: string; quizId?: string };
      history: undefined;
      finish: { score?: number; totalQuestions?: number; total?: string; points?: string };
      Reports: undefined;
      dashboard: undefined;
      AIAssistant: undefined;
    }
  }
}