/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";

// Create the context
const CountryContext = createContext();

// Create the provider component
export const CountryProvider = ({ children }) => {
  const [userCountry, setUserCountry] = useState("USA");
  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        console.log(data);
        setUserCountry(data.country_name);
      } catch (error) {
        console.error("Error fetching country data:", error);
        setUserCountry("Unknown");
      }
    };

    fetchCountry();
  }, [setUserCountry]);

  const changeCountry = (newCountry) => {
    setUserCountry(newCountry);
  };

  return (
    <CountryContext.Provider value={{ userCountry, changeCountry }}>
      {children}
    </CountryContext.Provider>
  );
};

// Custom hook to use the context

export { CountryContext };
