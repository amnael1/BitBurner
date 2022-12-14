import { NS } from '@ns'
import { getServersWithoutAdminRights } from 'libs/helpers'

export async function main(ns: NS): Promise<void> {

    for (const server of getServersWithoutAdminRights(ns)) {
        getRootAccess(ns, server);
    }

}

function hackSsh(ns: NS, server: string) {
    if (ns.fileExists("BruteSSH.exe")) {
        ns.tprintf("[ %s ] Hack SSH...", server);
        ns.brutessh(server);
    }
}

function hackFtp(ns: NS, server: string) {
    if (ns.fileExists("FTPCrack.exe")) {
        ns.tprintf("[ %s ] Hack FTP...", server);
        ns.ftpcrack(server);
    }
}

function hackSmtp(ns: NS, server: string) {
    if (ns.fileExists("relaySMTP.exe")) {
        ns.tprintf("[ %s ] Hack SMTP...", server);
        ns.relaysmtp(server);
    }
}

function hackHttp(ns: NS, server: string) {
    if (ns.fileExists("HTTPWorm.exe")) {
        ns.tprintf("[ %s ] Hack HTTP...", server);
        ns.httpworm(server);
    }
}

function hackSql(ns: NS, server: string) {
    if (ns.fileExists("SQLInject.exe")) {
        ns.tprintf("[ %s ] Hack SQL...", server);
        ns.sqlinject(server);
    }
}

function runNuke(ns: NS, server: string) {
    ns.tprintf("[ %s ] Get root access...", server);
    ns.nuke(server);
}

function hackPorts(ns: NS, server: string) {
    hackSsh(ns, server);
    hackFtp(ns, server);
    hackSmtp(ns, server);
    hackHttp(ns, server);
    hackSql(ns, server);
}

function getExistingHacksOnHome(ns: NS) {
    let existingHacks = 0;

    if (ns.fileExists("brutessh.exe", "home")) {
        existingHacks += 1;
    }

    if (ns.fileExists("ftpcrack.exe", "home")) {
        existingHacks += 1;
    }

    if (ns.fileExists("relaysmtp.exe", "home")) {
        existingHacks += 1;
    }

    if (ns.fileExists("httpworm.exe", "home")) {
        existingHacks += 1;
    }

    if (ns.fileExists("sqlinject.exe", "home")) {
        existingHacks += 1;
    }

    return existingHacks;
}

function getRootAccess(ns: NS, server: string): void {
    const userHackingLevel = ns.getHackingLevel();
    const requiredHackingLevel = ns.getServerRequiredHackingLevel(server);

    if (userHackingLevel < requiredHackingLevel) {
        return;
    }

    if (ns.hasRootAccess(server) === true) {
        logRootServerInfo(ns, server);

        return;
    }

    if (ns.getServerNumPortsRequired(server) === 0) {
        runNuke(ns, server);
        logRootServerInfo(ns, server);
    } else if (getExistingHacksOnHome(ns) >= ns.getServerNumPortsRequired(server)) {
        hackPorts(ns, server);
        runNuke(ns, server);
        logRootServerInfo(ns, server);
    }

    return;
}

function logRootServerInfo(ns: NS, server: string) {
    const maxRam = ns.getServerMaxRam(server);

    ns.tprintf("*******************")
    ns.tprintf("Root access [ %s ]", server);
    ns.tprintf("Max ram [ %d ]", maxRam);
}