// styled.d.ts
import 'styled-components';
import { ThemeType } from './path/to/theme';

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
