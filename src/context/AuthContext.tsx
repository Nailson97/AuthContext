import { api } from "@/services/api";
import { createContext, ReactNode, useState } from "react";
import { setCookie } from 'nookies'
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

      const {token, refreshToken, permissions, rules} = response.data
      
      setCookie(undefined, 'auth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })
      
      setCookie(undefined, 'auth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })

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
