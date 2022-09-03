// type for session id
export interface SessionType {
  auth: {
    session_id: string;
    expires: number;
    data: string;
  };
}

export interface GoogleUserObjectType {
  id: string;
  displayName: string;
  name: Object;
  emails: Object[];
  photos: Object[];
}
