import { NS } from '@ns'
import { ServerTarget } from 'models/server-target';

export function getServersWithAdminRights(ns: NS, masterServers: []): ServerTarget[] {
    const foundServers = findServers(ns).filter(server => {
        const serverInfo = ns.getServer(server);

        return serverInfo.hasAdminRights && serverInfo.moneyMax > 0;
    });

    return getMasterTargets(foundServers, masterServers);
}

export function getServersWithoutAdminRights(ns: NS): string[] {
    const currentPlayerHackingLvl = ns.getHackingLevel();

    return findServers(ns).filter(server => {
        const serverInfo = ns.getServer(server);

        return !serverInfo.hasAdminRights && currentPlayerHackingLvl >= serverInfo.requiredHackingSkill;
    });
}

function getMasterTargets(foundServers: string[], masterServers: string[]): ServerTarget[] {
    let masterServerCounter = 0;
    const targets = [];

    for (const server of foundServers) {
        targets.push({
            master: masterServers[masterServerCounter],
            target: server
        });

        if (masterServers.length > 1) {
            if (masterServers.length === (masterServerCounter + 1)) {
                masterServerCounter = 0;
            } else {
                masterServerCounter++;
            }
        }
    }

    return targets;
}

function findServers(ns: NS): string[] {
    const serversSeen = ['home'];

    for (let i = 0; i < serversSeen.length; i++) {
        const thisScan = ns.scan(serversSeen[i]);

        for (let j = 0; j < thisScan.length; j++) {
            if (serversSeen.indexOf(thisScan[j]) === -1) {
                serversSeen.push(thisScan[j]);
            }
        }
    }

    return serversSeen.filter(server => server !== 'home' && !server.startsWith('server'));
}