import { NS } from '@ns'
import { getServerPath, getServersWithAdminRightsWithoutTarget } from 'libs/helpers'
import { HOME_SERVER } from 'libs/constants';

export async function main(ns : NS) : Promise<void> {
    const servers = getServersWithAdminRightsWithoutTarget(ns);

    for(const server of servers) {
        const serverPath = getServerPath(ns, server);

        for(let i = 1; i <= serverPath.length; i++) {
            if(serverPath[0] === HOME_SERVER) {
                continue;
            }

            if(i === serverPath.length) {
                await ns.singularity.installBackdoor();
            } else {
                const connected = await ns.singularity.connect(serverPath[i]);

                ns.tprintf("Server connected [ %s ] => [ %t ]", serverPath[i], connected);
            }
        }
    }
}