"use client";

import { Card } from "@heroui/react";

import { FAQ } from "@/components/faq";

export default function Home() {
  return (
    <div className="w-full  h-full flex justify-center items-center">
      <Card className="w-4/5">
        <FAQ />
      </Card>
    </div>
  );
}
