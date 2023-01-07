import { NS, Player } from '@ns'
import { BladeburnerAction } from 'models/bladeburner-action';
import { BladeburnerAction, BladeburnerActionName, BladeburnerType } from 'libs/enums';

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
        let recovering = false;

        ns.printf("Stamina precentage [ %d / 100 ]", staminaPercentage);
        
        // Do Training if current stamina to low...
        if(staminaPercentage <= 50) {
            const timeout = ns.bladeburner.getActionTime(BladeburnerType.General, BladeburnerActionName.Training);

            if(currentAction.name && currentAction.name.toLowerCase() === BladeburnerActionName.Training) {
                await ns.sleep(timeout + 150);
                continue;
            }

            const started = ns.bladeburner.startAction(BladeburnerType.General, BladeburnerActionName.Training);

            if(started) {
                await ns.sleep(timeout + 150);
            } else {
                await ns.sleep(1000);
            }

            continue;
        }

        if(staminaPercentage < 95 && currentAction.name.toLowerCase() === BladeburnerActionName.Training) {
            recovering = true;
        }
        
        if(recovering) {
            await ns.sleep(3000);
            continue;
        }

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

function getBestContract(ns: NS): BladeburnerAction | undefined {
    const contracts = getContracts(ns).filter(contract => {
        return (contract.contractsRemaining > 0 && contract.successChance >= 80)
    });

    if(contracts.length > 0) {
        const sorted = contracts.sort((a, b) => (a.reputationGain > b.reputationGain) ? -1 : 1);

        sorted.forEach(contract => ns.printf("Contract [ %s ] - Reputation gain [ %d ]", contract.name, contract.reputationGain));

        return sorted[0];
    }

    return undefined;
}

function getContracts(ns: NS): BladeburnerAction[] {
    return [
        getBladeburnerAction(ns, BladeburnerType.Contract, BladeburnerActionName.Tracking),
        getBladeburnerAction(ns, BladeburnerType.Contract, BladeburnerActionName.BountyHunter)
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

    return (minSuccess / maxSuccess) * 100;
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