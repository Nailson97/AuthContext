import { api } from "@/services/api";
import { createContext, ReactNode } from "react";

type SigninCredentials = {
  email: string;
  password: string;
};

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContext {
  signIn(credentials: SigninCredentials): Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext({} as AuthContext);

export function AuthProvider({ children }: AuthProviderProps) {
  const isAuthenticated = false;

  async function signIn({ email, password }: SigninCredentials) {
    try {
      const response = await api.post("sessions", {
        email,
        password,
      });

      console.log(response.data);
    } catch (error) {
      console.log(error, "Aqui está o erro!");
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
