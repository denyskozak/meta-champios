"use client";

import React, { useEffect, useState } from "react";
import { useSuiClientQuery } from "@mysten/dapp-kit";

import {Button} from "@heroui/button";
import { Championship as ChampionshipContent } from "@/components/championship";
import { mapChampionshipRPC } from "@/utiltiies";
import { Championship } from "@/types";
import {useRouter} from "next/navigation";

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

  useEffect(() => {
    if (
      data?.data?.content?.dataType === "moveObject" &&
      data?.data?.content?.fields
    ) {
      const { fields } = data.data.content;

      setChampionship(mapChampionshipRPC(fields as any));
    }
  }, [data]);

  return (
      <div className="flex flex-col gap-4">
          <Button
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
          {championship && <ChampionshipContent data={championship} onRefresh={refetch}/>}

      </div>
  );
}
