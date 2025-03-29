"use client";
import React from "react";

import { Login } from "@/components/login";
import {Button} from "@heroui/button";
import {useZKLogin} from "react-sui-zk-login-kit";

const LoginPage = () => {

  return (
    <section
      className="flex items-center flex-col justify-center w-screen h-screen"
      style={{ margin: "0 auto", marginBottom: "2rem" }}
    >
      <Login />
    </section>
  );
};

export default LoginPage;
