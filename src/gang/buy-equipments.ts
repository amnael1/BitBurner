import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {

    const buyAugmentations = ns.args[0];
    const gangMembers = ns.gang.getMemberNames();
    const equipments = ns.gang.getEquipmentNames();
    const playerMoney = ns.getPlayer().money;

    for (const gangMember of gangMembers) {
        for (const equipment of equipments) {
            if ((buyAugmentations === undefined || buyAugmentations === false) && ns.gang.getEquipmentType(equipment) === "Augmentation") {
                continue;
            }

            const equipmentCost = ns.gang.getEquipmentCost(equipment);

            if (playerMoney < equipmentCost) {
                ns.tprintf("Can not buy equipment [ %s ]", equipment);
                continue;
            }

            const purchased = ns.gang.purchaseEquipment(gangMember, equipment);

            if (purchased) {
                ns.tprintf("Equipment purchased [ %s ]", purchased);
            } else {
                ns.tprintf("Can not buy equipment [ %s ]", equipment);
            }
        }
    }

}