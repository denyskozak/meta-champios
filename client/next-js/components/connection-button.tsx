import { ConnectModal, useCurrentAccount } from "@mysten/dapp-kit";
import React, { useState } from "react";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

export function ConnectionButton() {
  const currentAccount = useCurrentAccount();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (currentAccount) {
    return (
      <Button color="secondary" onPress={() => router.push("/profile")}>
        Profile
      </Button>
    );
  }

  return (
    <ConnectModal
      open={open}
      trigger={
        <Button>
          <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-pulse opacity-100 group-hover:opacity-100 blur-md" />
          <span className="relative z-10">Connect</span>
        </Button>
      }
      onOpenChange={(isOpen) => setOpen(isOpen)}
    />
  );
}
