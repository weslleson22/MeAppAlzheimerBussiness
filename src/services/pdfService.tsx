import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { useUser } from '../hooks/useUser';
import { useTasks } from '../hooks/useTasks';

export interface ReportData {
  userName: string;
  reportDate: Date;
  tasksCompleted: number;
  tasksPending: number;
  totalTasks: number;
  completionRate: number;
  tasksByCategory: Record<string, number>;
  recentActivities: Array<{
    title: string;
    completed: boolean;
    createdAt: Date;
  }>;
}

export class PDFService {
  static async generateTaskReport(): Promise<void> {
    try {
      // Simular geração de PDF (em um app real, usaria biblioteca como react-native-pdf)
      const reportData = await this.collectReportData();
      
      // Criar conteúdo do relatório em formato de texto
      const pdfContent = this.generatePDFContent(reportData);
      
      // Simular salvamento (em app real, usaria biblioteca de PDF)
      console.log('Gerando relatório...');
      console.log(pdfContent);
      
      // Simular compartilhamento
      Alert.alert('Relatório Gerado', 'Relatório foi gerado com sucesso! (Em produção, seria compartilhado como PDF)');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      Alert.alert('Erro', 'Não foi possível gerar o relatório. Tente novamente.');
    }
  }

  private static async collectReportData(): Promise<ReportData> {
    // Simular coleta de dados (em um app real, buscaria dos hooks)
    return {
      userName: 'Usuário Teste',
      reportDate: new Date(),
      tasksCompleted: 15,
      tasksPending: 5,
      totalTasks: 20,
      completionRate: 75,
      tasksByCategory: {
        'Trabalho': 8,
        'Pessoal': 6,
        'Saúde': 4,
        'Outros': 2,
      },
      recentActivities: [
        {
          title: 'Reunião de equipe',
          completed: true,
          createdAt: new Date(Date.now() - 86400000), // 1 dia atrás
        },
        {
          title: 'Consulta médica',
          completed: true,
          createdAt: new Date(Date.now() - 172800000), // 2 dias atrás
        },
        {
          title: 'Comprar medicamentos',
          completed: false,
          createdAt: new Date(Date.now() - 259200000), // 3 dias atrás
        },
      ],
    };
  }

  private static generatePDFContent(data: ReportData): string {
    const header = `
====================================
RELATÓRIO DE TAREFAS - MeApp Alzheimer
====================================

Nome do Usuário: ${data.userName}
Data do Relatório: ${data.reportDate.toLocaleDateString('pt-BR')}

RESUMO GERAL
------------------------------------
Total de Tarefas: ${data.totalTasks}
Tarefas Concluídas: ${data.tasksCompleted}
Tarefas Pendentes: ${data.tasksPending}
Taxa de Conclusão: ${data.completionRate}%

TAREFAS POR CATEGORIA
------------------------------------
`;

    const categoriesSection = Object.entries(data.tasksByCategory)
      .map(([category, count]) => `${category}: ${count}`)
      .join('\n');

    const activitiesHeader = `
ATIVIDADES RECENTES
------------------------------------
`;

    const activitiesSection = data.recentActivities
      .map(activity => {
        const status = activity.completed ? '✅ Concluída' : '⏳ Pendente';
        const date = activity.createdAt.toLocaleDateString('pt-BR');
        return `${date} - ${activity.title} (${status})`;
      })
      .join('\n');

    const footer = `
====================================
Relatório gerado pelo MeApp Alzheimer
Desenvolvido para auxiliar pacientes com Alzheimer
====================================
`;

    return header + categoriesSection + '\n\n' + activitiesHeader + activitiesSection + '\n\n' + footer;
  }

  static async generateHealthReport(): Promise<void> {
    try {
      const healthData = await this.collectHealthData();
      const pdfContent = this.generateHealthPDFContent(healthData);
      
      // Simular salvamento (em app real, usaria biblioteca de PDF)
      console.log('Gerando relatório de saúde...');
      console.log(pdfContent);
      
      Alert.alert('Relatório de Saúde', 'Relatório de saúde gerado com sucesso! (Em produção, seria salvo como PDF)');
    } catch (error) {
      console.error('Erro ao gerar relatório de saúde:', error);
      Alert.alert('Erro', 'Não foi possível gerar o relatório de saúde.');
    }
  }

  private static async collectHealthData() {
    return {
      userName: 'Usuário Teste',
      reportDate: new Date(),
      mealsAnalyzed: 45,
      vegetablesDetected: 32,
      healthyMealsPercentage: 71,
      recommendations: [
        'Ótima ingestão de vegetais nas refeições',
        'Considere adicionar mais frutas ao café da manhã',
        'Mantenha a hidratação adequada durante o dia',
      ],
    };
  }

  private static generateHealthPDFContent(data: any): string {
    return `
====================================
RELATÓRIO DE SAÚDE E NUTRIÇÃO
====================================

Nome do Usuário: ${data.userName}
Data do Relatório: ${data.reportDate.toLocaleDateString('pt-BR')}

ANÁLISE DE REFEIÇÕES
------------------------------------
Refeições Analisadas: ${data.mealsAnalyzed}
Refeições com Vegetais: ${data.vegetablesDetected}
Percentual de Refeições Saudáveis: ${data.healthyMealsPercentage}%

RECOMENDAÇÕES
------------------------------------
${data.recommendations.map((rec: string, index: number) => `${index + 1}. ${rec}`).join('\n')}

====================================
Relatório gerado pelo MeApp Alzheimer
Foco em saúde e bem-estar
====================================
`;
  }
}

export const pdfService = PDFService;
