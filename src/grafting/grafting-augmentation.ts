import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    do {
        const isBusy = ns.singularity.isBusy();

        if(isBusy) {
            await ns.sleep(10000);
            continue;
        }

        const augmentations = ns.grafting.getGraftableAugmentations();

        for(const augemntation of augmentations) {
            const started = ns.grafting.graftAugmentation(augemntation, false);

            if(started) {
                break;
            }
        }

        await ns.sleep(10000);
    } while(true);
}