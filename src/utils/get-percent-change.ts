export const getPercentChange = (now: string | undefined, prew: string | undefined): number => {
    if (now && prew) {
        const change = ((parseFloat(now) - parseFloat(prew)) / parseFloat(prew)) * 100;
        if (isFinite(change)) return change;
    }
    return 0;
};
