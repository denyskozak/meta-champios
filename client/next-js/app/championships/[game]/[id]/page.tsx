"use client";

import React, { useEffect, useState } from "react";
import { useSuiClientQuery } from "@mysten/dapp-kit";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

import { Championship as ChampionshipContent } from "@/components/championship";
import { mapChampionshipRPC } from "@/utiltiies";
import { Championship } from "@/types";

export default function ChampionshipPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = React.use(paramsPromise);
  const router = useRouter();
  const [championship, setChampionship] = useState<Championship | null>(null);

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

  // Auto update champ each 5s
    useEffect(() => {
        const intervalId = setInterval(() => refetch(), 5000);
        return () => clearInterval(intervalId);
    }, []);

    // Parse champ data
  useEffect(() => {
    if (
      data?.data?.content?.dataType === "moveObject" &&
      data?.data?.content?.fields
    ) {
      const { fields } = data.data.content;

      console.log("fields ", fields);
      setChampionship(mapChampionshipRPC(fields as any));
    }
  }, [data]);

  return (
    <div className="flex flex-col h-full pt-4">
      <div>
          <Button
              className="mb-4 h-8"
              color="secondary"
              radius="lg"
              size="sm"
              variant="solid"
              onPress={() => {
                  router.push(`/championships/${championship?.gameName}`);
              }}
          >
              Back
          </Button>
      </div>
      {championship && (
        <ChampionshipContent data={championship} onRefresh={refetch} />
      )}
    </div>
  );
}
