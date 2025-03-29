import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Championship {
  id: string;
  title: string;
  description: string;
  gameName: string;
  ticketPrice: number; // ticket_price
  rewardPool: {
    value: number;
  };
  status: number; // 0 = Open, 1 = Ongoing, 2 = Closed
  teamSize: number; // team_size
  participantsLimit: number; // teams_limit
  discordLink: string; // discord_chat_link
  admin: {
    address: string;
    nickname: string;
  };
  teams: {
    leaderAddress: string;
    leadNickname: string;
    teammateNicknames: string[];
  }[];
  bracket?: {
    currentRound: number;
    matches: {
      teamA: string;
      teamB: string;
      winner: string | null;
      round: number;
    }[];
  };
}
