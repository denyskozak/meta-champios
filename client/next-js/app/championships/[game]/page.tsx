"use client";

import React, {useState} from "react";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { Card } from "@heroui/card";

import Championships from "@/components/championships";

export default function ChampionshipPage({
  params: paramsPromise,
}: {
  params: Promise<{ game: string }>;
}) {
  const params = React.use(paramsPromise);
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 h-full pt-4">
      <Button
        className="w-32"
        color="secondary"
        radius="lg"
        size="sm"
        variant="solid"
        onPress={() => {
          router.push(`/championships`);
        }}
      >
        Back
      </Button>
      <Card className="p-4">
        <Championships game={params.game} />
      </Card>
    </div>
  );
}
