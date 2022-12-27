import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {

    while(ns.hacknet.numNodes() < ns.hacknet.maxNumNodes()) {
        if(ns.getPlayer().money >= ns.hacknet.getPurchaseNodeCost()) {
            const index = ns.hacknet.purchaseNode();
    
            ns.printf("[ %d ] Hacknet node purchased [ %t ]", index, (index >= 0));
        }

        await ns.sleep(1000);
    }

}