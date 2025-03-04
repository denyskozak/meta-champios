"use client";

import type {ThemeProviderProps} from "next-themes";

import * as React from "react";
import {HeroUIProvider} from "@heroui/system";
import {useRouter} from "next/navigation";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import {SuiClient} from '@mysten/sui/client';
import {ZKLoginProvider} from 'react-sui-zk-login-kit';

import {createNetworkConfig, SuiClientProvider, useSuiClient, WalletProvider} from '@mysten/dapp-kit';
import {getFullnodeUrl} from '@mysten/sui/client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
// Config options for the networks you want to connect to

const {networkConfig} = createNetworkConfig({
    testnet: {url: getFullnodeUrl('devnet')},
});
const queryClient = new QueryClient();


export interface ProvidersProps {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
    interface RouterConfig {
        routerOptions: NonNullable<
            Parameters<ReturnType<typeof useRouter>["push"]>[1]
        >;
    }
}

const SubProviders = ({ children }: { children: React.ReactNode; }) => {
    const suiClient = useSuiClient();

    return (
        <ZKLoginProvider client={suiClient}>
            { children }
        </ZKLoginProvider>
    )
}

export function Providers({children, themeProps}: ProvidersProps) {
    const router = useRouter();

    return (
        <HeroUIProvider navigate={router.push}>
            <QueryClientProvider client={queryClient}>
                <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
                    <SubProviders>
                        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
                    </SubProviders>
                </SuiClientProvider>
            </QueryClientProvider>
        </HeroUIProvider>
    );
}
