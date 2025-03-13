"use client";
import { useZKLogin, ZKLogin } from "react-sui-zk-login-kit";
import React, { useEffect } from "react";
import { generateRandomness } from "@mysten/sui/zklogin";
import { useRouter } from "next/navigation";

const SUI_PROVER_ENDPOINT = "https://prover-dev.mystenlabs.com/v1";

// values can be stored in .env
const providers = {
  google: {
    clientId:
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    redirectURI: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL || "",
  },
  twitch: {
    clientId:   process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID || '',
    redirectURI: process.env.NEXT_PUBLIC_TWITCH_REDIRECT_URL || "",
  },
};

export const Login = () => {
  const { encodedJwt, address, setUserSalt } = useZKLogin();
  const router = useRouter();

  useEffect(() => {
    if (encodedJwt) {
      // make you request to your server
      // for recive useSalt by jwt.iss (issuer id)
      const requestMock = new Promise((resolve): void =>
        resolve(localStorage.getItem("userSalt") || generateRandomness()),
      );

      requestMock.then((salt) => setUserSalt(String(salt)));
    }
  }, [encodedJwt]);

  return (
    <ZKLogin
      disableRemoveHash
      proverProvider={SUI_PROVER_ENDPOINT}
      providers={providers}
      onSuccess={() => {
        console.log("22 ", 22);
        router.push("/");
      }}
    />
  );
};
