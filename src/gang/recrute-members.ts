import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    if(ns.gang.canRecruitMember()) {
        const gangMembers = ns.gang.getMemberNames().length;
        const memberName = (gangMembers + 1).toString();
        const recrued = ns.gang.recruitMember(memberName);

        if(recrued) {
            const taskApplied = ns.gang.setMemberTask(memberName, "Train Combat");

            ns.tprintf("[ %s ] Task applied => [ %t ]", memberName, taskApplied);
        } else {
            ns.tprintf("[ %s ] Can not recrute new member", memberName)
        }
    }
}