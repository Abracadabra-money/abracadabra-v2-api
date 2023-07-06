export const glpRewardReaderAbi = [
    {
        inputs: [
            {
                internalType: 'address',
                name: '_account',
                type: 'address',
            },
            {
                internalType: 'address[]',
                name: '_depositTokens',
                type: 'address[]',
            },
            {
                internalType: 'address[]',
                name: '_rewardTrackers',
                type: 'address[]',
            },
        ],
        name: 'getDepositBalances',
        outputs: [
            {
                internalType: 'uint256[]',
                name: '',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_account',
                type: 'address',
            },
            {
                internalType: 'address[]',
                name: '_rewardTrackers',
                type: 'address[]',
            },
        ],
        name: 'getStakingInfo',
        outputs: [
            {
                internalType: 'uint256[]',
                name: '',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_account',
                type: 'address',
            },
            {
                internalType: 'address[]',
                name: '_vesters',
                type: 'address[]',
            },
        ],
        name: 'getVestingInfoV2',
        outputs: [
            {
                internalType: 'uint256[]',
                name: '',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
] as const;
