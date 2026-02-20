"use client"
import React from "react";

import { User } from "@supabase/supabase-js";

import { UserPlanDetailsProps } from "@/lib/actions/user-premium";
import { createClient } from "@/lib/supabase/client";

export const AuthContext = React.createContext<{
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isLoading: boolean;
    getUserData: () => Promise<void>;
    userPlanDetails: UserPlanDetailsProps | null;
    setUserPlanDetails: React.Dispatch<React.SetStateAction<UserPlanDetailsProps | null>>;
} | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = React.useState<User | null>(null);
    const [userPlanDetails, setUserPlanDetails] = React.useState<UserPlanDetailsProps | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    console.log("user plan details: ", userPlanDetails)

    React.useEffect(() => {
        if (!user) {
            getUserData()
        }
    }, [])

    React.useEffect(() => {
        if (user && !userPlanDetails) {
            getUserPlanData()
        }
    }, [user])

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
        setIsLoading(false)
    }

    const getUserPlanData = async () => {
        if (!user) return;

        try {
            const { getUserPlan, saveUserPlanDetails } = await import('@/lib/actions/user-premium');

            // We use user.email as the unique key for premium data
            const email = user.email;
            if (!email) return;

            const data = await getUserPlan(user.id);

            if (data) {
                setUserPlanDetails(data);
            } else {
                // Create new account data
                const newPlanData = {
                    userId: user.id,
                    email: email,
                    name: user.user_metadata?.full_name || user.user_metadata?.name || '',
                    planName: 'Free',
                    priceId: '',
                    isActive: false,
                    customerId: ''
                };

                await saveUserPlanDetails(newPlanData);
                setUserPlanDetails(newPlanData);
            }
        } catch (error) {
            console.error("Error fetching premium plan data:", error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading, getUserData, userPlanDetails, setUserPlanDetails }}>
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