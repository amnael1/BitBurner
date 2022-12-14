import { NS } from '@ns'

const MONEY_TO_STEAL_IN_PROCENT = 30;
const GROWTH_MULTIPLIER = 1.5;
const SLEEP_TIMEOUT_BUFFER = 500;
ß
export async function main(ns: NS): Promise<void> {

    while (true) {
        ns.printf("*****************************************************************");

        await ns.sleep(SLEEP_TIMEOUT_BUFFER);

        const masterServer = getMasterServer();
        const targetServer = getTargetServer();
        const serverSecurityLevel = ns.getServerSecurityLevel(targetServer);
        const serverMinSecurityLevel = ns.getServerMinSecurityLevel(targetServer);

        const serverMoneyAvailable = ns.getServerMoneyAvailable(targetServer);
        const serverMaxMoney = ns.getServerMaxMoney(targetServer);

        const serverMaxRam = ns.getServerMaxRam(masterServer);
        const serverUsedRam = ns.getServerUsedRam(masterServer);
        const serverFreeRam = (serverMaxRam - serverUsedRam);
        const possibleThreadsForWeaken = Math.floor((serverFreeRam / getWeakenRamScriptUsed(ns)));
        const possibleThreadsForGrow = Math.floor((serverFreeRam / getGrowRamScriptUsed(ns)));
        const possibleThreadsForHack = Math.floor((serverFreeRam / getHackRamScriptUsed(ns)));

        ns.printf("Master [ %s ] - Target [ %s ]", masterServer, targetServer);
        ns.printf("Money available [ %s ] - Max money [ %s ]", serverMoneyAvailable.toLocaleString("de-CH"), serverMaxMoney.toLocaleString("de-CH"));
        ns.printf("Server security level [ %d ] - Server min security level [ %d ]", serverSecurityLevel, serverMinSecurityLevel);

        if ((serverSecurityLevel - (serverSecurityLevel * 0.10)) > serverMinSecurityLevel) {
            // Add buffer of 200ms
            const neededWeakenTime = getSleepTimeout(ns.getWeakenTime(targetServer));

            const usedThreads = getUsedThreadsForWeaken(ns, serverSecurityLevel, serverMinSecurityLevel, possibleThreadsForWeaken);

            ns.printf("Needed weaken time [ %d ms ]", neededWeakenTime);

            const copied = await ns.scp(getWeakenScriptName(), masterServer);

            ns.printf("weaken.script copied [ %t ]", copied);

            const processId = ns.exec(getWeakenScriptName(), masterServer, usedThreads, targetServer);

            ns.printf("weaken.script process created [ %t ]", (processId > 0));

            await ns.sleep(neededWeakenTime);

            ns.printf("weaken.script process killed [ %t ]", ns.kill(processId, masterServer));

        } else if (serverMoneyAvailable < serverMaxMoney) {
            // Add buffer of 200ms
            const neededGrowTime = getSleepTimeout(ns.getGrowTime(targetServer));

            const usedThreads = getUsedThreadsForGrow(ns, targetServer, possibleThreadsForGrow);

            ns.printf("Needed grow time [ %d ms ]", neededGrowTime);

            const copied = await ns.scp(getGrowScriptName(), masterServer);

            ns.printf("grow.script copied [ %t ]", copied);

            const processId = ns.exec(getGrowScriptName(), masterServer, usedThreads, targetServer);

            ns.printf("grow.script process created [ %t ]", (processId > 0));

            await ns.sleep(neededGrowTime);

            ns.printf("grow.script process killed [ %t ]", ns.kill(processId, masterServer));

        } else {
            const neededHackTime = getSleepTimeout(ns.getHackTime(targetServer));

            const usedThreads = getUsedThreadsForHack(ns, targetServer, possibleThreadsForHack);

            ns.printf("Needed hack time [ %d ms ]", neededHackTime);

            const copied = await ns.scp(getHackScriptName(), masterServer);

            ns.printf("hack.script copied [ %t ]", copied);

            const processId = ns.exec(getHackScriptName(), masterServer, usedThreads, targetServer);

            ns.printf("hack.script process created [ %t ]", (processId > 0));

            await ns.sleep(neededHackTime);

            ns.printf("hack.script process killed [ %t ]", ns.kill(processId, masterServer));
        }
    }
}

function getUsedThreadsForWeaken(ns: NS, serverSecurityLevel: number, serverMinSecurityLevel: number, possibleThreadsForWeaken: number): number {
    const securityDifferent = serverSecurityLevel - serverMinSecurityLevel;
    const neededThreads = Math.floor(securityDifferent / 0.05);

    return getUsedThreads(ns, neededThreads, possibleThreadsForWeaken) + 1;
}

function getUsedThreadsForGrow(ns: NS, targetServer: string, possibleThreadsForGrow: number): number {
    const neededThreads = ns.growthAnalyze(targetServer, GROWTH_MULTIPLIER);

    return getUsedThreads(ns, neededThreads, possibleThreadsForGrow);
}

function getUsedThreadsForHack(ns: NS, targetServer: string, possibleThreadsForHack: number): number {
    const possibleProcentToHack = ns.hackAnalyze(targetServer) * 100;
    const neededThreads = getNeededThreadsForHack(possibleProcentToHack);

    return getUsedThreads(ns, neededThreads, possibleThreadsForHack);
}

function getSleepTimeout(timeout: number): number {
    return Math.ceil(timeout) + SLEEP_TIMEOUT_BUFFER;
}

function getMasterServer(ns: NS): string {
    return ns.args[0];
}

function getTargetServer(ns: NS): string {
    return ns.args[1];
}

function getWeakenRamScriptUsed(ns: NS): number {
    return ns.getScriptRam(getWeakenScriptName());
}

function getGrowRamScriptUsed(ns: NS): number {
    return ns.getScriptRam(getGrowScriptName());
}

function getHackRamScriptUsed(ns: NS): number {
    return ns.getScriptRam(getHackScriptName());
}

function getUsedThreads(ns: NS, neededThreads: number, possibleThreads: number): number {
    ns.printf("Needed threads [ %d ] - Possible threads [ %d ]", neededThreads, possibleThreads);

    if (neededThreads <= 0) {
        return 1;
    }

    if (possibleThreads >= neededThreads) {
        return neededThreads;
    }

    return possibleThreads;
}

function getNeededThreadsForHack(ns: NS, possibleProcentToHack: number): number {
    let neededThreads = 1;
    let procent = possibleProcentToHack;

    while (procent < MONEY_TO_STEAL_IN_PROCENT) {
        neededThreads++;
        procent = possibleProcentToHack + procent;
    }

    ns.printf("Procent bevore loop [ %d ] - Procent after loop [ %d ]", possibleProcentToHack, procent);

    return neededThreads;
}

function getWeakenScriptName(): string {
    return "/hack/basic/weaken.script";
}

function getGrowScriptName(): string {
    return "/hack/basic/grow.script";
}

function getHackScriptName(): string {
    return "/hack/basic/hack.script";
}