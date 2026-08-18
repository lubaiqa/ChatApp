import { createContext, useContext, useState } from "react";

export const authContext = createContext();

export const useAuth = () => {
  return useContext(authContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("chatapp");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  return (
    <authContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </authContext.Provider>
  );
};
