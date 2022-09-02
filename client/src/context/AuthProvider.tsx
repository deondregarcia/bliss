import { createContext, useState, ReactNode } from "react";
import { SessionType } from "../types/authTypes";

const AuthContext = createContext<any>({});

// for usage in the useAuth hook
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<any>({});

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
