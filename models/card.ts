
export type ExampleSource = 'user' | 'ai';


export interface Card {
  id: number;
  deckId: number;
  cardType: string;
  front: string;
  back: string;
  usageExample: string;
  exampleSource: ExampleSource;
  tags: string[];
}
