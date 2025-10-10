import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router";
import LandingPage from "../pages/Landing.jsx";

export default function App() {
  const { isSignedIn } = useUser();

  // If user is signed in, go to /products, else show landing page
  if (isSignedIn) {
    return <Navigate to="/products" replace />;
  }

  return <LandingPage />;
}
