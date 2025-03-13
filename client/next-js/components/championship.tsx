"use client";
import {Transaction} from "@mysten/sui/transactions";
import React, {useLayoutEffect, useState} from "react";
import {useZKLogin} from "react-sui-zk-login-kit";
import {SuiGraphQLClient} from "@mysten/sui/graphql";
import {graphql} from "@mysten/sui/graphql/schemas/latest";
import {Button} from "@heroui/button";
import {Card, CardFooter, CardHeader} from "@heroui/card";
import {Image} from "@heroui/image";
import {Modal} from "@/components/modal";
import {PACKAGE_ID} from "@/consts";
import { Championship, useTransaction } from "@/app/hooks";
import {Listbox, ListboxItem} from "@heroui/react";

import {CoinIcon} from "@/components/icons";
import {Checkbox, CheckboxGroup} from "@heroui/react";
import {renderStatus} from "@/utiltiies";

interface IChampionship {
    data: Championship;
}
export function Championship({ data }: IChampionship) {
    const {address} = useZKLogin();
    const {changeStatus, finishChampionship} = useTransaction();

    const [selectedWinnerAddresses, setSelectedWinnerAddresses] = useState<string[]>([]);

    const handleFinish = () => {
        if (data) {
            console.log('selectedWinnerAddresses ', selectedWinnerAddresses)
            finishChampionship(data?.id, selectedWinnerAddresses);
        }
    };

    return (
        <>
            <span>Status: {renderStatus(data.status)}</span>
            {data?.status === 0 && <Button onPress={() => changeStatus(data.id, 1)}>Start it!</Button>}
            <Listbox aria-label="Actions" onAction={(key) => alert(key)}>
                <ListboxItem key="new">ID: {data.id}</ListboxItem>
                <ListboxItem key="copy">Discord linkn: {data.discordLink}</ListboxItem>
                <ListboxItem key="a">Admin: {data.admin}</ListboxItem>
                <ListboxItem key="s">Title: {data.title}</ListboxItem>
                <ListboxItem key="d">Description: {data.description}</ListboxItem>
                <ListboxItem key="f">Game: {data.game}</ListboxItem>
                <ListboxItem key="v">Team Size: {data.teamSize}</ListboxItem>
                <ListboxItem key="c">Entry Fee: {data.entryFee} <CoinIcon/></ListboxItem>
                <ListboxItem key="x">Reward Pool: {data.rewardPool?.value} <CoinIcon/></ListboxItem>
                <ListboxItem key="z">Participants Limit: {data.participantsLimit}</ListboxItem>
                {/*<ListboxItem key="g" className="text-danger" color="danger">*/}
                {/*    Delete file*/}
                {/*</ListboxItem>*/}
            </Listbox>

            {/*If Admin*/}
            {data?.status === 1 && data?.admin === address
                ? (<p>
                    <span>Choose winners</span>
                    <CheckboxGroup defaultValue={[]} onChange={setSelectedWinnerAddresses} label="Select mutiple">
                        {data?.participants
                            ? data?.participants?.map((participant: string) => (
                                <Checkbox key={participant} value={participant}>{participant}</Checkbox>
                            ))
                            : []}
                    </CheckboxGroup>
                    <Button onPress={handleFinish}>Complete</Button>
                </p>)
                : null}
        </>
    );


}
