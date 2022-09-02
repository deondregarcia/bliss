// type for session id
export interface SessionType {
  auth: {
    session_id: string;
    expires: number;
    data: string;
  };
}

// export interface authContextType {
//   auth: {
//     user_id: number;
//     session_id: string;
//   };
// }
