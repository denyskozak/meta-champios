import {Form} from "@heroui/form";
import {Input} from "@heroui/input";
import {Button} from "@heroui/button";
import {addToast} from "@heroui/react";
import {Select, SelectItem} from "@heroui/react";

import {useTransaction} from "@/app/hooks";
import {CoinIcon} from "@/components/icons";

export const games = [{key: "LoL", label: "League of Legends"}];

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
                        ticketPrice,
                        teamsLimit,
                        discordLink,
                        discordAdminName,
                        winnerAmount,
                        day_start,
                    } = Object.fromEntries(new FormData(e.currentTarget)) as {
                        title: string;
                        description: string;
                        game: string;
                        teamSize: string;
                        ticketPrice: string;
                        teamsLimit: string;
                        discordLink: string;
                        discordAdminName: string;
                        winnerAmount: string;
                        day_start: string;
                    };

                    if (Number(teamsLimit) % Number(winnerAmount) !== 0) {
                        addToast({
                            title: "Teams Limit should be divisible by Winner Amount",
                            color: "danger",
                            variant: "solid",
                        });
                    }

                    await createChampionship(
                        title,
                        description,
                        game,
                        teamSize,
                        ticketPrice,
                        teamsLimit,
                        discordLink,
                        discordAdminName,
                        winnerAmount,
                        day_start,
                    );
                    onSuccess?.();
                    window.dispatchEvent(new Event("update-championships"));
                    addToast({
                        title: "You've created new championship",
                        description: `"${title}" has been created!`,
                        color: "primary",
                        variant: "solid",
                    });
                } catch (error) {
                    console.error("Crate Champ", error);
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

            <Select
                className="max-w-xs"
                label="Game"
                name="game"
                placeholder="Select a game"
            >
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
                errorMessage="Please enter Discord Admin Name"
                label="Discord Admin Name"
                labelPlacement="outside"
                name="discordAdminName"
                placeholder="Enter the Discord Admin Name"
                type="text"
            />

            <Input
                isRequired
                defaultValue="5"
                errorMessage="Please enter a valid team size"
                label="Team Size"
                labelPlacement="outside"
                name="teamSize"
                placeholder="e.g. 5"
                type="number"
            />

            <Input
                isRequired
                defaultValue="5"
                errorMessage="Please enter a valid ticket price"
                label="Entry Ticket Price in Sui"
                labelPlacement="outside"
                name="ticketPrice"
                placeholder="e.g. 10 Sui"
                type="number"
            />

            <Input
                isRequired
                defaultValue="3"
                errorMessage="Please enter a valid winner amount"
                label="Winner amount"
                labelPlacement="outside"
                name="winnerAmount"
                placeholder="e.g. 100"
                type="number"
            />

            <Input
                isRequired
                defaultValue="24"
                errorMessage="Please enter a valid teans limit"
                label="Teams Limit"
                labelPlacement="outside"
                name="teamsLimit"
                placeholder="e.g. 24"
                type="number"
            />

            <Input
                isRequired
                defaultValue="10/10/2025"
                errorMessage="Please enter a valid Dat start"
                label="Day start"
                labelPlacement="outside"
                name="day_start"
                placeholder="e.g. 24"
                type="number"
            />

            <div className="flex gap-2">
                <Button className="gap-0" color="primary" type="submit">
                    Create (Pay 5&nbsp;
                    <CoinIcon color="white" height={16} width={16}/>)
                </Button>
                <Button type="reset" variant="flat">
                    Reset
                </Button>
            </div>
        </Form>
    );
};
