import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Championship {
  description: string;
  entryFee: number;
  game: string;
  id: string;
  participants: any[]; // Replace 'any[]' with a more specific type if needed
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
