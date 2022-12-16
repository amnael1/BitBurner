import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {

    ns.tprintf("Date [ %s ] - Karma [ %d ]", new Date().toLocaleString("de-CH"), ns.heart.break());

    buyTorRouter(ns);
    buyDarkWebPrograms(ns);
}

function buyTorRouter(ns: NS): void {
    const purchasedTor = ns.singularity.purchaseTor();

    ns.tprintf("Tor router purchased [ %t ]", purchasedTor);
}

function buyDarkWebPrograms(ns: NS): void {
    const darkWebPrograms = ns.singularity.getDarkwebProgramCost();

    for (const darkWebProgram of darkWebPrograms) {
        const darkWebProgramCost = ns.singularity.getDarkwebProgramCost(darkWebProgram);
        const playerMoney = ns.getPlayer().money;

        if (playerMoney >= darkWebProgramCost) {
            const darkWebProgamPurchased = ns.singularity.purchaseProgram(darkWebProgram);

            ns.tprintf("Program [ %s ] purchased [ %t ]", darkWebProgram, darkWebProgamPurchased);
        }
    }
}