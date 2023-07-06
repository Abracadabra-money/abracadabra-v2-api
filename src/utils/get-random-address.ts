import { Address } from 'viem';

export function getRandomAddress(): Address {
    const length: number = 40;
    const number: string = [...Array(length)]
        .map(() => {
            return Math.floor(Math.random() * 16).toString(16);
        })
        .join('');

    return ('0x' + number) as Address;
}
