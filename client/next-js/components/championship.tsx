"use client";
import React, { useState } from "react";
import { useZKLogin } from "react-sui-zk-login-kit";
import { Button } from "@heroui/button";
import { Listbox, ListboxItem } from "@heroui/react";
import { Checkbox, CheckboxGroup } from "@heroui/react";

import { useTransaction } from "@/app/hooks";
import { Championship as ChampionshipType } from "@/types";
import { CoinIcon } from "@/components/icons";
import {convertMistToSui, renderStatus} from "@/utiltiies";
import {Modal} from "@/components/modal";
import {JoinChampionship} from "@/components/join-championship";

interface IChampionship {
  data: ChampionshipType;
}
export function Championship({ data }: IChampionship) {
  const { address } = useZKLogin();
  const { changeStatus, finishChampionship } = useTransaction();

  const [selectedWinnerAddresses, setSelectedWinnerAddresses] = useState<
    string[]
  >([]);
  const [joinModalVisible, setJoinModalVisible] = useState(false);

  const handleFinish = () => {
    if (data) {
      console.log("selectedWinnerAddresses ", selectedWinnerAddresses);
      finishChampionship(data?.id, selectedWinnerAddresses);
    }
  };

  const isParticipant = data.participants.includes(address);
  const renderJoinButtonText = (championship: ChampionshipType) =>
      championship.entryFee === 0
          ? "Free"
          : `Join (${convertMistToSui(championship.entryFee)} coins)`;

  return (
    <div>
      <span>Status: {renderStatus(data.status)}</span>
        <br />
      {data?.status === 0 && (
        <Button variant="solid" color="primary" onPress={() => changeStatus(data.id, 1)}>Start it!</Button>
      )}
        <br />
      <Button
          className="text-tiny text-white bg-black/20"
          disabled={isParticipant}
          radius="lg"
          size="sm"
          variant="solid"
          color="primary"
          onPress={() => {
            setJoinModalVisible(true);
          }}
      >
        {isParticipant
            ? "Registered"
            : renderJoinButtonText(data)}
      </Button>

      <Listbox aria-label="Actions">
        <ListboxItem key="new">ID: {data.id}</ListboxItem>
        <ListboxItem key="copy">Discord linkn: {data.discordLink}</ListboxItem>
        <ListboxItem key="a">Admin: {data.admin}</ListboxItem>
        <ListboxItem key="s">Title: {data.title}</ListboxItem>
        <ListboxItem key="d">Description: {data.description}</ListboxItem>
        <ListboxItem key="f">Game: {data.game}</ListboxItem>
        <ListboxItem key="v">Team Size: {data.teamSize}</ListboxItem>
        <ListboxItem key="c">
          Entry Fee: {convertMistToSui(data.entryFee)} <CoinIcon />
        </ListboxItem>
        <ListboxItem key="x">
          Reward Pool: {convertMistToSui(data.rewardPool?.value)} <CoinIcon />
        </ListboxItem>
        <ListboxItem key="z">
          Participants Limit: {data.participantsLimit}
        </ListboxItem>
        {/*<ListboxItem key="g" className="text-danger" color="danger">*/}
        {/*    Delete file*/}
        {/*</ListboxItem>*/}
      </Listbox>

      {/*If Admin*/}
      { data?.admin === address ? (
        <p>
          <span>Choose winners</span>
          <CheckboxGroup
            defaultValue={[]}
            label="Select mutiple"
            onChange={setSelectedWinnerAddresses}
          >
            {data?.participants
              ? data?.participants?.map(({ address, nickname }) => (
                  <Checkbox key={address} value={address}>
                    {nickname}
                  </Checkbox>
                ))
              : []}
          </CheckboxGroup>
            {data?.status === 1 && <Button onPress={handleFinish}>Complete</Button>}
        </p>
      ) : null}
      <Modal
          size='sm'
          actions={[]}
          open={joinModalVisible}
          title={`Join ${data?.title || ""}`}
          onChange={setJoinModalVisible}
      >
        {data ? (
            <JoinChampionship championship={data}/>
        ) : null}
      </Modal>
    </div>
  );
}
