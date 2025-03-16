import {Form} from "@heroui/form";
import {Input} from "@heroui/input";
import {Button} from "@heroui/button";
import {addToast} from "@heroui/react";

import {useTransaction} from "@/app/hooks";
import {Select, SelectItem} from "@heroui/react";
import {CoinIcon} from "@/components/icons";

export const games = [
    {key: "LoL", label: "League of Legends"},
];

export const CreateChampionship = ({
                                       onSuccess,
                                   }: {
    onSuccess?: () => void;
}) => {
    const {createChampionship} = useTransaction();

    return (
        <Form
            className="w-full max-w-xs flex flex-col gap-4 justify-center items-center "
            onSubmit={async (e) => {
                e.preventDefault();
                try {

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
                window.dispatchEvent(new Event('update-championships'))
                    addToast({
                        title: "You've created new championship",
                        description: `"${title}" has been created!`,
                        color: "primary",
                        variant: "solid",
                    });
                } catch (error) {
                    console.error('Crate Champ', error);
                    addToast({
                        title: "Fail to create championship",
                        description: "Something went wrong",
                        color: "danger",
                        variant: "solid",
                    });
                }
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

            {/*<Input*/}
            {/*    isRequired*/}
            {/*    errorMessage="Please enter a valid game"*/}
            {/*    label="Game"*/}
            {/*    labelPlacement="outside"*/}
            {/*    name="game"*/}
            {/*    placeholder="Enter the game name"*/}
            {/*    type="text"*/}
            {/*/>*/}

            <Select name="game" className="max-w-xs" label="Game" placeholder="Select a game">
                {games.map((game) => (
                    <SelectItem key={game.key}>{game.label}</SelectItem>
                ))}
            </Select>

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
                <Button color="primary" type="submit" className="gap-0">
                    Create (Pay 1&nbsp;<CoinIcon width={16} height={16} color="white" />)
                </Button>
                <Button type="reset" variant="flat">
                    Reset
                </Button>
            </div>
        </Form>
    );
};
