import React from 'react';
import { View, StyleSheet } from 'react-native';
import Card from './Card';

interface CardObject {
  id: number;
  text: string;
  matched: boolean;
}

interface GameBoardProps {
  cards: CardObject[];
  flippedIds: number[];
  onCardPress: (id: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ cards, flippedIds, onCardPress }) => {
  return (
    <View style={styles.container}>
      {cards.map((card, index) => (
        <Card
          key={card.id}
          text={card.text}
          flipped={flippedIds.includes(card.id)}
          matched={card.matched}
          index={index}
          onPress={() => onCardPress(card.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default GameBoard;
