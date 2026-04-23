import { initDB } from "@/db/database";
import { createContext, ReactNode, useEffect, useState } from "react";

export const DBContext = createContext({ isReady: false });

export const DBContextProvider = ({ children }: { children: ReactNode }) => {
  const [isDBReady, setIsDBReady] = useState(false);
  useEffect(() => {
    initDB().then((success) => {
      if (success) setIsDBReady(true);
    });
  }, []);

  return (
    <DBContext.Provider value={{ isReady: isDBReady }}>
      {children}
    </DBContext.Provider>
  );
};
