export const MIST_PER_SUI = 1000000000;

export function convertSuiToMist(suiAmount: number) {
    return suiAmount * MIST_PER_SUI;
}

export   const renderStatus = (status: number): string => {
    switch (status) {
        case 0:
            return 'Open';
            break
        default:
            return 'Unknown';
    }
};