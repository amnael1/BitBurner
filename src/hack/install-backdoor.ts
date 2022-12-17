import { NS } from '@ns'
import { getServerPath, getServersWithAdminRightsWithoutTarget } from 'libs/helpers'
import { HOME_SERVER } from 'libs/constants';

export async function main(ns : NS) : Promise<void> {
    const servers = getServersWithAdminRightsWithoutTarget(ns).filter(server => {
        const serverInfo = ns.getServer(server);

        return !serverInfo.backdoorInstalled;
    });

    ns.tprintf("START [ %s ]", new Date().toLocaleString("de-CH"));

    for(const server of servers) {
        const serverPath = getServerPath(ns, server);
        
        ns.tprintf("----------------------------");
        ns.tprintf("Find path for server [ %s ]", server);

        for(let i = 1; i <= serverPath.length; i++) {
            if(i === serverPath.length) {
                ns.tprintf("Installing backdoor [ %s ]...", server);

                await ns.singularity.installBackdoor();
            } else {
                const connected = await ns.singularity.connect(serverPath[i]);

                ns.tprintf("Server connected [ %s ] => [ %t ]", serverPath[i], connected);
            }
        }

        ns.tprintf("Backdoor installed [ %s ] => [ %t ]", server, ns.getServer(server).backdoorInstalled);
        
        await ns.singularity.connect(HOME_SERVER);
    }

    ns.tprintf("DONE [ %s ]", new Date().toLocaleString("de-CH"));
}