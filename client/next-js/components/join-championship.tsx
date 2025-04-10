import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { useZKLogin } from "react-sui-zk-login-kit";
import {Checkbox} from "@heroui/react";

import { useTransaction } from "@/app/hooks";
import { Championship } from "@/types";
import { convertMistToSui } from "@/utiltiies";
import Link from "next/link";
import {useState} from "react";

export const JoinChampionship = ({
  championship,
  onJoin,
}: {
  championship: Championship;
  onJoin: () => void;
}) => {
  const { address } = useZKLogin();
  const { joinChampionship } = useTransaction();
  const [isSelected, setIsSelected] = useState(false);

  const teammateFields = Array.from(
    { length: championship.teamSize - 1 },
    (_, i) => i,
  );

  return (
    <Form
      className="w-full max-w-xs flex flex-col gap-4 justify-center items-center"
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const teamName = formData.get("teamName") as string;
        const leadNickname = formData.get("leadNickname") as string;

        const teammateNicknames: string[] = teammateFields
          .map((i) => formData.get(`teammate_${i}`)?.toString().trim() ?? "")
          .filter((n) => n !== "");

        if (teammateNicknames.length !== championship.teamSize - 1) {
          addToast({
            title: "Incomplete team",
            description: `Please enter ${championship.teamSize - 1} teammate nickname(s)`,
            color: "danger",
            variant: "solid",
          });

          return;
        }

        try {
          if (championship.ticketPrice === 0) {
            const response = await fetch("/api/championships/join", {
              method: "POST",
              body: JSON.stringify({
                championshipId: championship.id,
                leaderAddress: address,
                teamName,
                leadNickname,
                teammateNicknames,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });
            
            if (!response.ok) {
              const error = await response.json();
              console.log('error ', error);

              throw new Error(error?.message);
            }
          } else {
            await joinChampionship(
              championship,
              teamName,
              leadNickname,
              teammateNicknames,
            );
          }
          addToast({
            title: `You have joined ${championship.title}`,
            color: "primary",
            variant: "solid",
          });
          onJoin();
        } catch (error) {
          addToast({
            title: "Join Failed",
            description: error ? String(error) : "Something went wrong",
            color: "danger",
            variant: "solid",
          });
        }
      }}
    >
      <Input
        isRequired
        errorMessage="Please enter a team name"
        label="Team Name"
        labelPlacement="outside"
        name="teamName"
        placeholder="Enter Team Name"
        type="text"
      />
      <Input
        isRequired
        errorMessage="Please enter a valid nickname"
        label="Leader nickname"
        labelPlacement="outside"
        name="leadNickname"
        placeholder="Enter leader nickname"
        type="text"
      />

      {teammateFields.map((i) => (
        <Input
          key={i}
          isRequired
          errorMessage="Please enter teammate nickname"
          label={`Teammate #${i + 1}`}
          labelPlacement="outside"
          name={`teammate_${i}`}
          placeholder="Enter teammate nickname"
          type="text"
        />
      ))}

      <Checkbox isSelected={isSelected} onValueChange={setIsSelected}>
        Read Rules
      </Checkbox>
      <Link className="text-red-500" href="/rules" target="_blank">Rules Link</Link>
      <Button color="primary" disabled={!isSelected} type="submit">
        Join (
        {championship.ticketPrice > 0
          ? `${convertMistToSui(championship.ticketPrice)} Sui`
          : "Free"}
        )
      </Button>
    </Form>
  );
};
