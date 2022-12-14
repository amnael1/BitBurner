import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {

    const gangeMembers = ns.gang.getMemberNames();
    const gangInfo = ns.gang.getGangInformation();

    for (const gangMember of gangeMembers) {
        if (gangInfo.wantedLevelGainRate > 0) {
            applyTask(ns, gangMember, "Vigilante Justice");
        } else {
            applyTask(ns, gangMember, "Traffick Illegal Arms");
        }
    }

}

function applyTask(ns: NS, memeber: string, taskName: string) {
    /*
    const memberInfo = ns.gang.getMemberInformation(member);
    const cha = memberInfo.cha;
    const agi = memberInfo.agi;
    const dex = memberInfo.dex;
    const def = memberInfo.def;
    const str = memberInfo.str;
    const hack = memberInfo.hack;
    */
   
    ns.gang.setMemberTask(member, taskName);
}

// state lvl * base money * (state weight / 100)
