export type ExampleSource = "user" | "ai";

export interface Card {
  id: string;
  deck_id: string;
  card_type: string;
  front: string;
  back: string;
  example_sentence?: string;
  example_source: ExampleSource;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_synced: boolean;
  is_deleted: boolean;
  tags: string[];
}
