"use client";
import {Transaction} from "@mysten/sui/transactions";
import React, {useLayoutEffect, useState} from "react";
import {useZKLogin} from "react-sui-zk-login-kit";
import {SuiGraphQLClient} from "@mysten/sui/graphql";
import {graphql} from "@mysten/sui/graphql/schemas/latest";
import {Button} from "@heroui/button";
import {Card, CardFooter, CardHeader} from "@heroui/card";
import {Image} from "@heroui/image";
import {convertSuiToMist, MIST_PER_SUI} from "@/utiltiies";
import {Modal} from "@/components/modal";

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
    entryFee: number;
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


interface MoveChampionship {
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
    const [openChampionshipCard, setOpenChampionshipCard] = useState(false);

    const mapChampionship = (item: MoveChampionship): Championship => {
        const { entry_fee, ...props } = item;
        return {
            entryFee: Number(entry_fee),
            ...props,
        }
    }
    useLayoutEffect(() => {
        const fetchList = () => {
            getChampionships()
                .then((result) => {
                    console.log('result ', result)
                    if (result?.objects?.nodes) {
                        return result?.objects?.nodes?.map(
                            (object): MoveChampionship =>
                                object?.asMoveObject?.contents?.json as MoveChampionship,
                        );
                    }

                    return [];
                })
                .then(items => setChampionShips(items.map(mapChampionship)));
        }

        fetchList();
        const intrevalId = setInterval(() => fetchList(), 5000);
        return () => {
            clearInterval(intrevalId);
        };
    }, []);

    // Fetch user's coin objects
    async function getUserCoins() {
        const coins = await client.getCoins({owner: address || '', coinType: '0x2::sui::SUI'});
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
            const isFreeChampionship = Number(championship.entryFee) === 0;
            const paymentCoinId = await selectPaymentCoin(coins, Number(championship.entryFee));
            // We need a mutable reference to the coin and the championship object
            // So we pass them as objects in the transaction
            const champ = tx.object(championship.id);

            if (isFreeChampionship) {
                tx.moveCall({
                    target: `${PACKAGE_ID}::champion_ships::join_free`,
                    arguments: [champ],
                });
            } else {
                const [championshipFee] = tx.splitCoins(tx.gas, [Number(championship.entryFee)]);

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

    const renderJoinButtonText = (championship: Championship) => (
        championship.entryFee === 0 ? 'Free' : `Pay (${championship.entryFee / MIST_PER_SUI} SUI)`
    );

    return (
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
            {championShips.map((championship) => {
                const isParticipant = championship.participants.includes(address);
                return (
                    <Card style={{minWidth: 200, maxWidth: 200}} key={championship.id} isFooterBlurred
                          className="border-none" radius="lg">
                        <Image
                            alt="Woman listing to music"
                            className="object-cover"
                            height={200}
                            src="https://heroui.com/images/hero-card.jpeg"
                            width={200}
                        />
                        <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                            <p className="text-tiny text-white/60 uppercase font-bold">{championship.team_size}X{championship.team_size}</p>
                            <h4 className="text-white font-medium text-large">{championship.title}</h4>
                        </CardHeader>
                        <CardFooter className="flex justify-between ">
                            {/*<p className="text-tiny text-white/80">{championship.entryFee === 0 ? 'Free' : `Pay (${championship.entryFee / MIST_PER_SUI} SUI)`}</p>*/}
                            <Button
                                className="text-tiny text-white bg-black/20"
                                color="default"
                                radius="lg"
                                size="sm"
                                variant="flat"
                                onPress={() => isParticipant ? setOpenChampionshipCard(true) : joinChampionship(championship)}
                            >
                                {isParticipant
                                    ? 'Registered'
                                    : renderJoinButtonText(championship)}
                            </Button>
                            <Button
                                className="text-tiny text-white bg-black/20"
                                color="default"
                                radius="lg"
                                size="sm"
                                variant="flat"
                                onPress={() => setOpenChampionshipCard(true)}
                            >
                                View
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}
            <Modal open={openChampionshipCard} onChange={setOpenChampionshipCard} />
        </div>
    );
}
