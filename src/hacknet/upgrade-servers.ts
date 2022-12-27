import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    
    do {
        for(let i = 0; i < ns.hacknet.numNodes(); i++) {
            upgradeLevel(ns, i);
            upgradeRam(ns, i);
            upgradeCore(ns, i);
            upgradeCache(ns, i);
        }

        await ns.sleep(60000); // 1 Minute
    } while(true);

}

function upgradeCache(ns: NS, index: number): void {
    const upgradeCost = ns.hacknet.getCacheUpgradeCost(index, 1);
    const playerMoney = ns.getPlayer().money;

    if((Number.POSITIVE_INFINITY !== upgradeCost && Number.NEGATIVE_INFINITY !== upgradeCost) && playerMoney >= upgradeCost) {
        const updated = ns.hacknet.upgradeCache(index, 1);

        ns.printf("[ %d ] Cache updated => [ %t ]", index, updated);
    }
}

function upgradeCore(ns: NS, index: number): void {
    const upgradeCost = ns.hacknet.getCoreUpgradeCost(index, 1);
    const playerMoney = ns.getPlayer().money;

    if((Number.POSITIVE_INFINITY !== upgradeCost && Number.NEGATIVE_INFINITY !== upgradeCost) && playerMoney >= upgradeCost) {
        const updated = ns.hacknet.upgradeCore(index, 1);

        ns.printf("[ %d ] Core updated => [ %t ]", index, updated);
    }
}

function upgradeLevel(ns: NS, index: number): void {
    const upgradeCost = ns.hacknet.getLevelUpgradeCost(index, 1);
    const playerMoney = ns.getPlayer().money;

    if((Number.POSITIVE_INFINITY !== upgradeCost && Number.NEGATIVE_INFINITY !== upgradeCost) && playerMoney >= upgradeCost) {
        const updated = ns.hacknet.upgradeLevel(index, 1);

        ns.printf("[ %d ] Level updated => [ %t ]", index, updated);
    }
}

function upgradeRam(ns: NS, index: number): void {
    const upgradeCost = ns.hacknet.getRamUpgradeCost(index, 1);
    const playerMoney = ns.getPlayer().money;

    if((Number.POSITIVE_INFINITY !== upgradeCost && Number.NEGATIVE_INFINITY !== upgradeCost) && playerMoney >= upgradeCost) {
        const updated = ns.hacknet.upgradeRam(index, 1);

        ns.printf("[ %d ] Ram updated => [ %t ]", index, updated);
    }
}