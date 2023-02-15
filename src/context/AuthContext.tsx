import { api } from "@/services/api";
import { createContext, ReactNode, useState } from "react";
import Router from "next/router";


type SigninCredentials = {
  email: string;
  password: string;
};

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  email: string,
  permissions: string[]
  rules: string[]
}

interface AuthContext {
  signIn(credentials: SigninCredentials): Promise<void>;
  isAuthenticated: boolean;
  user: User
}


export const AuthContext = createContext({} as AuthContext);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>()
  const isAuthenticated = !!user;

  async function signIn({ email, password }: SigninCredentials) {

    try {
      const response = await api.post("sessions", {
        email,
        password,
      });

      const {permissions, rules} = response.data

      setUser({
        email,
        permissions,
        rules
      })

      Router.push('/dashboard')
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
