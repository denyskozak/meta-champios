import {Championship} from "@/types";

export const MIST_PER_SUI = 1000000000;

export function convertMistToSui(suiAmount?: number) {
    if (suiAmount === undefined) return '0';

    return (suiAmount / MIST_PER_SUI).toFixed(2);
}

export const renderStatus = (status: number): string => {
    switch (status) {
        case 0:
            return "Open (wait new joiners, you can start with button below)";
            break;
        case 1:
            return "On-going (started, wait to choose winners and complete)";
            break;
        case 2:
            return "Done";
            break;
        default:
            return "Unknown";
    }
};

// map champ

export interface MoveChampionshipGraphQL {
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
    discord_link: string;
    participants_limit: number;
    title: string;
    admin: string;
}

export const mapChampionshipGraphQL = (item: MoveChampionshipGraphQL): Championship => {
    const {
        entry_fee,
        reward_pool,
        discord_link,
        participants_limit,
        team_size,
        status,
        ...props
    } = item;

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
    };
};

export interface MoveChampionshipRPC {
    description: string;
    entry_fee: string;
    game: string;
    id: {
        id: string
    };
    participants: {
        fields: {
            address: string;
            coin_amount: string;
            join_time: string;
            nickname: string;
        };
    }[];
    reward_pool: string;
    status: number;
    team_size: string;
    discord_link: string;
    participants_limit: number;
    title: string;
    admin: string;
}


export const mapChampionshipRPC = (item: MoveChampionshipRPC): Championship => {
    const {
        id,
        entry_fee,
        reward_pool,
        discord_link,
        participants_limit,
        team_size,
        status,
        participants,
        ...props
    } = item;

    return {
        id: id.id,
        entryFee: Number(entry_fee),
        rewardPool: {
            value: Number(reward_pool),
        },
        status: Number(status),
        teamSize: Number(team_size),
        participantsLimit: Number(participants_limit),
        discordLink: discord_link,
        participants: participants.map(({fields: {address, coin_amount, join_time, nickname}}) => ({
            address,
            coinAmount: Number(coin_amount),
            joinTime: Number(join_time),
            nickname
        })),
        ...props,
    };
};
