import {Form} from "@heroui/form";
import {Input} from "@heroui/input";
import {Button} from "@heroui/button";
import {addToast} from "@heroui/react";

import {useTransaction} from "@/app/hooks";
import {Championship} from "@/types";

export const CreateChampionship = ({
                                       onSuccess,
                                   }: {
    onSuccess?: () => void;
}) => {
    const {createChampionship} = useTransaction();

    return (
        <Form
            className="w-full max-w-xs flex flex-col gap-4 justify-center items-center"
            onSubmit={async (e) => {
                e.preventDefault();
                const {
                    title,
                    description,
                    game,
                    teamSize,
                    entryFee,
                    joinersLimit,
                    discordLink,
                } = Object.fromEntries(new FormData(e.currentTarget)) as {
                    title: string,
                    description: string,
                    game: string,
                    teamSize: string,
                    entryFee: string,
                    joinersLimit: string,
                    discordLink: string,
                }

                await createChampionship(
                    title,
                    description,
                    game,
                    teamSize,
                    entryFee,
                    joinersLimit,
                    discordLink,
                );
                onSuccess?.();
                setTimeout(() => {
                    addToast({
                        title: "You created Championship",
                        description: `"${title}" has been created!`,
                        color: "primary",
                        variant: "solid",
                    });
                }, 1500);
            }}
        >
            <Input
                isRequired
                errorMessage="Please enter a valid title"
                label="Championship Title"
                labelPlacement="outside"
                name="title"
                placeholder="Enter your championship title"
                type="text"
            />

            <Input
                isRequired
                errorMessage="Please enter a valid description"
                label="Description"
                labelPlacement="outside"
                name="description"
                placeholder="Enter the championship description"
                type="text"
            />

            <Input
                isRequired
                errorMessage="Please enter a valid game"
                label="Game"
                labelPlacement="outside"
                name="game"
                placeholder="Enter the game name"
                type="text"
            />
            <Input
                isRequired
                errorMessage="Please enter Discord link"
                label="Discord link"
                labelPlacement="outside"
                name="discordLink"
                placeholder="Enter the Discord link"
                type="text"
            />

            <Input
                isRequired
                errorMessage="Please enter a valid team size"
                label="Team Size"
                labelPlacement="outside"
                name="teamSize"
                placeholder="e.g. 5"
                type="number"
            />

            <Input
                isRequired
                errorMessage="Please enter a valid entry fee"
                label="Entry Fee"
                labelPlacement="outside"
                name="entryFee"
                placeholder="e.g. 10"
                type="number"
            />

            <Input
                isRequired
                errorMessage="Please enter a valid joiners limit"
                label="Joiners Limit"
                labelPlacement="outside"
                name="joinersLimit"
                placeholder="e.g. 100"
                type="number"
            />

            <div className="flex gap-2">
                <Button color="primary" type="submit">
                    Submit
                </Button>
                <Button type="reset" variant="flat">
                    Reset
                </Button>
            </div>
        </Form>
    );
};
