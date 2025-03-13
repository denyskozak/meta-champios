import { Transaction } from "@mysten/sui/transactions";
import { useLogout, useZKLogin } from "react-sui-zk-login-kit";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { useRouter } from "next/navigation";

import { PACKAGE_ID } from "@/consts";
import { Championship } from "@/types";

export const useTransaction = () => {
  const router = useRouter();

  const { logout } = useLogout();

  const { address, client, executeTransaction } = useZKLogin({
    onTransactionFailed: () => {
      console.log("ffffailed tx hook ");
      logout();
      router.push("/login");
    },
  });

  const handleSignAndExecute = async (tx: Transaction) => {
    if (address) {
      tx.setSender(address);
    }
    tx.setGasBudget(100000000);
    try {
      const digest = await executeTransaction(tx);

      if (!digest) throw new Error("No digest tx");

      console.log("result tx digest ", digest);
    } catch (error) {
      console.log("error ", error);
    }
  };

  // Fetch user's coin objects
  async function getUserCoins() {
    const coins = await client.getCoins({
      owner: address || "",
      coinType: `${PACKAGE_ID}::coin::COIN`,
    });

    return coins.data;
  }

  // Select a coin with sufficient balance
  // TODO remove any
  async function selectPaymentCoin(coins: any[], entryFee: number) {
    for (const coin of coins) {
      if (Number(coin.balance) >= entryFee) {
        return coin.coinObjectId;
      }
    }
    throw new Error("No coin with sufficient balance found.");
  }

  return {
    async changeStatus(championshipId: string, status: number) {
      try {
        // 1. Build the transaction
        const tx = new Transaction();
        const champ = tx.object(championshipId);

        // 2. Move call to finish
        tx.moveCall({
          target: `${PACKAGE_ID}::championship::change_status`,
          arguments: [
            champ,
            tx.pure.u8(status), // pass the array of addresses
          ],
        });

        // 3. Sign and execute
        await handleSignAndExecute(tx);
        console.log("Finish succeeded!");
      } catch (error) {
        console.error("Error change status championship:", error);
      }
    },
    async finishChampionship(
      championshipId: string,
      winnerAddresses: string[],
    ) {
      try {
        // 1. Build the transaction
        const tx = new Transaction();
        const champ = tx.object(championshipId);

        // 2. Move call to finish
        tx.moveCall({
          target: `${PACKAGE_ID}::championship::finish`,
          arguments: [
            champ,
            tx.pure.vector("address", winnerAddresses), // pass the array of addresses
          ],
        });

        // 3. Sign and execute
        await handleSignAndExecute(tx);
        console.log("Finish succeeded!");
      } catch (error) {
        console.error("Error finishing championship:", error);
      }
    },
    async topUpChampionship(championshipId: string, topUpAmount: number) {
      try {
        // 1. Get the user’s coins (whatever logic you already have)
        const coins = await getUserCoins();

        // 2. Pick a coin that has enough balance to cover topUpAmount
        const paymentCoinId = await selectPaymentCoin(coins, topUpAmount);

        // 3. Build the transaction
        const tx = new Transaction();

        // - "Object" references for championship and the chosen coin
        const champ = tx.object(championshipId);
        const paymentCoinObject = tx.object(paymentCoinId);

        // - Split the exact top-up amount off the chosen coin
        const [topUpCoin] = tx.splitCoins(paymentCoinObject, [topUpAmount]);

        // 4. Invoke your Move function
        tx.moveCall({
          target: `${PACKAGE_ID}::championship::top_up`,
          arguments: [champ, topUpCoin],
        });

        // 5. Sign & execute the transaction
        await handleSignAndExecute(tx);
        console.log("Top-up succeeded!");
      } catch (error) {
        console.error("Error in topUpChampionship:", error);
      }
    },
    async joinChampionship(championship: Championship) {
      try {
        const coins = await getUserCoins();

        const tx = new Transaction();
        const isFreeChampionship = Number(championship.entryFee) === 0;
        // We need a mutable reference to the coin and the championship object
        // So we pass them as objects in the transaction
        const champ = tx.object(championship.id);

        if (isFreeChampionship) {
          tx.moveCall({
            target: `${PACKAGE_ID}::championship::join_free`,
            arguments: [champ],
          });
        } else {
          const paymentCoinId = await selectPaymentCoin(
            coins,
            Number(championship.entryFee),
          );

          const paymentCoinObject = tx.object(paymentCoinId);

          const [championshipFee] = tx.splitCoins(paymentCoinObject, [
            Number(championship.entryFee),
          ]);

          tx.moveCall({
            target: `${PACKAGE_ID}::championship::join_paid`,
            arguments: [champ, championshipFee],
          });
        }

        await handleSignAndExecute(tx);
      } catch (error) {
        console.error(error);
        alert("Error joining championship. Check console.");
      }
    },
    async createChampionship(
      title: string,
      description: string,
      game: string,
      teamSize: string,
      entryFee: string,
      joinersLimit: string,
      discordLink: string,
    ) {
      try {
        const tx = new Transaction();

        // Move Call
        tx.moveCall({
          target: `${PACKAGE_ID}::championship::create`,
          arguments: [
            tx.pure.string(title),
            tx.pure.string(description),
            tx.pure.string(game),
            tx.pure.u64(teamSize),
            tx.pure.u64(entryFee),
            tx.pure.u64(joinersLimit),
            tx.pure.string(discordLink),
          ],
        });
        await handleSignAndExecute(tx);
      } catch (error) {
        console.error(error);
        alert("Error creating championship. See console.");
      }
    },
    async faucet(amount: number) {
      const tx = new Transaction();

      tx.moveCall({
        target: `${PACKAGE_ID}::coin::mint`,
        arguments: [
          tx.object(
            "0x6e3dae2d09366d339d7782e9323a3b4059c3e9a966cfbde744001ee56474c07f",
          ),
          tx.pure.u64(amount),
          tx.pure.address(address || ""),
        ],
      });
      tx.setGasBudget(100000000);

      const secretKey = `${process.env.NEXT_PUBLIC_CHAMPIONSHIPS_TREASURE_CAP_KEY}`;

      const keypair = Ed25519Keypair.fromSecretKey(secretKey);

      const result = await client.signAndExecuteTransaction({
        signer: keypair,
        transaction: tx,
      });

      await client.waitForTransaction({ digest: result.digest });
    },
  };
};
