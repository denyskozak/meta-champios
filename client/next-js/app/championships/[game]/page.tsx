"use client";

import React from "react";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

import Championships from "@/components/championships";

export default function ChampionshipPage({
  params: paramsPromise,
}: {
  params: Promise<{ game: string }>;
}) {
  const params = React.use(paramsPromise);
  const router = useRouter();

  return (
    <div>
      <Button
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
      <Championships game={params.game} />
    </div>
  );
}
