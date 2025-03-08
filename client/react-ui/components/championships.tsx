"use client";
import {Transaction} from "@mysten/sui/transactions";
import React, {useLayoutEffect, useState} from "react";
import {useZKLogin} from "react-sui-zk-login-kit";
import {SuiGraphQLClient} from "@mysten/sui/graphql";
import {graphql} from "@mysten/sui/graphql/schemas/latest";
import {Button} from "@heroui/button";
import {Card, CardFooter} from "@heroui/card";
import {Image} from "@heroui/image";
import {convertSuiToMist, MIST_PER_SUI} from "@/utiltiies";

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
    const {address, client, executeTransaction} = useZKLogin();
    const [championShips, setChampionShips] = useState<Championship[]>([]);

    useLayoutEffect(() => {
        const fetchList = () => {
            getChampionships()
                .then((result) => {
                    console.log('result ', result)
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

        fetchList();
        const intrevalId = setInterval(() => fetchList(), 5000);
        return () => {
            clearInterval(intrevalId);
        };
    }, []);

    // Fetch user's coin objects
    async function getUserCoins() {
        console.log('address ', address)
        const coins = await client.getCoins({owner: address || '', coinType: '0x2::sui::SUI'});
        console.log('coins ', coins)
        return coins.data;
    }

    // Select a coin with sufficient balance
    // TODO remove any
    async function selectPaymentCoin(coins: any[], entryFee: number) {
        for (const coin of coins) {
            if (Number(coin.balance) >= entryFee) {
                return coin.coinObjectId;
            }
        }
        throw new Error('No coin with sufficient balance found.');
    }

    const handleSignAndExecute = async (tx: Transaction) => {
        if (address) {
            console.log('111 ', address)
            tx.setSender(address);
        }
        tx.setGasBudget(100000000);
        try {
            const result = await executeTransaction(tx);
            console.log('result ', result)
        } catch (error) {
            console.log('error ', error)
        }

    };

    const joinChampionship = async (championship: Championship) => {
        try {
            const coins = await getUserCoins();

            const tx = new Transaction();
            const isFreeChampionship = Number(championship.entry_fee) === 0;
            const paymentCoinId = await selectPaymentCoin(coins, Number(championship.entry_fee));
            // We need a mutable reference to the coin and the championship object
            // So we pass them as objects in the transaction
            const champ = tx.object(championship.id);

            if (isFreeChampionship) {
                tx.moveCall({
                    target: `${PACKAGE_ID}::champion_ships::join_free`,
                    arguments: [champ],
                });
            } else {
                const [championshipFee] = tx.splitCoins(tx.gas, [Number(championship.entry_fee)]);

                tx.moveCall({
                    target: `${PACKAGE_ID}::champion_ships::join_paid`,
                    arguments: [champ, championshipFee],
                });
            }


            await handleSignAndExecute(tx);
        } catch (error) {
            console.error(error);
            alert("Error joining championship. Check console.");
        }
    };
    return (
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
            {championShips.map((championship) => (
                <Card style={{minWidth: 200, maxWidth: 200}} key={championship.id} isFooterBlurred
                      className="border-none" radius="lg">
                    <Image
                        alt="Woman listing to music"
                        className="object-cover"
                        height={200}
                        src="https://heroui.com/images/hero-card.jpeg"
                        width={200}
                    />
                    <CardFooter
                        className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                        <p className="text-tiny text-white/80">{championship.title}</p>
                        <Button
                            className="text-tiny text-white bg-black/20"
                            color="default"
                            radius="lg"
                            size="sm"
                            variant="flat"
                            onPress={() => joinChampionship(championship)}
                        >
                            {championship.participants.includes(address) ? 'View' : 'Join'}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
