"use client";

import { Card } from "@heroui/react";

import { FAQ } from "@/components/faq";

export default function Rules() {
  return (
    <div className="w-full  h-full flex justify-center items-center">
        <Card className="max-w-4/5 p-4">
            Matches:<br/>
            - for pass regular round you need to win 2 times (BO-2)<br/>
            - for pass final round you need to win 3 times (BO-3)<br/>
        </Card>
    </div>
  );
}
