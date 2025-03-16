"use client";
import Championships from "@/components/championships";
import React, {useState} from "react";
import {Card, CardFooter, Image, Button} from "@heroui/react";
import {useRouter} from "next/navigation";

export default function ChampionshipPage() {
    const router = useRouter();

    return <div>
        <div className="fade-in-animation">
            <section className="w-screen h-screen flex justify-center items-center gap-4 flex-col">
                <span>Choose game</span>
                <Card className="border-none" radius="lg" isPressable onPress={() => router.push('/championships/LoL')}>
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
    </div>
}