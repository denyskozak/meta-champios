"use client";

import React from "react";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

import Championships from "@/components/championships";
import {Card} from "@heroui/card";

export default function ChampionshipPage({
  params: paramsPromise,
}: {
  params: Promise<{ game: string }>;
}) {
  const params = React.use(paramsPromise);
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <Button
        color="secondary"
        radius="lg"
        size="sm"
        variant="solid"
        className="w-32"
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
