import { formatUnits, parseUnits } from 'viem';

export const bigNumberify = (n) => {
    try {
        return BigInt(n);
    } catch (e) {
        console.error('bigNumberify error', e);
        return undefined;
    }
};

export const expandDecimals = (n, decimals) => {
    return bigNumberify(n) * BigInt(10 ** decimals);
};

const limitDecimals = (amount, maxDecimals) => {
    let amountStr = amount.toString();
    if (maxDecimals === undefined) {
        return amountStr;
    }
    if (maxDecimals === 0) {
        return amountStr.split('.')[0];
    }
    const dotIndex = amountStr.indexOf('.');
    if (dotIndex !== -1) {
        let decimals = amountStr.length - dotIndex - 1;
        if (decimals > maxDecimals) {
            amountStr = amountStr.substr(0, amountStr.length - (decimals - maxDecimals));
        }
    }
    return amountStr;
};

export const parseValue = (value, tokenDecimals) => {
    const pValue = parseFloat(value);

    if (isNaN(pValue)) {
        return undefined;
    }

    value = limitDecimals(value, tokenDecimals);
    const amount = parseUnits(value, tokenDecimals);
    return bigNumberify(amount);
};

const padDecimals = (amount, minDecimals) => {
    let amountStr = amount.toString();
    const dotIndex = amountStr.indexOf('.');
    if (dotIndex !== -1) {
        const decimals = amountStr.length - dotIndex - 1;
        if (decimals < minDecimals) {
            amountStr = amountStr.padEnd(amountStr.length + (minDecimals - decimals), '0');
        }
    } else {
        amountStr = amountStr + '.0000';
    }
    return amountStr;
};

function numberWithCommas(x) {
    if (!x) {
        return '...';
    }

    var parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
}

export const formatAmount = (amount, tokenDecimals, displayDecimals, useCommas, defaultValue?: any) => {
    if (!defaultValue) {
        defaultValue = '...';
    }
    if (amount === undefined || amount.toString().length === 0) {
        return defaultValue;
    }
    if (displayDecimals === undefined) {
        displayDecimals = 4;
    }
    let amountStr = formatUnits(amount, tokenDecimals);
    amountStr = limitDecimals(amountStr, displayDecimals);
    if (displayDecimals !== 0) {
        amountStr = padDecimals(amountStr, displayDecimals);
    }
    if (useCommas) {
        return numberWithCommas(amountStr);
    }
    return amountStr;
};
