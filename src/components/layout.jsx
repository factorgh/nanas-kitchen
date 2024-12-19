/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/"); // Redirect to login page if not logged in
    }
  }, [isLoggedIn, navigate]);

  // Only render the children if logged in
  return isLoggedIn ? <div>{children}</div> : null;
};

export default Layout;
