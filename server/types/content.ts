export interface BucketList {
  id?: number;
  google_id?: string;
  owner_id?: number;
  privacy_type: string;
  created_at?: string;
  title: string;
  description: string;
  permissions: string;
}

export interface BucketListContent {
  id?: number;
  tracker_id: number;
  activity: string;
  description: string;
  is_completed: boolean;
  user_id: number;
  date_added?: string;
  date_completed?: string;
}

export interface FriendPairType {
  friend_one_id: number;
  friend_two_id: number;
}

export interface PrivacyAndOwnerType {
  privacy_type: string;
  owner_id: number;
  permissions: string;
}

export interface SharedListUserType {
  id: number;
  bucket_list_id: number;
  contributor_id: number;
}

export interface UserType {
  id?: number;
  username: string;
  first_name: string;
  last_name: string;
  created_at?: Date;
  google_id: string;
  bio: string;
}

export interface ActivityIDTypes {
  trackerID: number;
  contentID: number;
}
