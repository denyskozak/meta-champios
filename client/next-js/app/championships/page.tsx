"use client";
import React, {useState} from "react";
import {Card, CircularProgress, Image} from "@heroui/react";
import {useRouter} from "next/navigation";

export default function ChampionshipPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    return (
        // <div className="fade-in-animation overflow-hidden h-full">
        <section className="w-screen h-screen flex justify-center items-center gap-4 flex-col">
            <span>Choose game</span>
            {loading ? (<CircularProgress aria-label="Loading..." color="primary"/>) : (null)}
            <Card
                isPressable
                className="border-none"
                radius="lg"
                onPress={() => {
                    setLoading(true);
                    router.push("/championships/LoL");
                }}
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
        // </div>
    );
}
