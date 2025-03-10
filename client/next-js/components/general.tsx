"use client";
import {Transaction} from "@mysten/sui/transactions";
import React, {useLayoutEffect, useState} from "react";
import {useZKLogin, ZKLogin} from "react-sui-zk-login-kit";
import Championships from "@/components/championships";
import {Login} from "@/components/login";

import {siteConfig} from "@/config/site";
import {title as getTitle, subtitle} from "@/components/primitives";
import {convertSuiToMist} from "@/utiltiies";
import {useTransaction} from "@/app/hooks";
import {Button} from "@heroui/button";
import {Modal} from "@/components/modal";
import {CreateChampionship} from "@/components/create-championship";


// Sui JS SDK

// EXAMPLE: Connect to Sui testnet

// Replace with your actual deployed addresses!
const PACKAGE_ID = process.env.NEXT_PUBLIC_CHAMPIONSHIPS_PACKAGE_ID;

export default function General() {

    const [newChampionshipModalVisible, setNewChampionshipModalVisible] = useState(false);

    return (
        <div className="w-screen  h-screen"
             style={{overflow: 'scroll', padding: "1rem", fontFamily: "sans-serif"}}>
            {/* HeroUI-like header */}
            <header style={{textAlign: "center", marginBottom: "2rem"}}>
                <div className="inline-block max-w-xl text-center justify-center ">
                    {/*<span className={getTitle()}>Ear&nbsp;</span>*/}
                    <span className={getTitle({color: "violet"})}>Earn-to-Win&nbsp;</span>
                    {/*<span className={getTitle()}>Path&nbsp;</span>*/}
                    <br/>
                    <span className={getTitle()}>
                        with multi-game <span className={getTitle({color: "violet"})}>Championships</span>&nbsp;
            </span>
                    <div className={subtitle({class: "mt-4"})}>
                        Hard, Blood, Money.
                    </div>
                    <Button onPress={() => setNewChampionshipModalVisible(true)}>New Championsip</Button>

                </div>
            </header>
            <section className="flex justify-center items-center" style={{paddingLeft: '2 rem', paddingRight: '2 rem', margin: "0 auto", marginBottom: "2rem"}}>
                <Championships/>
            </section>

          <Modal
              open={newChampionshipModalVisible}
              title="New Championship"
              onChange={setNewChampionshipModalVisible} actions={[]}>
              <CreateChampionship />
          </Modal>
        </div>
    );
}


