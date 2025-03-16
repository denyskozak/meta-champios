import {Transaction} from "@mysten/sui/transactions";
import {useZKLogin} from "react-sui-zk-login-kit";
import {PACKAGE_ID} from "@/consts";
import {Championship} from "@/types";
import {MIST_PER_SUI} from "@/utiltiies";

export const useTransaction = () => {


    const {address, client, executeTransaction} = useZKLogin();

    const handleSignAndExecute = async (tx: Transaction) => {
        if (address) {
            tx.setSender(address);
        }

        tx.setGasBudget(100000000);

        // const dryResult = await client.dryRunTransactionBlock({
        //     transactionBlock: await tx.build({ client })
        // });
        //
        // console.log('dryResult ', dryResult)

        const digest = await executeTransaction(tx);

        if (!digest) throw new Error("No digest tx");

        console.log("result tx digest ", digest);

    };

    // Fetch user's coin objects
    async function getUserCoins() {
        const coins = await client.getCoins({
            owner: address || "",
            coinType: '0x2::sui::SUI',
        });

        return coins.data;
    }

    const splitCoinForHaveGas = async () => {
        const txSplit = new Transaction();
        const [gasCoin] = txSplit.splitCoins(txSplit.gas, [MIST_PER_SUI * 0.1]);
        txSplit.transferObjects([gasCoin], address || '');
        txSplit.setSender(address || '');
        await executeTransaction(txSplit);
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

                // 3. Build the transaction
                const tx = new Transaction();

                // 2. Pick a coin that has enough balance to cover topUpAmount
                const paymentCoinId = selectPaymentCoin(coins, topUpAmount, tx);


                // - "Object" references for championship and the chosen coin
                const champ = tx.object(championshipId);

                // - Split the exact top-up amount off the chosen coin
                const [topUpCoin] = tx.splitCoins(paymentCoinId, [topUpAmount]);

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
        async joinChampionship(championship: Championship, nickname: string) {
            try {

                const tx = new Transaction();
                const isFreeChampionship = Number(championship.entryFee) === 0;
                // We need a mutable reference to the coin and the championship object
                // So we pass them as objects in the transaction
                const champ = tx.object(championship.id);
                const nicknameParam = tx.pure.string(nickname);

                if (isFreeChampionship) {

                    tx.moveCall({
                        target: `${PACKAGE_ID}::championship::join_free`,
                        arguments: [champ, nicknameParam],
                    });
                } else {
                    const coins = await getUserCoins();

                    if (coins.length === 1) {
                        await splitCoinForHaveGas();
                    }


                    const [championshipFee] = tx.splitCoins(tx.gas, [
                        Number(championship.entryFee),
                    ]);

                    tx.moveCall({
                        target: `${PACKAGE_ID}::championship::join_paid`,
                        arguments: [champ, nicknameParam, championshipFee],
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

            const coins = await getUserCoins();

            if (coins.length === 1) {
                await splitCoinForHaveGas();
            }

            const tx = new Transaction();

            const [championshipCreateFee] = tx.splitCoins(tx.gas, [
                MIST_PER_SUI,
            ]);
            // Move Call
            tx.moveCall({
                target: `${PACKAGE_ID}::championship::create`,
                arguments: [
                    tx.pure.string(title),
                    tx.pure.string(description),
                    tx.pure.string(game),
                    tx.pure.u64(teamSize),
                    tx.pure.u64(Number(entryFee) * MIST_PER_SUI),
                    tx.pure.u64(joinersLimit),
                    tx.pure.string(discordLink),
                    championshipCreateFee
                ],
            });
            await handleSignAndExecute(tx);

        },
    };
};
