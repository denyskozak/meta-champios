"use client";
import {useZKLogin, ZKLogin} from "react-sui-zk-login-kit";
import React, {useEffect} from "react";
import {generateRandomness} from "@mysten/sui/zklogin";
import {useRouter} from "next/navigation";

const SUI_PROVER_ENDPOINT = 'https://prover-dev.mystenlabs.com/v1';

// values can be stored in .env
const providers = {
    google: {
        clientId: "648851101099-uit5tqa2gf0nr1vvpjorc87k2u4minip.apps.googleusercontent.com",
        redirectURI: "http://localhost:3000/login",
    },
    twitch: {
        clientId: "ltu7mhvfj4l04maulcjcqx1wm5e5zh",
        redirectURI: "http://localhost:3000/login",
    }
};

export const Login = () => {
    const {encodedJwt, address, setUserSalt} = useZKLogin();
    const router = useRouter();

    useEffect(() => {
        if (encodedJwt) {
            // make you request to your server
            // for recive useSalt by jwt.iss (issuer id)
            const requestMock = new Promise(
                (resolve): void =>
                    resolve(localStorage.getItem("userSalt") || generateRandomness())
            );

            requestMock.then(salt => setUserSalt(String(salt)))
        }
    }, [encodedJwt]);


    return (
        <ZKLogin
            disableRemoveHash
            providers={providers}
            proverProvider={SUI_PROVER_ENDPOINT}
            onSuccess={() => {
                console.log('22 ', 22)
                router.push('/');
            }}
        />
    )
}