import { Championship } from "@/types";

export const MIST_PER_SUI = 1000000000;

export function convertMistToSui(suiAmount?: number) {
  if (suiAmount === undefined) return "0";

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
  id: string;
  title: string;
  description: string;
  game_name: string;
  ticket_price: string;
  reward_pool: {
    value: string;
  };
  admin: {
    address: string;
    discord_nickname: string;
  };
  discord_chat_link: string;
  team_size: string;
  teams_limit: number;
  teams: {
    leader_address: string;
    lead_nickname: string;
    teammate_nicknames: string[];
  }[];
  bracket?: {
    matches: {
      team_a: string;
      team_b: string;
      winner: string | null;
      round: string;
    }[];
    current_round: string;
  };
  status: number;
}

export const mapChampionshipGraphQL = (
    item: MoveChampionshipGraphQL,
): Championship => {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    gameName: item.game_name,
    ticketPrice: Number(item.ticket_price),
    rewardPool: {
      value: Number(item.reward_pool?.value),
    },
    status: Number(item.status),
    teamSize: Number(item.team_size),
    participantsLimit: Number(item.teams_limit),
    discordLink: item.discord_chat_link,
    admin: {
      address: item.admin.address,
      nickname: item.admin.discord_nickname,
    },
    teams: item.teams.map((team) => ({
      leaderAddress: team.leader_address,
      leadNickname: team.lead_nickname,
      teammateNicknames: team.teammate_nicknames,
    })),
    bracket: item.bracket
        ? {
          currentRound: Number(item.bracket.current_round),
          matches: item.bracket.matches.map((match) => ({
            teamA: match.team_a,
            teamB: match.team_b,
            winner: match.winner ?? null,
            round: Number(match.round),
          })),
        }
        : undefined,
  };
};
export interface MoveChampionshipRPC {
  id: { id: string };
  title: string;
  description: string;
  game_name: string;
  ticket_price: string;
  reward_pool: string;
  admin: {
    fields: {
      address: string;
      discord_nickname: string;
    };
  };
  discord_chat_link: string;
  team_size: string;
  teams_limit: number;
  teams: {
    fields: {
      leader_address: string;
      lead_nickname: string;
      teammate_nicknames: string[];
    };
  }[];
  bracket?: {
    fields: {
      current_round: string;
      matches: {
        fields: {
          team_a: string;
          team_b: string;
          winner: string | null;
          round: string;
        };
      }[];
    };
  };
  status: number;
}

export const mapChampionshipRPC = (item: MoveChampionshipRPC): Championship => {
  return {
    id: item.id.id,
    title: item.title,
    description: item.description,
    gameName: item.game_name,
    ticketPrice: Number(item.ticket_price),
    rewardPool: {
      value: Number(item.reward_pool),
    },
    status: Number(item.status),
    teamSize: Number(item.team_size),
    participantsLimit: Number(item.teams_limit),
    discordLink: item.discord_chat_link,
    admin: {
      address: item.admin.fields.address,
      nickname: item.admin.fields.discord_nickname,
    },
    teams: item.teams.map(({ fields }) => ({
      leaderAddress: fields.leader_address,
      leadNickname: fields.lead_nickname,
      teammateNicknames: fields.teammate_nicknames,
    })),
    bracket: item.bracket
        ? {
          currentRound: Number(item.bracket.fields.current_round),
          matches: item.bracket.fields.matches.map(({ fields }) => ({
            teamA: fields.team_a,
            teamB: fields.team_b,
            winner: fields.winner ?? null,
            round: Number(fields.round),
          })),
        }
        : undefined,
  };
};
