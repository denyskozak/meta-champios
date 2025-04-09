"use client";
import React, {useRef} from "react";
import Image from "next/image";
import gsap from "gsap";
import {useGSAP} from "@gsap/react";
import {Button} from "@heroui/react";
import Link from "next/link";

import {title as getTitle, subtitle} from "@/components/primitives";
import {useAnimation} from "@/app/hooks/useAnimation";
import {useRouter} from "next/navigation";

// Sui JS SDK

// EXAMPLE: Connect to Sui testnet

// Replace with your actual deployed addresses!
const PACKAGE_ID = process.env.NEXT_PUBLIC_CHAMPIONSHIPS_PACKAGE_ID;

gsap.registerPlugin(useGSAP);

export default function General() {
    const container = useRef(null);
    const logoRef = useRef(null);
    const router = useRouter();
    const [fadeInClass] = useAnimation();

    useGSAP(
        () => {
            // gsap.registerPlugin(window.TextPlugin);
            // const titles = gsap.utils.toArray('.title-text');
            // const subtexts = gsap.utils.toArray('.sub-text');
            // console.log('titles ', titles)
            // console.log('subtexts ', subtexts)
            const anim = fadeInClass(".fade-in-animation");

            anim.eventCallback("onComplete", () => {
                const tl2 = gsap.timeline({repeatDelay: 2, yoyo: true});

                tl2.to(logoRef.current, {
                    duration: 6,
                    rotate: 360,
                    repeat: 0,
                    reversed: true,
                });
            });
        },
        {scope: container},
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
        >
            {/* HeroUI-like header */}
            <div style={{textAlign: "center",}} onClick={() => router.push('/championships')}>
                <div className="inline-block max-w-xl text-center justify-center items-center">
                    <div>
                        <span className={`${getTitle()} fade-in-animation`}>PLAY&nbsp;</span>

                        <span
                            className={`${getTitle({color: "violet"})} fade-in-animation`}
                        >
              WIN&nbsp;
            </span>

                        <span className={`${getTitle()} fade-in-animation`}>EARN</span>

                        {/*<br />*/}
                        {/*<span className={`${getTitle()} fade-in-animation`}>*/}
                        {/*  with&nbsp;*/}
                        {/*</span>*/}
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
                    <div
                        className={subtitle({
                            class: "mt-4 fade-in-animation",
                            color: "foreground",
                        })}
                    >
                        Blood, Reward, Fun
                    </div>
                </div>
            </div>
            <section className="mt-2 flex justify-center items-center  fade-in-animation">
                {/*<div>*/}
                {/*    <span className={`${getTitle()} fade-in-animation`}>Championships&nbsp;</span>*/}
                {/*</div>*/}

                <Button
                    size="lg"
                    onPress={() => router.push('/championships')}
                    className=" shadow-lg overflow-hidden group ">
          <span
              className="absolute inset-0 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-pulse opacity-100 group-hover:opacity-100 blur-md"></span>

                    <span className="relative z-10">PLAY</span>


                </Button>
            </section>
        </div>
    );
}
