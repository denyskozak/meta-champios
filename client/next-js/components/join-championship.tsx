import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";

import { useTransaction } from "@/app/hooks";
import { Championship } from "@/types";

export const JoinChampionship = ({
  championship,
}: {
  championship: Championship;
}) => {
  const { joinChampionship } = useTransaction();

  return (
    <Form
      className="w-full max-w-xs flex flex-col gap-4 justify-center items-center"
      onSubmit={async (e) => {
        e.preventDefault();
        const { nickname } = Object.fromEntries(
          new FormData(e.currentTarget),
        ) as {
          nickname: string;
        };

        await joinChampionship(championship, nickname);
        addToast({
          title: `You have joined ${championship.title}`,
          color: "primary",
          variant: "solid",
        });
      }}
    >
      <Input
        isRequired
        errorMessage="Please enter a valid nickname"
        label="Your game nickname"
        labelPlacement="outside"
        name="nickname"
        placeholder="Enter nickname"
        type="text"
      />
      <Button color="primary" type="submit">
        Join (
        {championship.entryFee > 0 ? `$MW ${championship.entryFee}` : "Free"})
      </Button>
    </Form>
  );
};
