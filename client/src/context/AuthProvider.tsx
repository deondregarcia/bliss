import { createContext, useState, ReactNode } from "react";
import { SessionType } from "../types/authTypes";

const AuthContext = createContext<any>({});

// for usage in the useAuth hook
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<any>({});
  // check if user is new here to prevent too many calls
  const [checkedIfNewUser, setCheckedIfNewUser] = useState<boolean>(false);

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, checkedIfNewUser, setCheckedIfNewUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
