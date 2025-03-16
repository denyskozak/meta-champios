"use client";

import {html} from "framer-motion/m";
import Championships from "@/components/championships";
import React, {useEffect, useState} from "react";
import {Championship as ChampionshipContent} from "@/components/championship";
import {useSuiClientQuery} from "@mysten/dapp-kit";
import {mapChampionshipRPC, MoveChampionshipRPC} from "@/utiltiies";
import {Championship} from "@/types";

export default function ChampionshipPage({params: paramsPromise}: { params: Promise<{ game: string }> }) {
    const params = React.use(paramsPromise);


    return <div>
        <Championships game={params.game} />
    </div>
}