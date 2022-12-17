import { NS } from '@ns'
import { P_SERVER_PREFIX } from 'libs/constants';

export async function main(ns: NS): Promise<void> {
    const serverName = ns.args[0];
    const serverGb = ns.args[1];

    for (let i = 1; i <= 20; i++) {
        ns.tprintf("[ %s GB ] => [ %s $ ]", Math.pow(2, i).toLocaleString("de-CH"), ns.getPurchasedServerCost(Math.pow(2, i)).toLocaleString("de-CH"));
    }

    if (serverName && serverGb) {
        ns.purchaseServer(P_SERVER_PREFIX + serverName, serverGb);
    }
}