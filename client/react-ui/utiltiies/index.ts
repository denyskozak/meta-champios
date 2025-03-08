export const MIST_PER_SUI = 1000000000;

export function convertSuiToMist(suiAmount: number) {
    return suiAmount * MIST_PER_SUI;
}