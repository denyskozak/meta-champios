"use client";
import {Transaction} from "@mysten/sui/transactions";
import React, {useLayoutEffect, useState} from "react";
import {useZKLogin, ZKLogin} from "react-sui-zk-login-kit";
import Championships from "@/components/championships";
import {Login} from "@/components/login";
import Image from 'next/image'

import {siteConfig} from "@/config/site";
import {title as getTitle, subtitle} from "@/components/primitives";
import {convertSuiToMist} from "@/utiltiies";
import {useTransaction} from "@/app/hooks";
import {Button} from "@heroui/button";
import {Modal} from "@/components/modal";
import {CreateChampionship} from "@/components/create-championship";
import {useRouter} from "next/navigation";


// Sui JS SDK

// EXAMPLE: Connect to Sui testnet

// Replace with your actual deployed addresses!
const PACKAGE_ID = process.env.NEXT_PUBLIC_CHAMPIONSHIPS_PACKAGE_ID;

export default function General() {
    const router = useRouter()

    const { address } = useZKLogin();

    return (
        <div className="w-screen  h-screen"
             style={{overflow: 'scroll', padding: "1rem", fontFamily: "sans-serif"}}>
            {/* HeroUI-like header */}
            <header style={{textAlign: "center", marginBottom: "2rem"}}>
                <div className="inline-block max-w-xl text-center justify-center items-center">
                    <div>
                        <span className={getTitle()}>Unlock&nbsp;</span>
                        <span className={getTitle({color: "violet"})}>New&nbsp;</span>
                        <span className={getTitle()}>Experience&nbsp;</span>
                        <br/>
                        <span className={getTitle()}>with&nbsp;</span>
                    </div>

                    <div>

                        <Image
                            className="m-auto mt-4"
                            src="/logo_big.png"
                            width={180}
                            height={280}
                            alt="Picture of the author"
                        />
                    </div>
                    {/*<span className={getTitle()}>Path&nbsp;</span>*/}
                    {/*<br/>*/}
                    {/*<span className={getTitle()}>*/}
                    {/*    with multi-game <span className={getTitle({color: "violet"})}>Championships</span>&nbsp;*/}
            {/*</span>*/}
                    <div className={subtitle({class: "mt-4", color: "foreground"})}>
                        Hard, Blood, Money.
                    </div>


                </div>
            </header>
            <section className="flex justify-center items-center"
                     style={{paddingLeft: '2 rem', paddingRight: '2 rem', margin: "0 auto", marginBottom: "2rem"}}>
                <Championships/>
            </section>


        </div>
    );
}


