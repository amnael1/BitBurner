import { BladeburnerCurAction, NS, Player } from '@ns'
import { BladeburnerAction } from 'models/bladeburner-action';
import { BladeburnerAction, BladeburnerActionName, BladeburnerType } from 'libs/enums';
import { BladeburnerSkill } from 'models/bladeburner-skill';

export async function main(ns : NS) : Promise<void> {

    while(!ns.bladeburner.inBladeburner()) {
        const player = ns.getPlayer();

        if(canJoinBladeburner(player)) {
            const joined = ns.bladeburner.joinBladeburnerDivision();

            if(joined) {
                break;
            }
        }

        await ns.sleep(5000);

        continue;
    }

    while(ns.bladeburner.inBladeburner()) {
        const staminaPercentage = getStaminaPercentage(ns);
        const currentAction = ns.bladeburner.getCurrentAction();
        const trainingTimeout = ns.bladeburner.getActionTime(BladeburnerType.General, BladeburnerActionName.Training);

        ns.printf("Stamina precentage [ %d / 100 ]", staminaPercentage);
        
        // Do Training if current stamina to low...
        if(staminaPercentage < 50 && !isCurrentTraining(currentAction)) {
            const started = ns.bladeburner.startAction(BladeburnerType.General, BladeburnerActionName.Training);

            if(started) {
                await ns.sleep(trainingTimeout + 150);
                continue;
            }
        }

        if(staminaPercentage < 95 && isCurrentTraining(currentAction)) {
            await ns.sleep(trainingTimeout + 150);
            continue;
        }

        upgradeSkill(ns);

        const contract = getBestContract(ns);

        if(contract) {
            const contractStarted = ns.bladeburner.startAction(contract.type, contract.name);

            if(contractStarted) {
                await ns.sleep(contract.actionTime + 150);
            } else {
                await ns.sleep(1000);
            }

            continue;
        }

        await ns.sleep(1000);
    }
}

function isCurrentTraining(currentAction: BladeburnerCurAction) {
    return (currentAction.name && currentAction.name === BladeburnerActionName.Training)
}

function getBestContract(ns: NS): BladeburnerAction | undefined {
    const contracts = getContracts(ns).filter(contract => {
        return (contract.contractsRemaining > 0 && contract.successChance >= 80)
    });

    if(contracts.length > 0) {
        const sorted = contracts.sort((a, b) => (a.reputationGain > b.reputationGain) ? -1 : 1);

        sorted.forEach(contract => ns.printf("Contract [ %s ] - Reputation gain [ %d ]", contract.name, contract.reputationGain * 100));

        return sorted[0];
    }

    return undefined;
}

function getContracts(ns: NS): BladeburnerAction[] {
    return [
        getBladeburnerAction(ns, BladeburnerType.Contract, BladeburnerActionName.Tracking),
        getBladeburnerAction(ns, BladeburnerType.Contract, BladeburnerActionName.BountyHunter),
        getBladeburnerAction(ns, BladeburnerType.Contract, BladeburnerActionName.Retirement)
    ]
}

function getBladeburnerAction(ns: NS, type: string, name: string): BladeburnerAction {
    return {
        name: name,
        type: type,
        successChance: getEstimatedSuccessChancePercentage(ns, type, name),
        contractsRemaining: getCountRemaining(ns, type, name),
        actionTime: getActionTime(ns, type, name),
        reputationGain: getReputationGain(ns, type, name)
    };
}

function getReputationGain(ns: NS, type: string, name: string): number {
    const currentLevel = ns.bladeburner.getActionCurrentLevel(type, name);

    return ns.bladeburner.getActionRepGain(type, name, currentLevel);
}

function getActionTime(ns: NS, type: string, name: string): number {
    return ns.bladeburner.getActionTime(type, name);
}

function getCountRemaining(ns: NS, type: string, name: string): number {
    return ns.bladeburner.getActionCountRemaining(type, name);
}

function getEstimatedSuccessChancePercentage(ns: NS, type: string, name: string): number {
    const [minSuccess, maxSuccess] = ns.bladeburner.getActionEstimatedSuccessChance(type, name);

    return ((minSuccess * 100) + (maxSuccess * 100)) / 2;
}

function getStaminaPercentage(ns: NS): number {
    const [current, max] = ns.bladeburner.getStamina();

    return (current / max) * 100;
}

function canJoinBladeburner(player: Player) {
    const skills = player.skills;

    return (
        skills.strength >= 100 &&
        skills.dexterity >= 100 &&
        skills.defense >= 100 &&
        skills.agility >= 100
    );
}

function upgradeSkill(ns: NS): void {
    const skillPoints = ns.bladeburner.getSkillPoints();
    const skillToUpgrade = getCheapestSkillUpgrade(ns);

    if(skillPoints >= skillToUpgrade.upgradeCost) {
        const upgraded = ns.bladeburner.upgradeSkill(skillToUpgrade.name, 1);

        ns.printf("Skill [ %s ] upgraded [ %t ]", skillToUpgrade.name, upgraded);
    }
}

function getCheapestSkillUpgrade(ns: NS): BladeburnerSkill {
    const sorted = getBladeburnerSkills(ns)
                    .sort((a, b) => b.upgradeCost > a.upgradeCost ? -1 : 1)
                    .filter(skill => (skill.maxLevel === -1) || skill.maxLevel !== skill.level);

    return sorted[0];
}

function getBladeburnerSkills(ns: NS): BladeburnerSkill[] {
    return [
        getBladeburnerSkill(ns, "Hyperdrive"),
        getBladeburnerSkill(ns, "Hands of Midas"),
        getBladeburnerSkill(ns, "Overclock", 90),
        getBladeburnerSkill(ns, "Short-Circuit"),
        getBladeburnerSkill(ns, "Blade's Intuition"),
        getBladeburnerSkill(ns, "Digital Observer")
    ]
}

function getBladeburnerSkill(ns: NS, name: string, maxLevel = -1): BladeburnerSkill {
    return {
        name: name,
        upgradeCost: ns.bladeburner.getSkillUpgradeCost(name, 1),
        level: ns.bladeburner.getSkillLevel(name),
        maxLevel: maxLevel
    }
}