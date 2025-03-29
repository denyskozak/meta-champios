"use client";
import React, {useMemo, useState} from "react";
import {useZKLogin} from "react-sui-zk-login-kit";
import {Button} from "@heroui/button";
import {Checkbox, Progress, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell} from "@heroui/react";
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
    const {startChampionship, finishChampionship} = useTransaction();

    const [selectedWinnerAddresses, setSelectedWinnerAddresses] = useState<string[]>([]);
    const [joinModalVisible, setJoinModalVisible] = useState(false);

    const handleFinish = async () => {
        if (data) {
            await finishChampionship(data?.id, selectedWinnerAddresses);
            onRefresh();
        }
    };

    const handleToggleWinner = (teamAddress: string) => {
        setSelectedWinnerAddresses((prev) =>
            prev.includes(teamAddress)
                ? prev.filter((addr) => addr !== teamAddress)
                : [...prev, teamAddress]
        );
    };

    const isInTeam = useMemo(
        () => data.teams.some((team) => team.leaderAddress === address),
        [data.teams, address]
    );

    const renderJoinButtonText = (championship: ChampionshipType) =>
        championship.ticketPrice === 0
            ? "Join (Free)"
            : `Join (${convertMistToSui(championship.ticketPrice)} coins)`;

    return (
        <div className="mb-6 mt-6">
            <Button
                color="secondary"
                radius="lg"
                size="sm"
                variant="solid"
                onPress={() => {
                    router.push(`/championships/${data.gameName}`);
                }}
            >
                Back
            </Button>

            <div className="flex flex-col gap-4">
                <h1 className="text-lg font-semibold text-center" >Status: {renderStatus(data.status)}</h1>

                {data.status === 0 && data.admin.address === address && (
                    <Button
                        color="primary"
                        variant="solid"
                        onPress={async () => {
                            await startChampionship(data.id);
                            onRefresh();
                        }}
                    >
                        Start it!
                    </Button>
                )}

                <Button
                    color="primary"
                    disabled={isInTeam}
                    radius="lg"
                    size="sm"
                    variant="solid"
                    onPress={() => {
                        setJoinModalVisible(true);
                    }}
                >
                    {isInTeam ? "You are Registered" : renderJoinButtonText(data)}
                </Button>

                {data.bracket && (
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold">Tournament Bracket</h2>
                        <Table aria-label="Bracket Table">
                            <TableHeader>
                                <TableColumn>Round</TableColumn>
                                <TableColumn>Team A</TableColumn>
                                <TableColumn>Team B</TableColumn>
                                <TableColumn>Winner</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {data.bracket.matches.map((match, index) => {
                                    const winner = match.winner
                                        ? match.winner === match.teamA
                                            ? "Team A"
                                            : "Team B"
                                        : "—";
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{match.round}</TableCell>
                                            <TableCell>
                                                <code className="text-sm">{match.teamA}</code>
                                            </TableCell>
                                            <TableCell>
                                                <code className="text-sm">{match.teamB}</code>
                                            </TableCell>
                                            <TableCell>
                                                {match.winner ? (
                                                    <span className="text-green-600 font-semibold">{winner}</span>
                                                ) : (
                                                    <span className="text-gray-400">Pending</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
                {data.admin.address === address && (
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold">Teams</h2>
                        <Table aria-label="Teams Table">
                            <TableHeader>
                                <TableColumn>Lead Nickname</TableColumn>
                                <TableColumn>Leader Address</TableColumn>
                                <TableColumn>Teammates</TableColumn>
                                <TableColumn>Actions</TableColumn>
                            </TableHeader>

                            <TableBody>
                                {data.teams.map((team) => (
                                    <TableRow key={team.leaderAddress}>
                                        <TableCell>{team.leadNickname}</TableCell>
                                        <TableCell>{team.leaderAddress}</TableCell>
                                        <TableCell>{team.teammateNicknames.join(", ")}</TableCell>
                                        <TableCell>
                                            {data.status === 1 && (
                                                <Checkbox
                                                    isSelected={selectedWinnerAddresses.includes(team.leaderAddress)}
                                                    onChange={() => handleToggleWinner(team.leaderAddress)}
                                                >
                                                    Mark as Winner
                                                </Checkbox>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                <Table aria-label="Championship Info" hideHeader={true}>
                    <TableHeader>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>Value</TableColumn>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>{data.id}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Discord</TableCell>
                            <TableCell>{data.discordLink}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Admin</TableCell>
                            <TableCell>{data.admin.nickname} ({data.admin.address})</TableCell>
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
                            <TableCell>{data.gameName}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Team Size</TableCell>
                            <TableCell>{data.teamSize}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Entry Fee</TableCell>
                            <TableCell className="flex gap-2">
                                {convertMistToSui(data.ticketPrice)} <CoinIcon/>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Reward Pool</TableCell>
                            <TableCell className="flex gap-2">
                                {convertMistToSui(data.rewardPool?.value)} <CoinIcon/>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Teams</TableCell>
                            <TableCell>
                                <Progress
                                    classNames={{
                                        base: "max-w-md",
                                        track: "drop-shadow-md border border-default",
                                        indicator: "bg-gradient-to-r from-pink-500 to-yellow-500",
                                        label: "tracking-wider font-medium text-default-600",
                                        value: "text-foreground/60",
                                    }}
                                    label={`Capacity ${data.participantsLimit}`}
                                    radius="sm"
                                    showValueLabel={true}
                                    size="sm"
                                    value={
                                        data.teams.length === 0
                                            ? 0
                                            : (data.teams.length / data.participantsLimit) * 100
                                    }
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>


                {/* Complete button for admin during status 1 (ongoing) */}
                {data.admin.address === address && data.status === 1 && (
                    <Button
                        onPress={handleFinish}
                        disabled={selectedWinnerAddresses.length === 0}
                    >
                        Complete Championship
                    </Button>
                )}

                {/* Join Modal */}
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
