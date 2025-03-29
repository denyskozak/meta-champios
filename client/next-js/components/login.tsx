"use client";
import {useZKLogin, ZKLogin} from "react-sui-zk-login-kit";
import React, {useEffect} from "react";
import {generateRandomness} from "@mysten/sui/zklogin";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {Form, Input, Button, Card} from "@heroui/react";
import {CardHeader} from "@heroui/card";

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
    const {encodedJwt, address, logout, setUserSalt} = useZKLogin();
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
            <Image alt="Logo" height={280} src="/logo_big.png" width={180}/>

            <ZKLogin
                disableRemoveHash
                proverProvider={SUI_PROVER_ENDPOINT}
                providers={providers}
                onSuccess={() => {
                    router.push("/");
                }}
            />
            {address
                ? (
                    <Card className="p-4 gap-2">
                        <CardHeader >
                            <p className="text-md">Withdraw Coins to Your Account</p>
                        </CardHeader>
                        <Form
                            className="w-full max-w-xs flex flex-col gap-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                let data = Object.fromEntries(new FormData(e.currentTarget));

                            }}
                        >
                            <Input
                                isRequired
                                errorMessage="Please enter your valid address"
                                label="Address"
                                labelPlacement="outside"
                                name="address"
                                placeholder="Enter your address"
                                type="text"
                            />

                            <Input
                                isRequired
                                errorMessage="Please enter a valid amount"
                                label="Couins"
                                labelPlacement="outside"
                                name="amount"
                                placeholder="Enter amount of coins"
                                type="number"
                            />
                            <div className="flex gap-2">
                                <Button color="primary" type="submit">
                                    Withdraw
                                </Button>
                            </div>
                        </Form>
                        <Button
                            className="text-sm font-normal text-default-600 bg-default-100"
                            variant="flat"
                            onPress={() => logout()}
                        >
                            Logout
                        </Button>
                    </Card>

                )
                : null}

        </div>
    );
};
