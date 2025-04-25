"use client";
import React, {useEffect, useLayoutEffect, useState} from "react";
import {SuiGraphQLClient} from "@mysten/sui/graphql";
import {graphql} from "@mysten/sui/graphql/schemas/latest";
import {
    Button, CircularProgress,
    Select,
    SelectItem,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react";
import {useRouter} from "next/navigation";

import {PACKAGE_ID} from "@/consts";
import {Championship} from "@/types";
import {
    convertMistToSui,
    mapChampionshipGraphQL,
    MoveChampionshipGraphQL,
    renderJoinButtonText,
    renderStatus,
} from "@/utiltiies";

const gqlClient = new SuiGraphQLClient({
    url: "https://sui-devnet.mystenlabs.com/graphql",
});

const objectType = `${PACKAGE_ID}::championship::Championship`;

async function getChampionships(game: string, after: string) {
    const chainIdentifierQuery = graphql(`
	query {
      objects(first: 10, ${after ? "after: $after," : ""} filter: {type: "${objectType}"}) {
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
        variables: {after},
    });

    return result.data;
}

// Sui JS SDK

// EXAMPLE: Connect to Sui testnet

interface ChampionshipsProps {
    game: string;
}

let storeChampionships: Championship[] = [];

export default function Championships({game}: ChampionshipsProps) {
    const router = useRouter();
    const [status, setStatus] = React.useState(0);
    const [pagination, setPagination] = useState({
        page: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        endCursor: "",
    });

    const [championships, setChampionships] = useState<Championship[]>([]);
    const [isLoading, setLoading] = useState(true);

    const fetchList = async (endCursor = "") => {
        const response = await getChampionships(game, endCursor);

        console.log("response?.objects ", response?.objects);
        if (response?.objects?.pageInfo) {
            setPagination((pag) => ({
                ...pag,
                hasNextPage: response?.objects?.pageInfo?.hasNextPage,
                endCursor: response?.objects?.pageInfo?.endCursor || "",
            }));
        }
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

            storeChampionships = items.map(mapChampionshipGraphQL);
            setChampionships(
                status === -1
                    ? storeChampionships
                    : storeChampionships.filter(
                        (item: Championship) => item.status === status,
                    ),
            );

            setTimeout(() => {
                setLoading(false);
            }, 1500);
        };

        initFetch();
        window.addEventListener("update-championships", initFetch);

        return () => {
            window.removeEventListener("update-championships", initFetch);
        };
    }, []);

    console.log("championships ", championships);
    useEffect(() => {
        setChampionships(
            status === -1
                ? storeChampionships
                : storeChampionships.filter(
                    (item: Championship) => item.status === status,
                ),
        );
    }, [status]);

    const loadMoreHandle = async () => {
        console.log("pagination.endCursor ", pagination.endCursor);
        const nextItems = await fetchList(pagination.endCursor);

        console.log("nextItems ", nextItems);
        setChampionships((list) => [
            ...list,
            // ...nextItems.filter(({status}) => status === 0 || status === 1)
            //     .map(mapChampionshipGraphQL)
        ]);
    };

    return (
        <div className="flex flex-col gap-4 items-center min-w-[60vw] h-[60vh] overflow-y-auto">
            <h1>{game}</h1>
            <Select
                className="max-w-xs"
                defaultSelectedKeys={["0"]}
                label="Status"
                name="status"
                placeholder="Select a status"
                onChange={(e) => {
                    setStatus(Number(e.target.value));
                }}
            >
                <SelectItem key={-1}>All</SelectItem>
                <SelectItem key={0}>Open</SelectItem>
                <SelectItem key={1}>On Going</SelectItem>
                <SelectItem key={2}>Finished</SelectItem>
            </Select>
            <div className="mt-6 flex gap-6 flex-col justify-center items-center">
                <h2 className="text-lg font-semibold">Championships</h2>
                {isLoading
                    ? (<CircularProgress aria-label="Loading..." color="primary"/>)
                    : (
                        championships.length === 0
                            ? (<h3>Empty</h3>)
                            : (<Table aria-label="Bracket Table">
                                <TableHeader>
                                    <TableColumn>Name</TableColumn>
                                    <TableColumn>Date start</TableColumn>
                                    <TableColumn>Ticket Price</TableColumn>
                                    <TableColumn>Status</TableColumn>
                                    <TableColumn>Team Size</TableColumn>
                                    <TableColumn>Reward Pool</TableColumn>
                                    <TableColumn>Winners amount</TableColumn>
                                    <TableColumn>Capability</TableColumn>
                                    <TableColumn>Actions</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {championships.map((championship) => {
                                        return (
                                            <TableRow key={championship.id}>
                                                <TableCell> {championship.title}</TableCell>
                                                <TableCell> {new Date(championship.dateStart).toLocaleString()}</TableCell>
                                                <TableCell> {renderJoinButtonText(championship)}</TableCell>
                                                <TableCell> {renderStatus(championship.status)}</TableCell>
                                                <TableCell>
                                                    {" "}
                                                    {championship.teamSize}X{championship.teamSize}
                                                </TableCell>
                                                <TableCell>
                                                    {" "}
                                                    {convertMistToSui(championship?.rewardPool?.value)}
                                                </TableCell>
                                                <TableCell>{championship?.winnersAmount}</TableCell>
                                                <TableCell>
                                                    {" "}
                                                    {championship.participantsLimit} /{" "}
                                                    {championship.teams.length}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="solid"
                                                        color="primary"
                                                        onPress={() => {
                                                            router.push(
                                                                `/championships/${game}/${championship.id}`,
                                                            );
                                                        }}
                                                    >
                                                        Open
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>))
                }
            </div>
            {/*<div className="flex flex-wrap gap-8 items-center justify-center">*/}
            {/*    {championships.map((championship) => {*/}
            {/*        return (*/}
            {/*            <Card*/}
            {/*                key={championship.id}*/}
            {/*                isPressable*/}
            {/*                className="border-none p-2"*/}
            {/*                radius="lg"*/}
            {/*                style={{minWidth: 200, maxWidth: 200}}*/}
            {/*                onPress={() => {*/}
            {/*                    router.push(`/championships/${game}/${championship.id}`);*/}
            {/*                }}*/}
            {/*            >*/}
            {/*                <Image*/}
            {/*                    alt="Woman listing to music"*/}
            {/*                    className="object-cover mt-10"*/}
            {/*                    height={200}*/}
            {/*                    src="/logo_LoL.png"*/}
            {/*                    width={200}*/}
            {/*                />*/}
            {/*                <CardHeader className="absolute z-10 top-1 flex-col !items-start">*/}
            {/*                    <p className="text-tiny text-white/60 uppercase font-bold">*/}
            {/*                        {championship.teamSize}X{championship.teamSize}*/}
            {/*                    </p>*/}
            {/*                    <h4 className="text-white font-medium text-large self-center">*/}
            {/*                        {championship.title}*/}
            {/*                    </h4>*/}
            {/*                </CardHeader>*/}
            {/*                <CardFooter className="flex justify-between ">*/}
            {/*                    <Chip*/}
            {/*                        color="warning"*/}
            {/*                        endContent={*/}
            {/*                            <CoinIcon className="text-danger" height={16} width={16}/>*/}
            {/*                        }*/}
            {/*                        size="lg"*/}
            {/*                        variant="shadow"*/}
            {/*                    >*/}
            {/*                        Prize:&nbsp;*/}
            {/*                        {convertMistToSui(championship?.rewardPool?.value)}*/}
            {/*                    </Chip>*/}
            {/*                </CardFooter>*/}
            {/*            </Card>*/}
            {/*        );*/}
            {/*    })}*/}
            {/*</div>*/}

            {championships.length && pagination.hasNextPage ? (
                <Button size="lg" onPress={loadMoreHandle}>
                    Load More
                </Button>
            ) : null}
        </div>
    );
}
