import { syncData } from "@/services/syncService";
import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { createContext, ReactNode, useEffect, useState } from "react";
import { DeviceEventEmitter } from "react-native";

type authContextType = {
  currentSession: Session | null;
  isInitialized: boolean;
};

export const AuthContext = createContext<authContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [currentSession, setCurrentSession] = useState<null | Session>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);
      setCurrentSession(session);
      setIsInitialized(true);

      if (session?.user && event === "SIGNED_IN") {
        syncData(session.user.id).then(() => {
          DeviceEventEmitter.emit("sync_completed");
        });
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentSession: currentSession, isInitialized: isInitialized }}
    >
      {children}
    </AuthContext.Provider>
  );
}
