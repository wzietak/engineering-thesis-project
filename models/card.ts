

export interface Card {
    id: number;
    deckId: number;
    cardType: string;
    front: string;
    back: string;
    usageExample: string;
    tags: string[];
}