export interface BucketListType {
  id?: number;
  owner_id: number;
  privacy_type: string;
  created_at?: string;
  title: string;
  description: string;
  permissions: string;
}

export interface BucketListContentType {
  id: number;
  tracker_id: number;
  activity: string;
  description: string;
  is_completed: boolean;
  user_id: number;
  date_added?: string;
  date_completed?: string;
}

export interface RecipeContentType {
  image: string;
  title: string;
}

export interface UserType {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  created_at: Date;
  google_id: string;
  wants_to?: string;
  google_photo_link?: string;
}

export interface FriendListType {
  username: string;
  first_name: string;
  last_name: string;
  google_photo_link: string;
  google_id: string;
  user_id: number;
  wants_to?: string;
}

export interface FullUserListType {
  username: string;
  first_name: string;
  google_id: string;
  google_photo_link: string;
}

export interface FriendRequestUserType {
  username: string;
  google_id: string;
  google_photo_link: string;
}

export interface SharedListUserType {
  id?: number;
  bucket_list_id: number;
  contributor_id: number;
  owner_id?: number;
}
