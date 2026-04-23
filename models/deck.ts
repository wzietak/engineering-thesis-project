export interface Deck {
  id: string;
  name: string;
  source_language?: string;
  target_language?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_synced: boolean;
  is_deleted: boolean;
}
