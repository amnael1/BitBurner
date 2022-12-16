import { NS } from '@ns'
import { getServerPath } from 'libs/helpers'

export async function main(ns : NS) : Promise<void> {
    //
    getServerPath(ns, "serverName");
}