"use client";
import {Transaction} from "@mysten/sui/transactions";
import React, {useLayoutEffect, useState} from "react";
import {useZKLogin} from "react-sui-zk-login-kit";
import {SuiGraphQLClient} from "@mysten/sui/graphql";
import {graphql} from "@mysten/sui/graphql/schemas/latest";
import {Button} from "@heroui/button";
import {Card, CardFooter, CardHeader} from "@heroui/card";
import {Image} from "@heroui/image";
import {Modal} from "@/components/modal";
import {PACKAGE_ID} from "@/consts";
import { useTransaction } from "@/app/hooks";
import {Championship} from "@/types";
import { Championship as ChampionshipContent } from "@/components/championship";

const gqlClient = new SuiGraphQLClient({
    url: "https://sui-devnet.mystenlabs.com/graphql",
});


const objectType = `${PACKAGE_ID}::championship::Championship`;

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

interface MoveChampionship {
    description: string;
    entry_fee: string;
    game: string;
    id: string;
    participants: string[]; // Replace 'any[]' with a more specific type if needed
    reward_pool: {
        value: string;
    };
    status: number;
    team_size: string;
    discord_link: string;
    participants_limit: number;
    title: string;
    admin: string;
}

export default function Championships() {
    const {address} = useZKLogin();
    const {joinChampionship, finishChampionship} = useTransaction();

    const [championShips, setChampionShips] = useState<Championship[]>([]);
    const [selectedWinnerAddresses, setSelectedWinnerAddresses] = useState<string[]>([]);
    const [openChampionshipCard, setOpenChampionshipCard] = useState(false);
    const [selectedChampionship, setSelectedChampionship] = useState<Championship | null>(null)
    const mapChampionship = (item: MoveChampionship): Championship => {
        const {entry_fee, reward_pool, discord_link, participants_limit, team_size, status, ...props} = item;
        return {
            entryFee: Number(entry_fee),
            rewardPool: {
                value: Number(reward_pool?.value),
            },
            status: Number(status),
            teamSize: Number(team_size),
            participantsLimit: Number(participants_limit),
            discordLink: discord_link,
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
                .then(items => setChampionShips(
                    items
                        .filter(({status}) => status === 0 || status === 1)
                        .map(mapChampionship)));
        }

        fetchList();
        const intrevalId = setInterval(() => fetchList(), 5000);
        return () => {
            clearInterval(intrevalId);
        };
    }, []);


    const renderJoinButtonText = (championship: Championship) => (
        championship.entryFee === 0 ? 'Free' : `Join (${championship.entryFee} coins)`
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
                                onPress={() => {
                                    setSelectedChampionship(championship);
                                    // setSelectedChampionship(championship)
                                    setOpenChampionshipCard(true);
                                }}
                            >
                                View
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}
            {/*Detailed*/}
            <Modal
                actions={[]}
                title={selectedChampionship?.title || ''}
                open={openChampionshipCard}
                onChange={setOpenChampionshipCard}
            >
                {selectedChampionship ? <ChampionshipContent data={selectedChampionship}/> : null}
            </Modal>
            {/*Finish*/}

        </div>
    );


}
