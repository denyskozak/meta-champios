"use client";
import React from "react";

import { Login } from "@/components/login";
import {Button} from "@heroui/button";
import {useZKLogin} from "react-sui-zk-login-kit";

const LoginPage = () => {

  return (
    <section
      className="flex items-center flex-col justify-center w-screen h-screen"

    >
      <Login />
    </section>
  );
};

export default LoginPage;
