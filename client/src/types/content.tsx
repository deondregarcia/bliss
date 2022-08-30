export interface BucketListType {
  id?: number;
  owner_id: number;
  privacy_type: string;
  created_at?: string;
  title: string;
  description: string;
}

export interface BucketListContentType {
  id?: number;
  tracker_id: number;
  activity: string;
  description: string;
  is_completed: boolean;
  user_id: number;
  date_added?: string;
  date_completed?: string;
}
