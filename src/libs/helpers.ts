import { NS } from '@ns'
import { ServerTarget } from 'models/server-target';
import { HOME_SERVER, P_SERVER_PREFIX } from 'libs/constants';

export function getServersWithAdminRights(ns: NS, masterServers: string[]): ServerTarget[] {
    const foundServers = getServersWithAdminRightsWithoutTarget(ns);

    return getMasterTargets(foundServers, masterServers);
}

export function getServersWithAdminRightsWithoutTarget(ns: NS): string[] {
    return findServers(ns).filter(server => {
        const serverInfo = ns.getServer(server);

        return serverInfo.hasAdminRights;
    });
}

export function getServersWithoutAdminRights(ns: NS): string[] {
    const currentPlayerHackingLvl = ns.getHackingLevel();

    return findServers(ns).filter(server => {
        const serverInfo = ns.getServer(server);

        return !serverInfo.hasAdminRights && currentPlayerHackingLvl >= serverInfo.requiredHackingSkill;
    });
}

export function getServerPath(ns: NS, server: string, startServer = HOME_SERVER): string[] {
    const route = [];
    const result = [];

    recursiveScan(ns, '', startServer, server, route);

    for (const i in route) {
        result.push(route[i]);
    }

    return result;
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
    const serversSeen = [HOME_SERVER];

    for (let i = 0; i < serversSeen.length; i++) {
        const thisScan = ns.scan(serversSeen[i]);

        for (let j = 0; j < thisScan.length; j++) {
            if (serversSeen.indexOf(thisScan[j]) === -1) {
                serversSeen.push(thisScan[j]);
            }
        }
    }

    return serversSeen.filter(server => server !== HOME_SERVER && !server.startsWith(P_SERVER_PREFIX) && server !== "darkweb");
}

function recursiveScan(ns: NS, parent: string, server: string, target: string, route: []): boolean {
    const children = ns.scan(server);
    
    for (const child of children) {
        if (parent == child) {
            continue;
        }
        
        if (child == target) {
            route.unshift(child);
            route.unshift(server);
            return true;
        }

        if (recursiveScan(ns, server, child, target, route)) {
            route.unshift(server);
            return true;
        }
    }

    return false;
}