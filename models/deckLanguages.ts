/* Single source of truth for deck languages to prevent 
any typo-related bugs and make it easier to change them 
or add new languages */

enum DeckLanguage {
  ENGLISH = "English",
  GERMAN = "German",
  SPANISH = "Spanish",
  ITALIAN = "Italian",
}
/* Mapping array for dropdown components */
export const DECK_LANGUAGES = [
  { label: "English", value: DeckLanguage.ENGLISH },
  { label: "German", value: DeckLanguage.GERMAN },
  { label: "Spanish", value: DeckLanguage.SPANISH },
  { label: "Italian", value: DeckLanguage.ITALIAN },
];
