"use client";
import { useZKLogin, ZKLogin } from "react-sui-zk-login-kit";
import React, { useEffect } from "react";
import { generateRandomness } from "@mysten/sui/zklogin";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SUI_PROVER_ENDPOINT = "https://prover-dev.mystenlabs.com/v1";

// values can be stored in .env
const providers = {
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    redirectURI: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL || "",
  },
  twitch: {
    clientId: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID || "",
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
    <div className="flex justify-center flex-col gap-8 items-center -translate-y-24">
      <Image alt="Logo" height={280} src="/logo_big.png" width={180} />
      <ZKLogin
        disableRemoveHash
        proverProvider={SUI_PROVER_ENDPOINT}
        providers={providers}
        onSuccess={() => {
          console.log("22 ", 22);
          router.push("/");
        }}
      />
    </div>
  );
};
