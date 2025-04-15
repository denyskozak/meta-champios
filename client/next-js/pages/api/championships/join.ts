import type {NextApiRequest, NextApiResponse} from "next";

import {Transaction} from "@mysten/sui/transactions";
import {bcs} from "@mysten/bcs";
import {getFullnodeUrl, SuiClient} from "@mysten/sui/client";
import {Ed25519Keypair} from "@mysten/sui/keypairs/ed25519";

import {NETWORK, PACKAGE_ID} from "@/consts";
import {mapChampionshipRPC} from "@/utiltiies";

type ResponseData = {
    message: string;
};

// use getFullnodeUrl to define Devnet RPC location
const rpcUrl = getFullnodeUrl(NETWORK);

// create a client connected to devnet
const client = new SuiClient({url: rpcUrl});

// Keypair from an existing secret key (Uint8Array)
const keypair = Ed25519Keypair.fromSecretKey(process.env.SECRET_KEY || "");

async function joinChampionship(
    championshipId: string,
    leaderAddress: string,
    teamName: string,
    leadName: string,
    teammateNicknames: string[],
) {
    try {
        const tx = new Transaction();
        // We need a mutable reference to the coin and the championship object
        // So we pass them as objects in the transaction
        const champ = tx.object(championshipId);
        const leaderAddressParam = tx.pure.address(leaderAddress);
        const nicknameParam = tx.pure.string(leadName);
        const teamNameParam = tx.pure.string(teamName);
        const teammateNicknamesParam = tx.pure(
            bcs.vector(bcs.string()).serialize(teammateNicknames).toBytes(),
        );

        tx.moveCall({
            target: `${PACKAGE_ID}::championship::join_free`,
            arguments: [
                champ,
                leaderAddressParam,
                teamNameParam,
                nicknameParam,
                teammateNicknamesParam,
            ],
        });

        tx.setGasBudget(100000000);

        const result = await client.signAndExecuteTransaction({
            transaction: tx,
            signer: keypair,
        });

        console.log("result.digest, ", result.digest);
        await client.waitForTransaction({
            digest: result.digest,
            options: {
                showEffects: true,
            },
        });
    } catch (error) {
        console.error(error);
    }
}

const POST = async (
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>,
) => {
    try {
        const {
            championshipId,
            teamName,
            leaderAddress,
            leadNickname,
            teammateNicknames,
        } = req.body;
        const championship = await client.getObject({
            id: req.body.championshipId,
            options: {
                showContent: true,
            },
        });

        if (!championship) {
            res.status(404).json({message: "Championship not found"});

            return;
        }

        if (
            championship?.data?.content?.dataType === "moveObject" &&
            championship?.data?.content?.fields
        ) {


            const championshipData = mapChampionshipRPC(
                championship?.data?.content?.fields as any,
            );

            const teamNicknamesSafe = Array.isArray(teammateNicknames)
                ? teammateNicknames
                : [];

            const teamRegistered = championshipData.teams.some(
                (team) => team.name === teamName,
            );
            const leadNameRegistered = championshipData.teams.some(
                (team) =>
                    team.leadNickname === leadNickname ||
                    team.leaderAddress === leaderAddress,
            );
            const someTeamNicknamesRegistered = championshipData.teams.some((team) =>
                teamNicknamesSafe.some((nickname) =>
                    team.teammateNicknames.includes(nickname),
                ),
            );

            if (teamRegistered) {
                res.status(400).json({message: "Team already registered"});

                return;
            }
            if (leadNameRegistered) {
                res
                    .status(400)
                    .json({message: "Leader nickname already registered in other team"});

                return;
            }

            if (someTeamNicknamesRegistered) {
                res
                    .status(400)
                    .json({message: "Some teammate already registered in other team"});

                return;
            }

            console.log("championship ", championshipData);

            await joinChampionship(
                championshipId,
                leaderAddress,
                teamName,
                leadNickname,
                teammateNicknames,
            );

            res.status(200).json({message: "Joined"});
        } else {
            throw new Error('Data structure error')
        }
    } catch (error) {
        console.log("error ", error);
        res.status(400).json({message: "failed!"});
    }
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>,
) {
    switch (req.method) {
        case "POST":
            await POST(req, res);

            return;
    }
    res.status(200).json({message: "Hello from Next.js!"});
}
