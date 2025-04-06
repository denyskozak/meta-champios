import { Transaction } from "@mysten/sui/transactions";
import { useZKLogin } from "react-sui-zk-login-kit";

import { PACKAGE_ID } from "@/consts";
import { Championship } from "@/types";
import { MIST_PER_SUI } from "@/utiltiies";
import { bcs } from "@mysten/bcs";

export const useTransaction = () => {
  const { address, client, executeTransaction } = useZKLogin();

  const handleSignAndExecute = async (tx: Transaction) => {
    if (address) {
      tx.setSender(address);
    }

    tx.setGasBudget(100000000);

    const digest = await executeTransaction(tx);

    if (!digest) throw new Error("No digest tx");

    console.log("result tx digest ", digest);
  };

  async function getUserCoins() {
    const coins = await client.getCoins({
      owner: address || "",
      coinType: "0x2::sui::SUI",
    });

    return coins.data;
  }

  const splitCoinForHaveGas = async () => {
    const txSplit = new Transaction();
    const [gasCoin] = txSplit.splitCoins(txSplit.gas, [MIST_PER_SUI * 0.1]);

    txSplit.transferObjects([gasCoin], address || "");
    txSplit.setSender(address || "");
    await executeTransaction(txSplit);
  };

  return {
    async sendCoins(toAddress: string, coins: number) {
      const txSplit = new Transaction();
      const [gasCoin] = txSplit.splitCoins(txSplit.gas, [MIST_PER_SUI * coins]);

      txSplit.transferObjects([gasCoin], toAddress || "");
      txSplit.setSender(address || "");
      await executeTransaction(txSplit);
    },

    async startChampionship(championshipId: string) {
      const tx = new Transaction();
      const champ = tx.object(championshipId);

      tx.moveCall({
        target: `${PACKAGE_ID}::championship::start_championship`,
        arguments: [champ],
      });

      await handleSignAndExecute(tx);
    },

    async reportMatchResult(championshipId: string, matchIndex: number, winnerLeaderAddress: string) {
      const tx = new Transaction();
      const champ = tx.object(championshipId);

      tx.moveCall({
        target: `${PACKAGE_ID}::championship::report_match_result`,
        arguments: [
          champ,
          tx.pure.u64(matchIndex),
          tx.pure.address(winnerLeaderAddress),
        ],
      });

      await handleSignAndExecute(tx);
    },
    async advanceToNextRound(championshipId: string) {
      const tx = new Transaction();
      const champ = tx.object(championshipId);

      tx.moveCall({
        target: `${PACKAGE_ID}::championship::advance_to_next_round`,
        arguments: [
          champ,
        ],
      });

      await handleSignAndExecute(tx);
    },

    async finishChampionship(championshipId: string) {
      const tx = new Transaction();
      const champ = tx.object(championshipId);

      tx.moveCall({
        target: `${PACKAGE_ID}::championship::finish`,
        arguments: [
          champ,
        ],
      });

      await handleSignAndExecute(tx);
      console.log("Finish succeeded!");
    },

    async topUpChampionship(championshipId: string, topUpAmount: number) {
      const tx = new Transaction();
      await handleSignAndExecute(tx);
      console.log("Top-up succeeded!");
    },

    async joinChampionship(championship: Championship, teamName: string, leadName: string, teammateNicknames: string[]) {
      const tx = new Transaction();
      const isFreeChampionship = Number(championship.ticketPrice) === 0;
      const championObjectParam = tx.object(championship.id);
      const nicknameParam = tx.pure.string(leadName);
      const teamNameParam = tx.pure.string(teamName);
      const teammateNicknamesParam = tx.pure(
          bcs.vector(bcs.string()).serialize(teammateNicknames).toBytes()
      );

      if (isFreeChampionship) {
        tx.moveCall({
          target: `${PACKAGE_ID}::championship::join_free`,
          arguments: [championObjectParam, teamNameParam, nicknameParam, teammateNicknamesParam],
        });
      } else {
        const coins = await getUserCoins();

        if (coins.length === 1) {
          await splitCoinForHaveGas();
        }

        const [championshipFee] = tx.splitCoins(tx.gas, [
          Number(championship.ticketPrice),
        ]);

        tx.moveCall({
          target: `${PACKAGE_ID}::championship::join_paid`,
          arguments: [
            championObjectParam,
            teamNameParam,
            nicknameParam,
            teammateNicknamesParam,
            championshipFee,
          ],
        });
      }

      await handleSignAndExecute(tx);
    },

    async createChampionship(
        title: string,
        description: string,
        game: string,
        teamSize: string,
        ticketPrice: string,
        joinersLimit: string,
        discordLink: string,
        discordAdminName: string,
    ) {
      const coins = await getUserCoins();

      if (coins.length === 1) {
        await splitCoinForHaveGas();
      }

      const tx = new Transaction();
      const [championshipCreateFee] = tx.splitCoins(tx.gas, [MIST_PER_SUI * 5]);

      tx.moveCall({
        target: `${PACKAGE_ID}::championship::create`,
        arguments: [
          tx.pure.string(title),
          tx.pure.string(description),
          tx.pure.string(game),
          tx.pure.u64(teamSize),
          tx.pure.u64(Number(ticketPrice) * MIST_PER_SUI),
          tx.pure.u64(joinersLimit),
          tx.pure.string(discordLink),
          tx.pure.string(discordAdminName),
          championshipCreateFee,
        ],
      });

      await handleSignAndExecute(tx);
    },
  };
};
