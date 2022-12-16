import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    ns.tprintf("Date [ %s ] - Karma [ %d ]", new Date().toLocaleString("de-CH"), ns.heart.break());
}