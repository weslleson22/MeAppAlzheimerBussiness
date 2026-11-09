import styled from "styled-components/native";

export const Container = styled.TouchableOpacity`
  flex: 1;
  min-height: 56px;
  max-height: 56px;
  border-radius: 6px;

  align-items: center;
  justify-content: center;

  background-color: ${({ theme }: { theme: any }) => theme.COLORS.BRAND_MID};
`;

export const Title = styled.Text`
  color: ${({ theme }: { theme: any }) => theme.COLORS.WHITE};
  font-size: ${({ theme }: { theme: any }) => theme.FONT_SIZE.MD}px;
  font-family: ${({ theme }: { theme: any }) => theme.FONT_FAMILY.BOLD};
`;

export const Loading = styled.ActivityIndicator.attrs(({ theme }: { theme: any }) => ({
  color: theme.COLORS.WHITE
}))``;
