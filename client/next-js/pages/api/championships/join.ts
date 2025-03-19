import type {NextApiRequest, NextApiResponse} from "next";
import {Championship} from "@/types";
import {PACKAGE_ID} from "@/consts";
import {Transaction} from "@mysten/sui/transactions";

type ResponseData = {
    message: string
};

async function joinChampionship(championship: Championship, nickname: string) {
    try {
        const tx = new Transaction();
        const isFreeChampionship = Number(championship.entryFee) === 0;
        // We need a mutable reference to the coin and the championship object
        // So we pass them as objects in the transaction
        const champ = tx.object(championship.id);
        const nicknameParam = tx.pure.string(nickname);

        tx.moveCall({
            target: `${PACKAGE_ID}::championship::join_free`,
            arguments: [champ, nicknameParam],
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
            req.body.nickname,
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