/* Single source of truth for card types to prevent 
any typo-related bugs and make it easier to change them 
or add new types */
enum CardType {
  BASIC = "Basic",
  REVERSED = "Reversed",
  BASIC_AND_REVERSED = "Basic and reversed",
}

/* Mapping array for dropdown components */
export const CARD_TYPE_OPTIONS = [
  { label: "Basic", value: CardType.BASIC },
  { label: "Reversed", value: CardType.REVERSED },
  { label: "Basic and reversed", value: CardType.BASIC_AND_REVERSED },
];
