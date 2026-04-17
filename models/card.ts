export type ExampleSource = "user" | "ai";

export interface Card {
  id: string;
  deck_id: string;
  cardType: string;
  front: string;
  back: string;
  usageExample?: string;
  exampleSource?: ExampleSource;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_synced: boolean;
  is_deleted: boolean;
  tags: string[];
}
