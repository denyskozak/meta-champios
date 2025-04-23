"use client";
import React, {useMemo, useState} from "react";
import {Button, Divider} from "@heroui/react";
import {
    Progress,
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    addToast,
} from "@heroui/react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {useCurrentAccount} from "@mysten/dapp-kit";

import {useTransaction} from "@/app/hooks";
import {Championship as ChampionshipType} from "@/types";
import {CoinIcon} from "@/components/icons";
import {
    convertMistToSui, MIST_PER_SUI,
    renderJoinButtonText,
    renderStatus,
} from "@/utiltiies";
import {Modal} from "@/components/modal";
import {JoinChampionship} from "@/components/join-championship";
import {AddSponsor} from "@/components/add-sponsor";
import {CountdownTimer} from "@/components/countdown-timer";

interface IChampionship {
    data: ChampionshipType;
    onRefresh: () => void;
}

export function Championship({data, onRefresh}: IChampionship) {
    const account = useCurrentAccount();
    const address = account?.address;
    const router = useRouter();
    const {
        startChampionship,
        reportMatchResult,
        advanceToNextRound,
        finishChampionship,
    } = useTransaction();

    const [joinModalVisible, setJoinModalVisible] = useState(false);
    const [addSponsorVisible, setSponsorVisible] = useState(false);

    const isInTeam = useMemo(
        () => data.teams.some((team) => team.leaderAddress === address),
        [data.teams, address],
    );

    const allMatchesHaveWinner =
        data.bracket?.matches.every((match) => match.winnerLeaderAddress) || false;

    const noMatchesLeft = data.bracket?.matches.length !== data.winnersAmount &&
        data.bracket?.matches.every(match => match.winnerLeaderAddress);

    const isAdmin = data.admin.address === address;

    const isFull = data.teams.length === data.participantsLimit;

    const teamWinners = useMemo(() => {
        const winnerAddresses = new Set();

        data.bracket?.matches.forEach((match) => {
            winnerAddresses.add(match.winnerLeaderAddress);
        });

        const winnerTeams: string[] = [];

        data.teams.forEach((team) => {
            if (winnerAddresses.has(team.leaderAddress)) {
                winnerTeams.push(team.name);
            }
        });

        return winnerTeams;
    }, [data.status]);

    const renderYourTeam = (teamAddress: string) =>
        teamAddress === address ? (
            <span className="text-red-500">&nbsp;(You)</span>
        ) : null;

    const renderStatusText = (status: number): string => {
        switch (status) {
            case 0:
                return "wait to Start Date for tournament starts, admin contact you before";
                break;
            case 1:
                return "play your match and wait next round";
                break;
            case 2:
                return "tournament end, you can check results";
                break;
            default:
                return "";
        }
    };

    return (
        <div className="pb-6 min-w-[50vw]">
            <div className="flex flex-col gap-4">
                <div
                    className="p-4 z-0 flex flex-col relative justify-between gap-4 bg-content1 overflow-auto rounded-large shadow-small w-full">
                    <h1 className="text-lg font-semibold text-center">
                        Status: {renderStatus(data.status)}
                        <br />
                        {renderStatusText(data.status)}
                    </h1>
                    {data.status === 2 ? (
                        <h2 className="text-lg font-semibold text-center">
                            Winner Teams: {teamWinners.join(" ,")}
                        </h2>
                    ) : null}
                    {data.status === 0 &&
                        data.admin.address === address &&
                        data.teams.length === data.participantsLimit && (
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

                    {data.status === 0 && (
                        <Button
                            className=" shadow-lg overflow-hidden group "
                            disabled={Boolean(isInTeam)}
                            radius="lg"
                            size="lg"
                            onPress={() => {
                                if (!address) {
                                    addToast({
                                        title: "Connect required",
                                        description: "Use Connect button (top right)",
                                        color: "warning",
                                        variant: "solid",
                                    });

                                    return;
                                }
                                setJoinModalVisible(true);
                            }}
                        >
                            {!isInTeam && (
                                <span
                                    className="absolute inset-0 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-pulse opacity-100 group-hover:opacity-100 blur-md"/>
                            )}
                            <span className="relative z-10">
              {" "}
                                {isInTeam
                                    ? "You are Registered"
                                    : isFull ? 'Tournament is full' : `Register Your Team ${renderJoinButtonText(data)}`}
            </span>
                        </Button>
                    )}

                    {data.status === 0 || data.status === 1
                        ? (<Button
                            color="primary"
                            variant="solid"
                            onPress={() => {
                                if (!address) {
                                    addToast({
                                        title: "Connect required",
                                        description: "Use Connect button (top right)",
                                        color: "warning",
                                        variant: "solid",
                                    });

                                    return;
                                }
                                setSponsorVisible(true);
                            }}
                        >
                            Become Sponsor
                        </Button>)
                        : null}
                </div>

                {data.bracket && data.status === 1 && (
                    <div className="mt-6 flex gap-6 flex-col p-4 z-0 relative justify-between bg-content1 overflow-auto rounded-large shadow-smal">
                        <h2 className="text-lg font-semibold">Tournament Bracket</h2>
                        {data.bracket.matches.length === data.winnersAmount && (
                            <h3 className="text-lg font-semibold">Final Round!</h3>
                        )}
                        <Table aria-label="Bracket Table">
                            <TableHeader>
                                <TableColumn>Round</TableColumn>
                                <TableColumn>Team A</TableColumn>
                                <TableColumn>Team B</TableColumn>
                                <TableColumn>Winner</TableColumn>
                                <TableColumn>Actions</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {data.bracket.matches.map((match, index) => {
                                    const winner = match.winnerLeaderAddress
                                        ? [match.teamA, match.teamB].find(
                                        (team) =>
                                            team.leaderAddress === match.winnerLeaderAddress,
                                    )?.name || ""
                                        : "—";

                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{match.round}</TableCell>
                                            <TableCell>
                                                <code className="text-sm">
                                                    {match.teamA.name}
                                                    {renderYourTeam(match.teamA.leaderAddress)}
                                                </code>
                                            </TableCell>
                                            <TableCell>
                                                <code className="text-sm">
                                                    {match.teamB.name}
                                                    {renderYourTeam(match.teamB.leaderAddress)}
                                                </code>
                                            </TableCell>
                                            <TableCell>
                                                {match.winnerLeaderAddress ? (
                                                    <span className="text-green-600 font-semibold">
                            {winner}
                          </span>
                                                ) : (
                                                    <span className="text-gray-400">Pending</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="gap-2 flex">
                                                <Button
                                                    color="secondary"
                                                    onPress={async () => {
                                                        await reportMatchResult(
                                                            data.id,
                                                            index,
                                                            match.teamA.leaderAddress,
                                                        );
                                                        onRefresh();
                                                    }}
                                                >
                                                    {match.teamA.name} Win
                                                </Button>
                                                <Button
                                                    color="secondary"
                                                    onPress={async () => {
                                                        await reportMatchResult(
                                                            data.id,
                                                            index,
                                                            match.teamB.leaderAddress,
                                                        );
                                                        onRefresh();
                                                    }}
                                                >
                                                    {match.teamB.name} Win
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        {isAdmin && noMatchesLeft && (
                            <Button
                                onPress={async () => {
                                    await advanceToNextRound(data.id);
                                }}
                            >
                                Next Round
                            </Button>
                        )}

                        {isAdmin && allMatchesHaveWinner && (
                            <Button
                                onPress={async () => {
                                    await finishChampionship(data.id);
                                    onRefresh();
                                }}
                            >
                                Finish
                            </Button>
                        )}
                    </div>
                )}
                {

                    <div
                        className="mt-4 p-4 z-0 flex flex-col relative justify-between bg-content1 overflow-auto rounded-large shadow-small w-full">
                        {data.teams.length === 0
                            ? (<h2>No Teams Registered</h2>)
                            : (
                                <>
                                    <h2 className="text-lg font-semibold">Teams</h2>
                                    <Table aria-label="Teams Table">
                                        <TableHeader>
                                            <TableColumn>Name</TableColumn>
                                            <TableColumn>Lead Nickname</TableColumn>
                                            <TableColumn>Leader Address</TableColumn>
                                            <TableColumn>Teammates</TableColumn>
                                            {/*<TableColumn>Actions</TableColumn>*/}
                                        </TableHeader>

                                        <TableBody>
                                            {data.teams.map((team) => (
                                                <TableRow key={team.leaderAddress}>
                                                    <TableCell>
                                                        {team.name}
                                                        {renderYourTeam(team.leaderAddress)}
                                                    </TableCell>
                                                    <TableCell>{team.leadNickname}</TableCell>
                                                    <TableCell>{team.leaderAddress}</TableCell>
                                                    <TableCell>{team.teammateNicknames.join(", ")}</TableCell>
                                                    {/*<TableCell>*/}
                                                    {/*    {data.admin.address === address && (*/}
                                                    {/*        <Checkbox*/}
                                                    {/*            isSelected={selectedWinnerAddresses.includes(team.leaderAddress)}*/}
                                                    {/*            onChange={() => handleToggleWinner(team.leaderAddress)}*/}
                                                    {/*        >*/}
                                                    {/*            Mark as Winner*/}
                                                    {/*        </Checkbox>*/}
                                                    {/*    )}*/}
                                                    {/*</TableCell>*/}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </>
                            )}
                    </div>
                }

                <Table aria-label="Championship Info" hideHeader={true}>
                    <TableHeader>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>Value</TableColumn>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>Start Date</TableCell>
                            <TableCell><CountdownTimer date={data.dayStart} /></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Reward Per Winner</TableCell>
                            <TableCell className="flex gap-2">
                                {convertMistToSui(data.rewardPool?.value / data.winnersAmount)}{" "}
                                <CoinIcon/>
                                winners amount&nbsp;-&nbsp;{data.winnersAmount}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Reward Pool</TableCell>
                            <TableCell className="flex gap-2">
                                {convertMistToSui(data.rewardPool?.value)}{" "}
                                <CoinIcon/>
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
                        <TableRow>
                            <TableCell>Discord</TableCell>
                            <TableCell>
                                <Link
                                    className="text-red-600"
                                    href={data.discordLink}
                                    target="_blank"
                                >
                                    Link
                                </Link>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Admin</TableCell>
                            <TableCell>
                                {data.admin.nickname}
                            </TableCell>
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
                            <TableCell>Match type</TableCell>
                            <TableCell>{data.teamSize}x{data.teamSize}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Ticket Price</TableCell>
                            <TableCell className="flex gap-2">
                                {data.ticketPrice === 0 ? 'Free' : <>{convertMistToSui(data.ticketPrice)}{" "}<CoinIcon/></>}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Sponsors</TableCell>
                            <TableCell>
                                {data.sponsors.length
                                    ? data.sponsors.map(sponsor => <span
                                    key={`${sponsor.title}${sponsor.amount}`}>{sponsor.title} ({sponsor.amount / MIST_PER_SUI} coins)</span>)
                                    : <span>Empty</span>
                                }
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* Join Modal */}
                <Modal
                    actions={[]}
                    open={joinModalVisible}
                    size="sm"
                    title={`Join ${data?.title || ""}`}
                    onChange={setJoinModalVisible}
                >
                    {data ? (
                        <JoinChampionship championship={data} onJoin={onRefresh}/>
                    ) : null}
                </Modal>
                {/* Add Sponsor */}
                <Modal
                    actions={[]}
                    open={addSponsorVisible}
                    size="sm"
                    title="Become Sponsor"
                    onChange={setSponsorVisible}
                >
                    {data ? (
                        <AddSponsor championship={data} onAdd={onRefresh}/>
                    ) : null}
                </Modal>
            </div>
        </div>
    );
}
