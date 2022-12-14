import { NS } from '@ns'
import { getServersWithAdminRights } from 'libs/helpers';
import { ServerTarget } from 'models/server-target';

const MAX_SERVERS_TO_HACK = 1;
const MASTER_SERVERS = [
    "home"
]

export async function main(ns : NS) : Promise<void> {

	killScriptsOnMaster(ns);

	await ns.sleep(1000);

	let counter = 0;

	for (const item of findServersWithAdminRights()) {
		if (counter >= MAX_SERVERS_TO_HACK) {
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

function killScriptsOnMaster(ns: NS): void {
    ns.tprintf("Scripts killed on [ home ] => [ %t ] ", ns.killall('home', true));

    for (const item of getMasterServers()) {
        if (item.master === "home") {
            continue;
        }

        ns.tprintf("Scripts killed on [ %s ] => [ %t ] ", item.master, ns.killall(item.master));
    }
}

function getMasterServers(): string[] {
    const uniqueIds = [];

    return SERVERS_TO_HACK.filter(element => {
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

function findServersWithAdminRights(): ServerTarget[] {
    const foundServers = getServersWithAdminRights();

    let masterServerCounter = 0;
    const servers = [];

    for (const server of foundServers) {
        servers.push({
            master: MASTER_SERVERS[masterServerCounter],
            target: server
        });

        if (MASTER_SERVERS.length > 1) {
            if (MASTER_SERVERS.length === (masterServerCounter + 1)) {
                masterServerCounter = 0;
            } else {
                masterServerCounter++;
            }
        }
    }

    return servers;
}