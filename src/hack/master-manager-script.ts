import { NS } from '@ns'
import { getServersWithAdminRights } from 'libs/helpers';
import { HOME_SERVER } from 'libs/constants';
import { ServerTarget } from 'models/server-target';

export async function main(ns: NS): Promise<void> {
    const maxServersToHack = getMaxServersToHack(ns);
    const useHomeAsMaster = getUseHomeAsMaster(ns);

    const masterServers = ns.getPurchasedServers();

    if(useHomeAsMaster) {
        masterServers.push(HOME_SERVER);
    }

    const serversToHack = getServersWithAdminRights(ns, masterServers);

    killScriptsOnMaster(ns, serversToHack);

    await ns.sleep(1000);

    let counter = 0;

    for (const item of serversToHack) {
        if (maxServersToHack !== -1 && counter >= maxServersToHack) {
            break;
        }

        ns.tprintf("--------------------------------");

        killScripts(ns, item.target);
        executeManagerScript(ns, item.master, item.target);

        counter++;

        await ns.sleep(100);
    }

}

function executeManagerScript(ns: NS, masterServer: string, targetServer: string): void {
    const pid = ns.run(getManagerScriptName(), 1, masterServer, targetServer);

    ns.tprintf("Proccess created on [ %s => %s ] : [ %t ]", masterServer, targetServer, (pid > 0));
}

function killScripts(ns: NS, host: string): void {
    ns.tprintf("Scripts killed on server [ %t ] ", ns.killall(host));
}

function killScriptsOnMaster(ns: NS, serversToHack: ServerTarget[]): void {
    ns.tprintf("Scripts killed on [ home ] => [ %t ] ", ns.killall('home', true));

    for (const item of getMasterServers(serversToHack)) {
        if (item.master === HOME_SERVER) {
            continue;
        }

        ns.tprintf("Scripts killed on [ %s ] => [ %t ] ", item.master, ns.killall(item.master));
    }
}

function getMasterServers(serversToHack: ServerTarget[]): string[] {
    const uniqueIds = [];

    return serversToHack.filter(element => {
        const isDuplicate = uniqueIds.includes(element.master);

        if (!isDuplicate) {
            uniqueIds.push(element.master);

            return true;
        }

        return false;
    });
}

function getManagerScriptName(): string {
    return "/hack/manager-script.js";
}

function getMaxServersToHack(ns: NS): number {
    if(ns.args[0] === undefined) {
        return -1;
    }

    return (ns.args[0]) as number;
}

function getUseHomeAsMaster(ns: NS): boolean {
    if(ns.args[1] === undefined) {
        return false;
    }

    return (ns.args[1]) as boolean;
}