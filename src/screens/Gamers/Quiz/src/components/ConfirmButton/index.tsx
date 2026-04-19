import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { styles } from './styles';
import { THEME } from '../../styles/theme';

export function ConfirmButton({ ...rest }: TouchableOpacityProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.container}
      {...rest}
    >
      <Text style={styles.title}>
        Confirmar
      </Text>

      <MaterialIcons
        name="check"
        color={THEME.COLORS.WHITE}
        size={24}
      />
    </TouchableOpacity>
  );
}