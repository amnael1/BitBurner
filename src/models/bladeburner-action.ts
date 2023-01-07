export interface BladeburnerAction {
    name: string;
    type: string;
    successChance: number;
    contractsRemaining: number;
    actionTime: number;
    reputationGain: number;
}