"use client";
import { Transaction } from "@mysten/sui/transactions";
import React, { useLayoutEffect, useState } from "react";
import { useZKLogin } from "react-sui-zk-login-kit";
import { SuiGraphQLClient } from "@mysten/sui/graphql";
import { graphql } from "@mysten/sui/graphql/schemas/latest";
import { Button } from "@heroui/button";
import { Card, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";

const gqlClient = new SuiGraphQLClient({
  url: "https://sui-devnet.mystenlabs.com/graphql",
});

const PACKAGE_ID = process.env.NEXT_PUBLIC_CHAMPIONSHIPS_PACKAGE_ID;

const objectType = `${PACKAGE_ID}::champion_ships::Championship`;

const chainIdentifierQuery = graphql(`
	query {
      objects(filter: {type: "${objectType}"}) {
        nodes {
          address
          digest
          asMoveObject {
            contents { json }
          }
        } 
      }
    }
`);

async function getChampionships() {
  const result = await gqlClient.query({
    query: chainIdentifierQuery,
  });

  return result.data;
}

// Sui JS SDK

// EXAMPLE: Connect to Sui testnet

interface Championship {
  description: string;
  entry_fee: string;
  game: string;
  id: string;
  participants: any[]; // Replace 'any[]' with a more specific type if needed
  reward_pool: {
    value: string;
  };
  status: number;
  team_size: string;
  title: string;
}

export default function Championships() {
  const [championShips, setChampionShips] = useState<Championship[]>([]);

  useLayoutEffect(() => {
    const fetchList = () => {
      getChampionships()
          .then((result) => {
            if (result?.objects?.nodes) {
              return result?.objects?.nodes?.map(
                  (object): Championship =>
                      object?.asMoveObject?.contents?.json as Championship,
              );
            }

            return [];
          })
          .then(setChampionShips);
    }

    const intrevalId = setInterval(() => fetchList(), 5000);
    return () => {
      clearInterval(intrevalId);
    };
  }, []);

  console.log("championShips ", championShips);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {championShips.map((championship) => (
        <Card style={{ minWidth: 200, maxWidth: 200 }} key={championship.id} isFooterBlurred className="border-none" radius="lg">
          <Image
            alt="Woman listing to music"
            className="object-cover"
            height={200}
            src="https://heroui.com/images/hero-card.jpeg"
            width={200}
          />
          <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
            <p className="text-tiny text-white/80">{championship.title}</p>
            <Button
              className="text-tiny text-white bg-black/20"
              color="default"
              radius="lg"
              size="sm"
              variant="flat"
            >
              Notify me
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
