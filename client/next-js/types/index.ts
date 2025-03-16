import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Championship {
  description: string;
  entryFee: number;
  game: string;
  id: string;
  participants: {
    address: string;
    coinAmount: number;
    joinTime: number;
    nickname: string;
  }[];
  rewardPool: {
    value: number;
  };
  status: number;
  participantsLimit: number;
  teamSize: number;
  title: string;
  admin: string;
  discordLink: string;
}
