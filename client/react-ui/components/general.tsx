"use client";
import {Transaction} from "@mysten/sui/transactions";
import React, {useLayoutEffect, useState} from "react";
import {useZKLogin, ZKLogin} from "react-sui-zk-login-kit";
import Championships from "@/components/championships";
import {Login} from "@/components/login";

import {siteConfig} from "@/config/site";
import {title as getTitle, subtitle} from "@/components/primitives";
import {convertSuiToMist} from "@/utiltiies";


// Sui JS SDK

// EXAMPLE: Connect to Sui testnet

// Replace with your actual deployed addresses!
const PACKAGE_ID = process.env.NEXT_PUBLIC_CHAMPIONSHIPS_PACKAGE_ID;

export default function General() {
    // ---- State for forms ----
    // Create Championship
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [game, setGame] = useState("");
    const [teamSize, setTeamSize] = useState(1);
    const [entryFee, setEntryFee] = useState(0);
    const [joinersLimit, setJoinerLimit] = useState(100);
    const {executeTransaction, address: zkAddress} = useZKLogin();
    const address = zkAddress || '';

    // Join Championship
    const [championshipObjId, setChampionshipObjId] = useState("");
    const [coinObjId, setCoinObjId] = useState("");

    // Finish Championship
    const [finishObjId, setFinishObjId] = useState("");
    const [winners, setWinners] = useState("");


    // A placeholder for whatever wallet or signer you plan to use
    // In an actual app, you'd integrate with a wallet extension or your own private keys.
    const handleSignAndExecute = async (tx: Transaction) => {
        if (address) {
            tx.setSender(address);
        }

        tx.setGasBudget(100000000);
        try {
            const result = await executeTransaction(tx);
            console.log('result ', result)
        } catch (error) {
            console.log('error ', error)
        }

    };

    console.log('address ', address)
    // ---- CREATE CHAMPIONSHIP ----
    const createChampionship = async () => {

        try {
            const tx = new Transaction();

            console.log('1 ', [

                title,
                description,
                game,
                teamSize,
                convertSuiToMist(entryFee),
            ])
            // Move Call
            tx.moveCall({
                target: `${PACKAGE_ID}::champion_ships::create_championship`,
                arguments: [
                    tx.pure.string(title),
                    tx.pure.string(description),
                    tx.pure.string(game),
                    tx.pure.u64(teamSize),
                    tx.pure.u64(convertSuiToMist(entryFee)),
                    tx.pure.u64(joinersLimit),
                ],
            });
            await handleSignAndExecute(tx);
        } catch (error) {
            console.error(error);
            alert("Error creating championship. See console.");
        }
    };

    // ---- FINISH CHAMPIONSHIP ----
    const finishChampionship = async () => {
        try {
            const tx = new Transaction();
            const champ = tx.object(finishObjId);

            // Convert the winners list from a comma-separated string to an array of addresses
            const winnerAddrs = winners.split(",").map((w) => w.trim());

            tx.moveCall({
                target: `${PACKAGE_ID}::champion_ships::champion_ships::finish_championship`,
                arguments: [champ, tx.pure.vector(tx.pure.address, winnerAddrs)],
            });
            await handleSignAndExecute(tx);
        } catch (error) {
            console.error(error);
            alert("Error finishing championship. Check console.");
        }
    };

    return (
        <div className="w-screen"
             style={{overflow: 'scroll', padding: "1rem", fontFamily: "sans-serif"}}>
            {/* HeroUI-like header */}
            <header style={{textAlign: "center", marginBottom: "2rem"}}>
                <div className="inline-block max-w-xl text-center justify-center ">
                    <span className={getTitle()}>Join&nbsp;</span>
                    <span className={getTitle({color: "violet"})}>Competitive&nbsp;</span>
                    <span className={getTitle()}>Path&nbsp;</span>
                    <br/>
                    <span className={getTitle()}>
                        with multi-game <span className={getTitle({color: "violet"})}>Championships</span>&nbsp;
            </span>
                    <div className={subtitle({class: "mt-4"})}>
                        Hard, Blood, Money.
                    </div>
                </div>
            </header>

            <section className="flex justify-center items-center" style={{paddingLeft: '2 rem', paddingRight: '2 rem', margin: "0 auto", marginBottom: "2rem"}}>
                <Championships/>
            </section>

            <section style={{maxWidth: "600px", margin: "0 auto", marginBottom: "2rem"}}>
                <div
                    style={{
                        // backgroundColor: "#F3F4F6",
                        borderRadius: "8px",
                        padding: "1rem",
                        marginBottom: "1rem",
                    }}
                >
                    <h2>Create Championship</h2>
                    <div>
                        <label>Title: </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Championship Title"
                        />
                    </div>
                    <div>
                        <label>Description: </label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the championship"
                        />
                    </div>
                    <div>
                        <label>Game: </label>
                        <input
                            type="text"
                            value={game}
                            onChange={(e) => setGame(e.target.value)}
                            placeholder="Game name or short code"
                        />
                    </div>
                    <div>
                        <label>Team Size: </label>
                        <input
                            type="number"
                            value={teamSize}
                            onChange={(e) => setTeamSize(parseInt(e.target.value))}
                        />
                    </div>
                    <div>
                        <label>Entry Fee: </label>
                        <input
                            type="number"
                            value={entryFee}
                            onChange={(e) => setEntryFee(parseFloat(e.target.value))}
                        />
                    </div>
                    <div>
                        <label>Joiners Limit: </label>
                        <input
                            type="number"
                            value={joinersLimit}
                            onChange={(e) => setJoinerLimit(parseInt(e.target.value))}
                        />
                    </div>
                    <button onClick={createChampionship} style={{marginTop: "0.5rem"}}>
                        Create
                    </button>
                </div>


                <div
                    style={{
                        // backgroundColor: "#F3F4F6",
                        borderRadius: "8px",
                        padding: "1rem",
                    }}
                >
                    <h2>Finish Championship</h2>
                    <p>Can only be called by the championship admin and if status == 1 (Ongoing)</p>
                    <div>
                        <label>Championship Object ID: </label>
                        <input
                            type="text"
                            value={finishObjId}
                            onChange={(e) => setFinishObjId(e.target.value)}
                            placeholder="0x..."
                        />
                    </div>
                    <div>
                        <label>Winner Addresses (comma-separated): </label>
                        <input
                            type="text"
                            value={winners}
                            onChange={(e) => setWinners(e.target.value)}
                            placeholder="0x123..., 0xabc..., 0xdef..."
                            style={{width: "100%"}}
                        />
                    </div>
                    <button onClick={finishChampionship} style={{marginTop: "0.5rem"}}>
                        Finish
                    </button>
                </div>
            </section>
        </div>
    );
}


