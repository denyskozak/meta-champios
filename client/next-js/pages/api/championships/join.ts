import type {NextApiRequest, NextApiResponse} from "next";
import {PACKAGE_ID} from "@/consts";
import {Transaction} from "@mysten/sui/transactions";
import {bcs} from "@mysten/bcs";
import {getFullnodeUrl, SuiClient} from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

type ResponseData = {
    message: string
};

// use getFullnodeUrl to define Devnet RPC location
const rpcUrl = getFullnodeUrl('devnet');

// create a client connected to devnet
const client = new SuiClient({ url: rpcUrl });

// Keypair from an existing secret key (Uint8Array)
const keypair = Ed25519Keypair.fromSecretKey(process.env.SECRET_KEY || '');

async function joinChampionship(championshipId: string, teamName: string, leadName: string, teammateNicknames: string[]) {
    try {
        const tx = new Transaction();
        // We need a mutable reference to the coin and the championship object
        // So we pass them as objects in the transaction
        const champ = tx.object(championshipId);
        const nicknameParam = tx.pure.string(leadName);
        const teamNameParam = tx.pure.string(teamName);
        const teammateNicknamesParam = tx.pure(
            bcs.vector(bcs.string()).serialize(teammateNicknames).toBytes()
        );

        tx.moveCall({
            target: `${PACKAGE_ID}::championship::join_free`,
            arguments: [champ, teamNameParam, nicknameParam, teammateNicknamesParam],
        });
        const result = await client.signAndExecuteTransaction({
            transaction: tx,
            signer: keypair,
        });

        await client.waitForTransaction({
            digest: result.digest,
            options: {
                showEffects: true,
            },
        });
    } catch (error) {
        console.error(error);
        alert("Error joining championship. Check console.");
    }
}

const POST = async (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
    try {
        await joinChampionship(
            req.body.championshipId,
            req.body.teamName,
            req.body.leadNickname,
            req.body.teammateNicknames,
        );

        res.status(200).json({message: 'Joined'});
    } catch (error) {
        console.log('error ', error)
         res.status(400).json({message: 'failed!'});
    }
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    switch (req.method) {
        case "POST":
            await POST(req, res);
            return;
    }
    res.status(200).json({message: 'Hello from Next.js!'})
}