import React from 'react';

interface CardData {
 id: number;
 title: string;
 description: string;
}

export const generateCardData = (numCards: number): CardData[] => {
 const cards: CardData[] = [];

 for (let i = 1; i <= numCards; i++) {
    cards.push({
      id: i,
      title: `Card ${i}`,
      description: `This is the description for card ${i}.`,
    });
 }

 return cards;
};