"use client";

import {html} from "framer-motion/m";
import Championships from "@/components/championships";
import React, {useEffect, useState} from "react";
import {Championship as ChampionshipContent} from "@/components/championship";
import {useSuiClientQuery} from "@mysten/dapp-kit";
import {mapChampionshipRPC, MoveChampionshipRPC} from "@/utiltiies";
import {Championship} from "@/types";
import {Button} from "@heroui/button";
import {useRouter} from "next/navigation";

export default function ChampionshipPage({params: paramsPromise}: { params: Promise<{ game: string }> }) {
    const params = React.use(paramsPromise);
    const router = useRouter();


    return <div>

            <Button
                radius="lg"
                size="sm"
                variant="solid"
                color="secondary"
                onPress={() => {
                    router.push(`/championships`);
                }}
            >
                Back
            </Button>
            <Championships game={params.game}/>
        </div>
        }