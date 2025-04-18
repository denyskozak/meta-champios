"use client";
import React from "react";
import { Form, Input, Button, Card } from "@heroui/react";
import { CardHeader } from "@heroui/card";
import {useCurrentAccount, useDisconnectWallet} from "@mysten/dapp-kit";

import { useTransaction } from "@/app/hooks";

export const Login = () => {
  const account = useCurrentAccount();
  const { sendCoins } = useTransaction();
  const { mutate: disconnect } = useDisconnectWallet();

  return (
    <div className="flex justify-center flex-col gap-8 items-center">
      {/*<Image alt="Logo" height={280} src="/logo_big.png" width={180}/>*/}

      <Card className="p-4 gap-2">
        <CardHeader>
          <h1>Profile</h1>
        </CardHeader>
        <h2 className="text-md">Your address: {account?.address}</h2>
        <Button color="primary" onPress={() => disconnect()}>
          Logout
        </Button>
      </Card>
        <Card className="p-4 gap-2">
        <p>Withdraw Coins to External Account</p>
        <Form
            className="w-full max-w-xs flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              let data = Object.fromEntries(new FormData(e.currentTarget)) as {
                address: string;
                coins: string;
              };

              sendCoins(data.address, Number(data.coins));
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
              label="Coins"
              labelPlacement="outside"
              name="coins"
              placeholder="Enter amount of coins"
              type="number"
          />
          <div className="flex gap-2">
            <Button color="primary" type="submit">
              Withdraw
            </Button>
          </div>
        </Form>

      </Card>
    </div>
  );
};
