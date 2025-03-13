"use client";
import React from "react";
import { useZKLogin } from "react-sui-zk-login-kit";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Championships from "@/components/championships";
import { title as getTitle, subtitle } from "@/components/primitives";

// Sui JS SDK

// EXAMPLE: Connect to Sui testnet

// Replace with your actual deployed addresses!
const PACKAGE_ID = process.env.NEXT_PUBLIC_CHAMPIONSHIPS_PACKAGE_ID;

export default function General() {
  const router = useRouter();

  const { address } = useZKLogin();

  return (
    <div
      className="w-screen  h-screen"
      style={{ overflow: "scroll", padding: "1rem", fontFamily: "sans-serif" }}
    >
      {/* HeroUI-like header */}
      <header style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div className="inline-block max-w-xl text-center justify-center items-center">
          <div>
            <span className={getTitle()}>Unlock&nbsp;</span>
            <span className={getTitle({ color: "violet" })}>New&nbsp;</span>
            <span className={getTitle()}>Experience&nbsp;</span>
            <br />
            <span className={getTitle()}>with&nbsp;</span>
          </div>

          <div>
            <Image
              alt="Picture of the author"
              className="m-auto mt-4"
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
          <div className={subtitle({ class: "mt-4", color: "foreground" })}>
            Hard, Blood, Money.
          </div>
        </div>
      </header>
      <section
        className="flex justify-center items-center"
        style={{
          paddingLeft: "2 rem",
          paddingRight: "2 rem",
          margin: "0 auto",
          marginBottom: "2rem",
        }}
      >
        <Championships />
      </section>
    </div>
  );
}
