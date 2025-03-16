"use client";
import React, {useMemo, useState} from "react";
import {useZKLogin} from "react-sui-zk-login-kit";
import {Button} from "@heroui/button";
import {Listbox, ListboxItem} from "@heroui/react";
import {Checkbox, CheckboxGroup} from "@heroui/react";

import {useTransaction} from "@/app/hooks";
import {Championship as ChampionshipType} from "@/types";
import {CoinIcon} from "@/components/icons";
import {convertMistToSui, renderStatus} from "@/utiltiies";
import {Modal} from "@/components/modal";
import {JoinChampionship} from "@/components/join-championship";
import {Table, TableHeader, TableBody, TableColumn, TableRow, TableCell} from '@heroui/react';
import {useRouter} from "next/navigation";

interface IChampionship {
    data: ChampionshipType;
}

export function Championship({data}: IChampionship) {
    const {address} = useZKLogin();
    const router = useRouter();
    const {changeStatus, finishChampionship} = useTransaction();

    const [selectedWinnerAddresses, setSelectedWinnerAddresses] = useState<
        string[]
    >([]);
    const [joinModalVisible, setJoinModalVisible] = useState(false);

    const handleFinish = () => {
        if (data) {
            console.log("selectedWinnerAddresses ", selectedWinnerAddresses);
            finishChampionship(data?.id, selectedWinnerAddresses);
        }
    };

    const isParticipant = useMemo(() => data.participants.some(participant => participant.address === address), [data.participants]);
    const renderJoinButtonText = (championship: ChampionshipType) =>
        championship.entryFee === 0
            ? "Free"
            : `Join (${convertMistToSui(championship.entryFee)} coins)`;

    return (
        <div>
            <Button
                disabled={isParticipant}
                radius="lg"
                size="sm"
                variant="solid"
                color="secondary"
                onPress={() => {
                    router.push(`/championships/${data.game}`);
                }}
            >
                Back
            </Button>

            <div className="flex flex-col gap-4">
                <span>Status: {renderStatus(data.status)}</span>

                {data?.status === 0 && (
                    <Button variant="solid" color="primary" onPress={() => changeStatus(data.id, 1)}>Start it!</Button>
                )}

                <Button
                    disabled={isParticipant}
                    radius="lg"
                    size="sm"
                    variant="solid"
                    color="primary"
                    onPress={() => {
                        setJoinModalVisible(true);
                    }}
                >
                    {isParticipant
                        ? "Registered"
                        : renderJoinButtonText(data)}
                </Button>

                <Table aria-label="Information Table" hideHeader={true}>
                    <TableHeader>
                        <TableColumn>name</TableColumn>
                        <TableColumn>value</TableColumn>
                    </TableHeader>

                    <TableBody>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>{data.id}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Discord Link</TableCell>
                            <TableCell>{data.discordLink}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Admin</TableCell>
                            <TableCell>{data.admin}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>{data.title}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell>{data.description}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Game</TableCell>
                            <TableCell>{data.game}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Team Size</TableCell>
                            <TableCell>{data.teamSize}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Entry Fee</TableCell>
                            <TableCell className="flex gap-2">
                                {convertMistToSui(data.entryFee)} <CoinIcon/>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Reward Pool</TableCell>
                            <TableCell className="flex gap-2">
                                {convertMistToSui(data.rewardPool?.value)} <CoinIcon/>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Participants Limit</TableCell>
                            <TableCell>{data.participantsLimit}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>


                {/*If Admin*/}
                {data?.admin === address ? (
                    <p>
                        <span>Choose winners</span>
                        <CheckboxGroup
                            defaultValue={[]}
                            label="Select mutiple"
                            onChange={setSelectedWinnerAddresses}
                        >
                            {data?.participants
                                ? data?.participants?.map(({address, nickname}) => (
                                    <Checkbox key={address} value={address}>
                                        {nickname}
                                    </Checkbox>
                                ))
                                : []}
                        </CheckboxGroup>
                        {data?.status === 1 && <Button onPress={handleFinish}>Complete</Button>}
                    </p>
                ) : null}
                <Modal
                    size='sm'
                    actions={[]}
                    open={joinModalVisible}
                    title={`Join ${data?.title || ""}`}
                    onChange={setJoinModalVisible}
                >
                    {data ? (
                        <JoinChampionship championship={data}/>
                    ) : null}
                </Modal>
            </div>
        </div>
    );
}
