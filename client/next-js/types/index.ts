import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Team {
  name: string;
  leaderAddress: string;
  leadNickname: string;
  teammateNicknames: string[];
}

export interface Championship {
  id: string;
  title: string;
  description: string;
  gameName: string;
  dayStart: string;
  ticketPrice: number; // ticket_price
  rewardPool: {
    value: number;
  };
  status: number; // 0 = Open, 1 = Ongoing, 2 = Closed
  teamSize: number; // team_size
  participantsLimit: number; // teams_limit
  winnersAmount: number;
  discordLink: string; // discord_chat_link
  admin: {
    address: string;
    nickname: string;
  };
  teams: Team[];
  bracket?: {
    currentRound: number;
    matches: {
      teamA: Team;
      teamB: Team;
      winnerLeaderAddress: string | null;
      round: number;
    }[];
  };
}
