"use client";
import {title} from "@/components/primitives";
import {Transaction} from "@mysten/sui/transactions";
import React, {useLayoutEffect, useState} from "react";
import {useZKLogin} from "react-sui-zk-login-kit";
import Championships from "@/app/champion-ships/championships";


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
                tx.pure.string(title),
                tx.pure.string(description),
                tx.pure.string(game),
                tx.pure.u64(teamSize),
                tx.pure.u64(entryFee),
                title,
                description,
                game,
                teamSize,
                entryFee,
            ])
            // Move Call
            tx.moveCall({
                target: `${PACKAGE_ID}::champion_ships::create_championship`,
                arguments: [
                    tx.pure.string(title),
                    tx.pure.string(description),
                    tx.pure.string(game),
                    tx.pure.u64(teamSize),
                    tx.pure.u64(entryFee),
                ],
            });
            await handleSignAndExecute(tx);
        } catch (error) {
            console.error(error);
            alert("Error creating championship. See console.");
        }
    };

    // ---- JOIN CHAMPIONSHIP ----
    const joinChampionship = async () => {
        try {
            const tx = new Transaction();
            // We need a mutable reference to the coin and the championship object
            // So we pass them as objects in the transaction
            const champ = tx.object(championshipObjId);
            const coinObj = tx.object(coinObjId);

            tx.moveCall({
                target: `${PACKAGE_ID}::champion_ships::champion_ships::join_championship`,
                arguments: [champ, coinObj],
            });
            await handleSignAndExecute(tx);
        } catch (error) {
            console.error(error);
            alert("Error joining championship. Check console.");
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
        <div className="w-screen" style={{ overflow: 'scroll', padding: "1rem", fontFamily: "sans-serif", backdropFilter: "blur(10px)"}}>
            {/* HeroUI-like header */}
            <header style={{textAlign: "center", marginBottom: "2rem"}}>
                <h1 style={{fontSize: "2rem"}}>SUI Championship System</h1>
                <p>Interact with the Move contract from a simple React UI</p>
            </header>

            <section style={{maxWidth: "800px", margin: "0 auto", marginBottom: "2rem"}}>
                <Championships />
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
                            onChange={(e) => setEntryFee(parseInt(e.target.value))}
                        />
                    </div>
                    <button onClick={createChampionship} style={{marginTop: "0.5rem"}}>
                        Create
                    </button>
                </div>

                <div
                    style={{
                        // backgroundColor: "#E5E7EB",
                        borderRadius: "8px",
                        padding: "1rem",
                        marginBottom: "1rem",
                    }}
                >
                    <h2>Join Championship</h2>
                    <p>Requires the user to have a coin object with enough SUI balance to pay entry fee</p>
                    <div>
                        <label>Championship Object ID: </label>
                        <input
                            type="text"
                            value={championshipObjId}
                            onChange={(e) => setChampionshipObjId(e.target.value)}
                            placeholder="0x..."
                        />
                    </div>
                    <div>
                        <label>Coin Object ID: </label>
                        <input
                            type="text"
                            value={coinObjId}
                            onChange={(e) => setCoinObjId(e.target.value)}
                            placeholder="0x..."
                        />
                    </div>
                    <button onClick={joinChampionship} style={{marginTop: "0.5rem"}}>
                        Join
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


