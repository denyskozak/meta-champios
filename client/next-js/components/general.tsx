"use client";
import React, {useLayoutEffect, useRef} from "react";
import {useZKLogin} from "react-sui-zk-login-kit";
import Image from "next/image";
import {useRouter} from "next/navigation";
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import Championships from "@/components/championships";
import {title as getTitle, subtitle} from "@/components/primitives";
import {useAnimation} from "@/app/hooks/useAnimation";

// Sui JS SDK

// EXAMPLE: Connect to Sui testnet

// Replace with your actual deployed addresses!
const PACKAGE_ID = process.env.NEXT_PUBLIC_CHAMPIONSHIPS_PACKAGE_ID;

gsap.registerPlugin(useGSAP);

export default function General() {
    const router = useRouter();

    const {address} = useZKLogin();

    const container = useRef(null);
    const logoRef = useRef(null);
    const [fadeInClass] = useAnimation();

    useGSAP(
        () => {
            // gsap.registerPlugin(window.TextPlugin);
            // const titles = gsap.utils.toArray('.title-text');
            // const subtexts = gsap.utils.toArray('.sub-text');
            // console.log('titles ', titles)
            // console.log('subtexts ', subtexts)
            const anim = fadeInClass('.fade-in-animation')

            anim.eventCallback('onComplete', () => {
                const tl2 = gsap.timeline({repeatDelay: 2, yoyo: true});
                tl2.to(logoRef.current, {duration: 6, rotate: 360, repeat: 0, reversed: true,})

            });

        },
        {scope: container}
    );

    // useLayoutEffect(() => {
    //   if (window.TextPlugin) {
    //     gsap.registerPlugin(TextPlugin);
    //     gsap.defaults({ease: "none"});
    //
    //
    //     if (textRef.current) {
    //       // gsap.to(textRef.current, {
    //       //   duration: 2,
    //       //   text: "New ",
    //       //   ease: "none",
    //       // });
    //
    //       const tl = gsap.timeline({repeat:3, repeatDelay:1, yoyo:true});
    //       tl.to(textRef.current, {duration: 2, text:"Win"})
    //           .to(textRef.current, {duration: 2, text:"Earn"})
    //           .to(textRef.current, {duration: 2, text:"Repeat"})
    //     }
    //   }
    // }, []);

    return (
        <div
            ref={container}
            className="w-screen  h-screen"
            style={{overflow: "scroll", padding: "1rem", fontFamily: "sans-serif"}}
        >
            {/* HeroUI-like header */}
            <header style={{textAlign: "center", marginBottom: "2rem"}}>
                <div className="inline-block max-w-xl text-center justify-center items-center">
                    <div>
                        <span className={`${getTitle()} fade-in-animation`}>Play</span>&nbsp;
                        <span className={`${getTitle({color: "violet"})} fade-in-animation`}>Win</span>&nbsp;
                        <span className={`${getTitle()} fade-in-animation`}>Earn</span>&nbsp;
                        <br/>
                        <span className={`${getTitle()} fade-in-animation`}>with&nbsp;</span>
                    </div>
                    <div>
                        <Image
                            ref={logoRef}
                            alt="Logo"
                            className="m-auto mt-4 fade-in-animation"
                            height={280}
                            src="/logo_big.png"
                            width={180}
                        />
                    </div>
                    {/*<span className={getTitle()}>Path&nbsp;</span>*/}
                    {/*<br/>*/}
                    {/*<span className={getTitle()}>*/}
                    {/*    with multi-game <span className={getTitle({color: "violet"})}>Championships</span>&nbsp;*/}
                    {/*</span>*/}
                    <div className={subtitle({class: "mt-4 fade-in-animation", color: "foreground"})}>
                        Blood, Money, Experience
                    </div>
                </div>
            </header>
            <section
                className="flex justify-center items-center flex-col gap-8"
                style={{
                    paddingLeft: "2 rem",
                    paddingRight: "2 rem",
                    margin: "0 auto",
                    marginBottom: "2rem",
                }}
            >
                {/*<div>*/}
                {/*    <span className={`${getTitle()} fade-in-animation`}>Championships&nbsp;</span>*/}
                {/*</div>*/}
                <div className="fade-in-animation">
                    <Championships/>
                </div>

            </section>
        </div>
    );
}
