"use client";

import React, { useEffect, useState } from "react";
import { useSuiClientQuery } from "@mysten/dapp-kit";

import { Championship as ChampionshipContent } from "@/components/championship";
import { mapChampionshipRPC } from "@/utiltiies";
import { Championship } from "@/types";

export default function ChampionshipPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = React.use(paramsPromise);
  const [championship, setChampionship] = useState<Championship | null>(null);

  console.log("params ", params);
  const { data, isPending, isError, error, refetch } = useSuiClientQuery(
    "getObject",
    {
      id: params.id,
      options: {
        showContent: true,
      },
    },
    {
      gcTime: 10000,
    },
  );

  useEffect(() => {
    if (
      data?.data?.content?.dataType === "moveObject" &&
      data?.data?.content?.fields
    ) {
      const { fields } = data.data.content;

      setChampionship(mapChampionshipRPC(fields as any));
    }
  }, [data]);
  console.log("data ", data);

  console.log("championship ", championship);

  return (
    <div>
      <div className="fade-in-animation">
        {championship && <ChampionshipContent data={championship} onRefresh={refetch} />}
      </div>
    </div>
  );
}
