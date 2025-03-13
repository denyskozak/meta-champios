export const MIST_PER_SUI = 1000000000;

export function convertSuiToMist(suiAmount: number) {
    return suiAmount * MIST_PER_SUI;
}

export   const renderStatus = (status: number): string => {
    switch (status) {
        case 0:
            return 'Open (wait new joiners, you can start with button below)';
            break
        case 1:
            return 'On-going (started, wait to choose winners and complete)';
            break
        case 2:
            return 'Done';
            break
        default:
            return 'Unknown';
    }
};