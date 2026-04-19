import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const ToggleLeftIcon = (props: any) => (
  <MaterialCommunityIcons name="toggle-switch" {...props} />
);
const CodeSimpleIcon = (props: any) => (
  <MaterialCommunityIcons name="code-braces" {...props} />
);
const GitForkIcon = (props: any) => (
  <MaterialCommunityIcons name="source-branch" {...props} />
);
const PaintBucketIcon = (props: any) => (
  <MaterialCommunityIcons name="bucket" {...props} />
);
const CloudArrowUpIcon = (props: any) => (
  <MaterialCommunityIcons name="cloud-upload" {...props} />
);
const DeviceMobileIcon = (props: any) => (
  <MaterialCommunityIcons name="cellphone" {...props} />
);

export const QUIZZES = [
  {
    id: '1',
    title: 'Treinando Memória: O Dia a Dia',
    level: 1,
    svg: ToggleLeftIcon,
  },
  {
    id: '2',
    title: 'Lembrando de Atividades Diárias',
    level: 1,
    svg: CodeSimpleIcon,
  },
  {
    id: '3',
    title: 'Lembrando de Padrões e Tarefas Simples',
    level: 2,
    svg: GitForkIcon,
  },
  {
    id: '4',
    title: 'Recordando Nomes e Faces',
    level: 2,
    svg: PaintBucketIcon,
  },
  {
    id: '5',
    title: 'Memorizando Tarefas Cotidianas',
    level: 2,
    svg: CloudArrowUpIcon,
  },
  {
    id: '6',
    title: 'Reflexão sobre a Memória e Rotina',
    level: 1,
    svg: DeviceMobileIcon,
  },
];
