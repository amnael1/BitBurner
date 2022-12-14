import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {
    const GANG_MEMBER_NAME_PREFIX = "Gugu";

    if(ns.gang.canRecruitMember()) {
        const gangMembers = ns.gang.getMemberNames().length;
        const memberName = GANG_MEMBER_NAME_PREFIX + gangMembers;
        const recured = ns.gang.recruitMember(memberName);

        if(recured) {
            ns.gang.setMemberTask(memberName, "Train Combat");
        } else {
            ns.tprintf("Can not recrute new member [ %s ]", memberName)
        }
    }
}