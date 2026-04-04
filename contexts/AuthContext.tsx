import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { createContext, ReactNode, useEffect, useState } from "react";

export const AuthContext = createContext<null | Session>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [currentSession, setCurrentSession] = useState<null | Session>(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);
      setCurrentSession(session);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={currentSession}>
      {children}
    </AuthContext.Provider>
  );
}
