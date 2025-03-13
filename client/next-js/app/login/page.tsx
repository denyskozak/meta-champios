"use client";
import React from "react";

import { Login } from "@/components/login";

const LoginPage = () => {
  return (
    <section
      className="flex items-center justify-center w-screen h-screen"
      style={{ margin: "0 auto", marginBottom: "2rem" }}
    >
      <Login />
    </section>
  );
};

export default LoginPage;
