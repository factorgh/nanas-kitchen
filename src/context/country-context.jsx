/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";

// Create the context
const CountryContext = createContext();

// Create the provider component
export const CountryProvider = ({ children }) => {
  const [userCountry, setUserCountry] = useState(
    ""

    // () => {
    // // Check localStorage for an existing country
    // const storedCountry = localStorage.getItem("userCountry");
    // return storedCountry ? storedCountry : "";
    // }
  );

  useEffect(() => {
    if (!userCountry) {
      const fetchCountry = async () => {
        try {
          const response = await fetch("https://ipapi.co/json/");
          const data = await response.json();
          const country = data.country_name.toUpperCase();
          setUserCountry(country);
          // Save to localStorage
          localStorage.setItem("userCountry", country);
        } catch (error) {
          console.error("Error fetching country data:", error);
          setUserCountry("Unknown");
        }
      };

      fetchCountry();
    }
  }, [userCountry]);

  const changeCountry = (newCountry) => {
    setUserCountry(newCountry);
    // Update localStorage
    localStorage.setItem("userCountry", newCountry);
  };

  return (
    <CountryContext.Provider value={{ userCountry, changeCountry }}>
      {children}
    </CountryContext.Provider>
  );
};

// Custom hook to use the context
export { CountryContext };
