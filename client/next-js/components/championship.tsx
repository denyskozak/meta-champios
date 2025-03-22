"use client";
import React, {useMemo, useState} from "react";
import {useZKLogin} from "react-sui-zk-login-kit";
import {Button} from "@heroui/button";
import {Checkbox, CheckboxGroup, Progress} from "@heroui/react";
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
} from "@heroui/react";
import {useRouter} from "next/navigation";

import {useTransaction} from "@/app/hooks";
import {Championship as ChampionshipType} from "@/types";
import {CoinIcon} from "@/components/icons";
import {convertMistToSui, renderStatus} from "@/utiltiies";
import {Modal} from "@/components/modal";
import {JoinChampionship} from "@/components/join-championship";

interface IChampionship {
    data: ChampionshipType;
    onRefresh: () => void;
}

export function Championship({data, onRefresh}: IChampionship) {
    const {address} = useZKLogin();
    const router = useRouter();
    const {changeStatus, finishChampionship} = useTransaction();

    const [selectedWinnerAddresses, setSelectedWinnerAddresses] = useState<
        string[]
    >([]);
    const [joinModalVisible, setJoinModalVisible] = useState(false);

    const handleFinish = async  () => {
        if (data) {
           await finishChampionship(data?.id, selectedWinnerAddresses);
           onRefresh();
        }
    };

    const handleToggleWinner = (address: string) => {
        const exist = selectedWinnerAddresses.some(winnerAddress => address === winnerAddress);
        if (exist) {
            setSelectedWinnerAddresses(addresses => addresses.filter(winnerAddress => winnerAddress === address))
        } else {
            setSelectedWinnerAddresses([...selectedWinnerAddresses, address]);
        }
    };

    const isParticipant = useMemo(
        () =>
            data.participants.some((participant) => participant.address === address),
        [data.participants],
    );
    const renderJoinButtonText = (championship: ChampionshipType) =>
        championship.entryFee === 0
            ? "Free"
            : `Join (${convertMistToSui(championship.entryFee)} coins)`;

    return (
        <div>
            <Button
                color="secondary"
                disabled={isParticipant}
                radius="lg"
                size="sm"
                variant="solid"
                onPress={() => {
                    router.push(`/championships/${data.game}`);
                }}
            >
                Back
            </Button>

            <div className="flex flex-col gap-4">
                <span>Status: {renderStatus(data.status)}</span>

                {data?.status === 0 && data.admin === address && (
                    <Button
                        color="primary"
                        variant="solid"
                        onPress={async () => {
                           await changeStatus(data.id, 1);
                            onRefresh();
                        }}
                    >
                        Start it!
                    </Button>
                )}

                <Button
                    color="primary"
                    disabled={isParticipant}
                    radius="lg"
                    size="sm"
                    variant="solid"
                    onPress={() => {
                        setJoinModalVisible(true);
                    }}
                >
                    {isParticipant ? "You are Registered" : renderJoinButtonText(data)}
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
                            <TableCell>Participants</TableCell>
                            <TableCell>
                                <Progress
                                    classNames={{
                                        base: "max-w-md",
                                        track: "drop-shadow-md border border-default",
                                        indicator: "bg-gradient-to-r from-pink-500 to-yellow-500",
                                        label: "tracking-wider font-medium text-default-600",
                                        value: "text-foreground/60",
                                    }}
                                    label={`Capability ${data.participantsLimit}`}
                                    radius="sm"
                                    showValueLabel={true}
                                    size="sm"
                                    value={data.participants.length === 0 ? 0 : (data.participants.length / data.participantsLimit) * 100}
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/*If Admin*/}
                <Table aria-label="Information Table">
                    <TableHeader>
                        <TableColumn>Nickname</TableColumn>
                        <TableColumn>Address</TableColumn>
                        <TableColumn>Actions</TableColumn>
                    </TableHeader>

                    <TableBody>
                        {data?.participants
                            ? data?.participants?.map(({address, nickname}) => (

                                <TableRow   key={address}>
                                    <TableCell>{nickname}</TableCell>
                                    <TableCell>{address}</TableCell>
                                    <TableCell>
                                        {data?.admin === address && data.status === 1
                                            ? (
                                                <Checkbox key={address} onChange={() => {
                                                    handleToggleWinner(address);
                                                }} value={address}>
                                                    Mark as Winner
                                                </Checkbox>
                                            )
                                            : null
                                        }
                                    </TableCell>
                                </TableRow>

                            ))
                            : []}

                    </TableBody>
                </Table>

                {data?.admin === address && data?.status === 1 ? (
                    <Button onPress={handleFinish} disabled={selectedWinnerAddresses.length === 0}>Complete</Button>
                ) : null}
                <Modal
                    actions={[]}
                    open={joinModalVisible}
                    size="sm"
                    title={`Join ${data?.title || ""}`}
                    onChange={setJoinModalVisible}
                >
                    {data ? <JoinChampionship championship={data} onJoin={onRefresh}/> : null}
                </Modal>
            </div>
        </div>
    );
}
