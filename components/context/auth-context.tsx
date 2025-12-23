"use client"
import React from "react";

import { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";

export const AuthContext = React.createContext<{
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    getUserData: () => Promise<void>;
} | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = React.useState<User | null>(null);

    React.useEffect(() => {
        if (!user) {
            getUserData()
        }
    }, [])

    const getUserData = async () => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (supabaseUrl && supabaseAnonKey) {
            const supabase = await createClient()
            const {
                data: { user: supabaseUser }
            } = await supabase.auth.getUser()
            setUser(supabaseUser ?? null)
        }
    }

    return (
        <AuthContext.Provider value={{ user, setUser, getUserData }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}