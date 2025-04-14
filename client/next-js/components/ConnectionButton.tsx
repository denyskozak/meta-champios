import { ConnectModal, useCurrentAccount } from '@mysten/dapp-kit';
import { useState } from 'react';
import {Button} from "@heroui/react";

export function ConnectionButton() {
    const currentAccount = useCurrentAccount();
    const [open, setOpen] = useState(false);

    return (
        <ConnectModal
            trigger={
                <Button disabled={!!currentAccount}> {currentAccount ? 'Wallet Connected' : 'Connect Wallet'}</Button>
            }
            open={open}
            onOpenChange={(isOpen) => setOpen(isOpen)}
        />
    );
}