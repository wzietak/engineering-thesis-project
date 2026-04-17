export interface Deck {
  id: string;
  name: string;
  language?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_synced: boolean;
  is_deleted: boolean;
}
