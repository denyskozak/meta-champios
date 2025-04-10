"use client";
import React from "react";
import { Card, Image } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function ChampionshipPage() {
  const router = useRouter();

  return (

      <div className="fade-in-animation overflow-hidden h-full">
        <section className="w-screen h-screen flex justify-center items-center gap-4 flex-col">
          <span>Choose game</span>
          <Card
            isPressable
            className="border-none"
            radius="lg"
            onPress={() => router.push("/championships/LoL")}
          >
            <Image
              alt="Woman listing to music"
              className="object-cover "
              height={200}
              src="/logo_LoL.png"
              width={200}
            />
          </Card>
        </section>
      </div>

  );
}
