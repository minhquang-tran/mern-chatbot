import { ReactNode, createContext, useContext, useEffect, useState } from "react";

type User = {
    name: string;
    email: string;
}
type UserAuth = {
    isLoggedIn: boolean;
    user: User | null
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}
export const AuthContext = createContext<UserAuth | null>(null);
const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // fetch if the user's cookies are valid then skip login
    }, []);
    const login = async (email: string, password: string) => { };
    const signup = async (name: string, email: string, password: string) => { };
    const logout = async () => { };

    const value = {
        user,
        isLoggedIn,
        login,
        signup,
        logout,
    };
    return <AuthContext.Provider value={value}>children</AuthContext.Provider>
};

export const useAuth = () => useContext(AuthContext);