import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    
    do {

        if(ns.heart.break() <= -54000) {
            ns.tprint("Create gang...");

            ns.gang.createGang("Slum Snakes");
        }

        await ns.sleep(1000);
    } while(!ns.gang.inGang())

}