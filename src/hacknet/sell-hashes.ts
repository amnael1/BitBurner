import { NS } from '@ns'
import { HacknetUpgrade } from 'models/hacknet-upgrade';

export async function main(ns : NS) : Promise<void> {
    
    const index = ns.args[0] as number;

    getHacknetUpgrades(ns).forEach(upgrade => ns.tprintf("[ %i ] => [ %s ] Costs [ %d ]", upgrade.index, upgrade.name, upgrade.costs));

    if(index !== undefined) {
        const hacknetUpgrade = getHacknetUpgrade(ns, index);
    
        ns.tprintf("Hacknet upgrade [ %s ] at index [ %i ]", hacknetUpgrade.name, index);
    
        do {
            const totalHashes = ns.hacknet.numHashes();
            
            if(totalHashes >= hacknetUpgrade.costs) {
                const hashesSpent = ns.hacknet.spendHashes(hacknetUpgrade.name);
    
                ns.printf("Hashes spent [ %t ]", hashesSpent);
            }
    
            await ns.sleep(50);
        } while(true);
    }
}

function getHacknetUpgrades(ns: NS): HacknetUpgrade[] {
    const hacknetUpgrades = [];

    let index = 0;

    const hashUpgrades = ns.hacknet.getHashUpgrades();

    for(const hashUpgrade of hashUpgrades) {
        const hashUpgradeCost = ns.hacknet.hashCost(hashUpgrade);

        hacknetUpgrades.push(
            {
                index: index,
                name: hashUpgrade,
                costs: hashUpgradeCost
            } as HacknetUpgrade
        );

        index++;
    }

    return hacknetUpgrades;
}

function getHacknetUpgrade(ns: NS, index: number): HacknetUpgrade {
    return getHacknetUpgrades(ns).filter(upgrade => upgrade.index === index)[0];
}