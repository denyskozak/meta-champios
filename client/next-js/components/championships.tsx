"use client";
import React, {useLayoutEffect, useState} from "react";
import {useZKLogin} from "react-sui-zk-login-kit";
import {SuiGraphQLClient} from "@mysten/sui/graphql";
import {graphql} from "@mysten/sui/graphql/schemas/latest";
import {Button} from "@heroui/react";
import {Card, CardFooter, CardHeader} from "@heroui/card";
import {Image} from "@heroui/image";

import {Modal} from "@/components/modal";
import {PACKAGE_ID} from "@/consts";
import {useTransaction} from "@/app/hooks";
import {Championship} from "@/types";
import {Championship as ChampionshipContent} from "@/components/championship";
import {JoinChampionship} from "@/components/join-championship";
import {CoinIcon} from "@/components/icons";
import {convertMistToSui, mapChampionshipGraphQL, MoveChampionshipGraphQL} from "@/utiltiies";
import {useRouter} from "next/navigation";

const gqlClient = new SuiGraphQLClient({
    url: "https://sui-devnet.mystenlabs.com/graphql",
});

const objectType = `${PACKAGE_ID}::championship::Championship`;


async function getChampionships(game: string, after: string) {
    const chainIdentifierQuery = graphql(`
	query () {
      objects(first: 10, filter: {type: "${objectType}"}) {
        pageInfo {
          hasNextPage
          endCursor
        }
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

    const result = await gqlClient.query({
        query: chainIdentifierQuery,
        variables: {after: null}
    });

    return result.data;
}

// Sui JS SDK

// EXAMPLE: Connect to Sui testnet


interface ChampionshipsProps {
    game: string;
}

export default function Championships({ game }: ChampionshipsProps) {
    const {address} = useZKLogin();
    const router = useRouter();
    const {joinChampionship, finishChampionship} = useTransaction();
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pagination, setPagination] = useState({
        page: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        endCursor: '',
    });

    const [championShips, setChampionShips] = useState<Championship[]>([]);

    const fetchList = async (endCursor = '') => {
        const response = await getChampionships(game, endCursor)

        // if (response?.objects?.pageInfo) {
        //     setPagination((pag) => ({
        //         ...pag,
        //         hasNextPage: response?.objects?.pageInfo?.hasNextPage,
        //         endCursor: response?.objects?.pageInfo?.endCursor || ''
        //     }))
        // }
        if (response?.objects?.nodes) {
            return response?.objects?.nodes?.map(
                (object): MoveChampionshipGraphQL =>
                    object?.asMoveObject?.contents?.json as MoveChampionshipGraphQL,
            );
        }
        return [];
    };


    useLayoutEffect(() => {
        const initFetch = async () => {
            const items = await fetchList();
            setChampionShips(
                items
                    .map(mapChampionshipGraphQL),
            )
        }

        initFetch()
        window.addEventListener('update-championships', initFetch);
        return () => {

            window.removeEventListener('update-championships', initFetch);
        }
    }, []);

    const loadMoreHandle = async () => {
        const nextItems = await fetchList(pagination.endCursor);
        setChampionShips((list) => [
            ...list,
            ...nextItems.filter(({status}) => status === 0 || status === 1)
                .map(mapChampionshipGraphQL)
        ]);
    }

    return (
        <div className="flex flex-col gap-8 items-center justify-center">
            <div className="flex flex-wrap gap-8 items-center justify-center">
                <h1>{game}</h1>
                {championShips.map((championship) => {

                    return (
                        <Card
                            key={championship.id}
                            isFooterBlurred
                            className="border-none p-2"
                            radius="lg"
                            style={{minWidth: 200, maxWidth: 200}}
                            isPressable
                            onPress={() => {
                                router.push(`/championships/${championship.id}`)
                            }}
                        >
                            <Image
                                alt="Woman listing to music"
                                className="object-cover mt-10"
                                height={200}
                                src="/logo_LoL.png"
                                width={200}
                            />
                            <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                                <p className="text-tiny text-white/60 uppercase font-bold">
                                    {championship.teamSize}X{championship.teamSize}
                                </p>
                                <h4 className="text-white font-medium text-large self-center">
                                    {championship.title}
                                </h4>
                            </CardHeader>
                            <CardFooter className="flex justify-between ">

                                <Button
                                    className="text-tiny text-white bg-black/20"
                                    color="default"
                                    radius="lg"
                                    size="sm"
                                    variant="flat"
                                >
                                    Prize:
                                    <CoinIcon className="text-danger"/>
                                    {convertMistToSui(championship?.rewardPool?.value)}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {
                championShips.length
                    ? <Button disabled={!pagination.hasNextPage} size="lg" onPress={loadMoreHandle}>Load More</Button>
                    : null
            }


        </div>
    );
}
