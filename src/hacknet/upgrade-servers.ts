import { NS } from '@ns'
import { HacknetServerUpgrade } from 'libs/enums';
import { HACKNET_UPGRADE_LEVEL } from 'libs/constants';

export async function main(ns : NS) : Promise<void> {
    
    do {
        for(let i = 0; i < ns.hacknet.numNodes(); i++) {
            const type = getCheapestUpgrade(ns, i);

            upgradeHacknet(ns, i, type);
        }

        await ns.sleep(60000);
    } while(true);
}

function upgradeHacknet(ns: NS, index: number, type: HacknetServerUpgrade): void {
    switch(type) {
        case HacknetServerUpgrade.CORE:
            ns.printf("[ %d ] Core updated => [ %t ]", index, ns.hacknet.upgradeCore(index, HACKNET_UPGRADE_LEVEL));
            break;
        case HacknetServerUpgrade.LEVEL:
            ns.printf("[ %d ] Level updated => [ %t ]", index, ns.hacknet.upgradeLevel(index, HACKNET_UPGRADE_LEVEL));
            break;
        case HacknetServerUpgrade.RAM:
            ns.printf("[ %d ] Ram updated => [ %t ]", index, ns.hacknet.upgradeRam(index, HACKNET_UPGRADE_LEVEL));
            break;
        default:
            ns.printf("[ %d ] Nothing to update!", index);
            break;
    }
}

function getCheapestUpgrade(ns: NS, index: number): HacknetServerUpgrade {
    const map = new Map<HacknetServerUpgrade, number>();
    map.set(HacknetServerUpgrade.LEVEL, getUpgradeCost(ns, ns.hacknet.getLevelUpgradeCost(index, HACKNET_UPGRADE_LEVEL)));
    map.set(HacknetServerUpgrade.CORE, getUpgradeCost(ns, ns.hacknet.getCoreUpgradeCost(index, HACKNET_UPGRADE_LEVEL)));
    map.set(HacknetServerUpgrade.RAM, getUpgradeCost(ns, ns.hacknet.getRamUpgradeCost(index, HACKNET_UPGRADE_LEVEL)));

    const sortedMap = new Map(
        [...map.entries()]
        .filter(item => item[1] !== -1)
        .sort((a, b) => a[1] - b[1])
    );
    
    const value = sortedMap.entries().next().value;

    if(value !== undefined && Array.isArray(value)) {
        return value[0];
    }

    return HacknetServerUpgrade.NONE;
}

function getUpgradeCost(ns: NS, upgradeCost: number): number {
    const playerMoney = ns.getPlayer().money;

    if((Number.POSITIVE_INFINITY !== upgradeCost && Number.NEGATIVE_INFINITY !== upgradeCost) && playerMoney >= upgradeCost) {
        return upgradeCost;
    }

    return -1;
}