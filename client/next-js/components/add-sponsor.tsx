import {Form} from "@heroui/form";
import {Input} from "@heroui/input";
import {Button} from "@heroui/button";
import {addToast} from "@heroui/react";
import {Checkbox} from "@heroui/react";
import Link from "next/link";
import {useState} from "react";
import {useCurrentAccount} from "@mysten/dapp-kit";

import {useTransaction} from "@/app/hooks";
import {Championship} from "@/types";
import {convertMistToSui} from "@/utiltiies";

export const AddSponsor = ({
                               championship,
                               onAdd,
                           }: {
    championship: Championship;
    onAdd: (title: string) => void;
}) => {
    const {addSponsor} = useTransaction();
    const [added, setAdded] = useState(false);

    if (added) {
        return (
            <div>
                <h1>Sponsor is added</h1>
            </div>
        );
    }

    return (
        <Form
            className="w-full max-w-xs flex flex-col gap-4 justify-center items-center"
            onSubmit={async (e) => {
                e.preventDefault();

                const formData = new FormData(e.currentTarget);
                const title = formData.get("title") as string;
                const amount = formData.get("amount") as string;

                await addSponsor(championship.id, title, amount);
                setAdded(true);
                addToast({
                    title: `Sponsor ${title} has added`,
                    color: "primary",
                    variant: "solid",
                });
                onAdd(title);
            }}
        >
            <Input
                isRequired
                errorMessage="Please enter a title"
                label="Title"
                labelPlacement="outside"
                name="title"
                placeholder="Enter Title"
                type="text"
            />
            <Input
                isRequired
                defaultValue="10"
                errorMessage="Please enter a Sui amount"
                label="Sui amount"
                labelPlacement="outside"
                name="amount"
                placeholder="Enter Sui amount"
                type="number"
            />

            <Button color="primary" type="submit">
                Add
            </Button>
        </Form>
    );
};
