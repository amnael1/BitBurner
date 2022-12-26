import { NS } from '@ns'
import { Crime } from 'libs/enums';

export async function main(ns : NS) : Promise<void> {

    for(const crime of getCrimes()) {
        const crimeStats = ns.singularity.getCrimeStats(crime);
        
        ns.tprintf("[ %s ] Original Karma [ %i ] => Karma / second [ %d ]", crimeStats.name, crimeStats.karma, (crimeStats.karma / (crimeStats.time / 1000)));
    }

}

function getCrimes(): string[] {
    return Object.values(Crime);
}