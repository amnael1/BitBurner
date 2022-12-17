import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    if(ns.gang.canRecruitMember()) {
        const gangMembers = ns.gang.getMemberNames().length;
        const memberName = (gangMembers + 1).toString();
        const recrued = ns.gang.recruitMember(memberName);

        if(recrued) {
            ns.gang.setMemberTask(memberName, "Train Combat");
        } else {
            ns.tprintf("Can not recrute new member [ %s ]", memberName)
        }
    }
}