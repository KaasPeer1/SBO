import settings from "../../settings";
import { registerWhen, data } from "../../utils/variables";
import { playerHasSpade, getBazaarPriceDiana, formatNumber } from "../../utils/functions";
import { YELLOW, BOLD, GOLD, DARK_GREEN, LIGHT_PURPLE, DARK_PURPLE, GREEN, DARK_GRAY, GRAY, WHITE, AQUA, ITALIC, BLUE} from "../../utils/constants";
import { UIWrappedText } from "../../../Elementa";
import { getGuiOpen, newOverlay } from "../../utils/overlays";
import { checkDiana } from "../../utils/checkDiana";



let dianaMobOverlayObj = newOverlay("dianaMobTracker", "dianaMobTracker", "dianaMobTrackerExample", "render", "MobLoc");
let dianaMobOverlay = dianaMobOverlayObj.overlay;

let dianaLootOverlayObj = newOverlay("dianaLootTracker", "dianaLootTracker", "dianaLootTrackerExample", "render", "LootLoc");
let dianaLootOverlay = dianaLootOverlayObj.overlay;

let dianaStatsOverlayObj = newOverlay("dianaStats", "dianaStatsTracker", "dianaStatsExample", "render", "StatsLoc");
let dianaStatsOverlay = dianaStatsOverlayObj.overlay;


let dianaMobTrackerText = new UIWrappedText("");
let dianaLootTrackerText = new UIWrappedText("");
let dianaStatsText = new UIWrappedText("");

export function statsOverlay() {
    if(getGuiOpen()) return;
    if (!dianaStatsOverlay.children.includes(dianaStatsText)) {
        dianaStatsOverlay.clearChildren();
        dianaStatsOverlay.addChild(dianaStatsText);
    }
    let message = `${YELLOW}${BOLD}Diana Stats Tracker
${GRAY}- ${LIGHT_PURPLE}${BOLD}Mobs since Inq: ${AQUA}${data.mobsSinceInq}
${GRAY}- ${LIGHT_PURPLE}${BOLD}Inqs since Chimera: ${AQUA}${data.inqsSinceChim}
${GRAY}- ${GOLD}${BOLD}Minos since Stick: ${AQUA}${data.minotaursSinceStick}
${GRAY}- ${DARK_PURPLE}${BOLD}Champs since Relic: ${AQUA}${data.champsSinceRelic}
`
    dianaStatsText.setText(message);
    dianaStatsText.setTextScale((dianaStatsOverlayObj.scale).pixels());
}

/**
 * 
 * @param {string} setting 
 */
export function mobOverlay(mobTracker, setting, percentDict) {
    if(getGuiOpen()) return;
    if (!dianaMobOverlay.children.includes(dianaMobTrackerText)) {
        dianaMobOverlay.clearChildren();
        dianaMobOverlay.addChild(dianaMobTrackerText);
    }
    let message = "";
    if (setting > 0) {
        switch (setting) {
            case 1:
                mobTrackerType = "Total";
                break;
            case 2:
                mobTrackerType = "Event";
                break;
            case 3:
                mobTrackerType = "Session";
                break;
        };
    message =
    `${YELLOW}${BOLD}Diana Mob Tracker ${GRAY}(${YELLOW}${mobTrackerType}${GRAY})
${GRAY}- ${LIGHT_PURPLE}${BOLD}Minos Inquisitor: ${AQUA}${mobTracker["mobs"]["Minos Inquisitor"]} ${GRAY}(${AQUA}${percentDict["Minos Inquisitor"]}%${GRAY})
${GRAY}- ${DARK_PURPLE}${BOLD}Minos Champion: ${AQUA}${mobTracker["mobs"]["Minos Champion"]} ${GRAY}(${AQUA}${percentDict["Minos Champion"]}%${GRAY})
${GRAY}- ${GOLD}${BOLD}Minotaur: ${AQUA}${mobTracker["mobs"]["Minotaur"]} ${GRAY}(${AQUA}${percentDict["Minotaur"]}%${GRAY})
${GRAY}- ${GREEN}${BOLD}Gaia Construct: ${AQUA}${mobTracker["mobs"]["Gaia Construct"]} ${GRAY}(${AQUA}${percentDict["Gaia Construct"]}%${GRAY})
${GRAY}- ${GREEN}${BOLD}Siamese Lynx: ${AQUA}${mobTracker["mobs"]["Siamese Lynxes"]} ${GRAY}(${AQUA}${percentDict["Siamese Lynxes"]}%${GRAY})
${GRAY}- ${GREEN}${BOLD}Minos Hunter: ${AQUA}${mobTracker["mobs"]["Minos Hunter"]} ${GRAY}(${AQUA}${percentDict["Minos Hunter"]}%${GRAY})
${GRAY}- ${GRAY}${BOLD}Total Mobs: ${AQUA}${mobTracker["mobs"]["TotalMobs"]}
`
    }
    dianaMobTrackerText.setText(message);
    dianaMobTrackerText.setTextScale((dianaMobOverlayObj.scale).pixels());
}
let mobTrackerType = undefined;
let lootTrackerType = undefined;
/**
 * 
 * @param {string} setting 
 */
export function itemOverlay(lootTracker, lootViewSetting, percentDict){
    if(getGuiOpen()) return;
    if (!dianaLootOverlay.children.includes(dianaLootTrackerText)) {
        dianaLootOverlay.clearChildren();
        dianaLootOverlay.addChild(dianaLootTrackerText);    
    }
    let message = "";
    if (lootViewSetting > 0) {
        message = getLootMessage(lootTracker, lootViewSetting, settings.dianaMobTracker, percentDict);
    }
    dianaLootTrackerText.setText(message);
    dianaLootTrackerText.setTextScale((dianaLootOverlayObj.scale).pixels());
}

// .quick_status.buyPrice -> selloffer / instabuy
// .quick_status.sellPrice -> buyorder / instasell

function getLootMessage(lootTracker, lootViewSetting, mobSetting, percentDict) {
    switch (lootViewSetting) {
        case 1:
            lootTrackerType = "Total";
            break;
        case 2:
            lootTrackerType = "Event";
            break;
        case 3:
            lootTrackerType = "Session";
            break;
    };
    let totalChimera = 0;
    if (lootTracker["items"]["Chimera"] != undefined) {
        totalChimera += lootTracker["items"]["Chimera"];
    }
    if (lootTracker["items"]["ChimeraLs"] != undefined) {
        totalChimera += lootTracker["items"]["ChimeraLs"];
    }
    
    let lootMessage = `${YELLOW}${BOLD}Diana Loot Tracker ${GRAY}(${YELLOW}${lootTrackerType}${GRAY})
`;
    if (mobSetting) {
        lootMessage += `${GOLD}${formatNumber(getBazaarPriceDiana("ENCHANTMENT_ULTIMATE_CHIMERA_1") * totalChimera)} ${GRAY}- ${LIGHT_PURPLE}${BOLD}Chimera: ${AQUA}${lootTracker["items"]["Chimera"]} ${GRAY}(${AQUA}${percentDict["Chimera"]}%${GRAY}) [${AQUA}LS${GRAY}: ${AQUA}${lootTracker["items"]["ChimeraLs"]}${GRAY}]
${GOLD}1b ${GRAY}- ${DARK_PURPLE}${BOLD}Minos Relic: ${AQUA}${lootTracker["items"]["MINOS_RELIC"]} ${GRAY}(${AQUA}${percentDict["Minos Relic"]}%${GRAY})
${GOLD}${formatNumber(getBazaarPriceDiana("DAEDALUS_STICK") * lootTracker["items"]["Daedalus Stick"])} ${GRAY}- ${GOLD}${BOLD}Daedalus Stick: ${AQUA}${lootTracker["items"]["Daedalus Stick"]} ${GRAY}(${AQUA}${percentDict["Daedalus Stick"]}%${GRAY})
`
    }
    else {
        lootMessage += `${GOLD}${formatNumber(getBazaarPriceDiana("ENCHANTMENT_ULTIMATE_CHIMERA_1") * totalChimera)} ${GRAY}- ${LIGHT_PURPLE}${BOLD}Chimera: ${AQUA}${lootTracker["items"]["Chimera"]} [${AQUA}LS${GRAY}: ${AQUA}${lootTracker["items"]["ChimeraLs"]}${GRAY}]
${GOLD}1b ${GRAY}- ${DARK_PURPLE}${BOLD}Minos Relic: ${AQUA}${lootTracker["items"]["MINOS_RELIC"]}
${GOLD}${formatNumber(getBazaarPriceDiana("DAEDALUS_STICK") * lootTracker["items"]["Daedalus Stick"])} ${GRAY}- ${GOLD}${BOLD}Daedalus Stick: ${AQUA}${lootTracker["items"]["Daedalus Stick"]}
`
    }
    lootMessage += `${GOLD}20m ${GRAY}- ${GOLD}${BOLD}Crown of Greed: ${AQUA}${lootTracker["items"]["Crown of Greed"]} 
${GOLD}20m ${GRAY}- ${GOLD}${BOLD}Souvenir: ${AQUA}${lootTracker["items"]["Washed-up Souvenir"]}
${GOLD}${formatNumber(getBazaarPriceDiana("GRIFFIN_FEATHER") * lootTracker["items"]["Griffin Feather"])} ${GRAY}- ${GOLD}${BOLD}Griffin Feather: ${AQUA}${formatNumber(lootTracker["items"]["Griffin Feather"])}
`
    lootMessage += `${GOLD}${(formatNumber(lootTracker["items"]["coins"]))} ${GRAY}- ${GOLD}${BOLD}Coins
`
    lootMessage += `${GOLD}90m ${GRAY}- ${DARK_GREEN}${BOLD}Turtle Shelmet: ${AQUA}${lootTracker["items"]["DWARF_TURTLE_SHELMET"]}
${GOLD}90m ${GRAY}- ${DARK_GREEN}${BOLD}Tiger Plushie: ${AQUA}${lootTracker["items"]["CROCHET_TIGER_PLUSHIE"]}
${GOLD}60m ${GRAY}- ${DARK_GREEN}${BOLD}Antique Remedies: ${AQUA}${lootTracker["items"]["ANTIQUE_REMEDIES"]}
`

    lootMessage += `${GOLD}${formatNumber(getBazaarPriceDiana("ANCIENT_CLAW") * lootTracker["items"]["ANCIENT_CLAW"])} ${GRAY}- ${BLUE}${BOLD}Ancient Claws: ${AQUA}${formatNumber(lootTracker["items"]["ANCIENT_CLAW"])}
`

    lootMessage += `${GOLD}${formatNumber(getBazaarPriceDiana("ENCHANTED_ANCIENT_CLAW") * lootTracker["items"]["ENCHANTED_ANCIENT_CLAW"])} ${GRAY}- ${BLUE}${BOLD}Enchanted Claws: ${AQUA}${formatNumber(lootTracker["items"]["ENCHANTED_ANCIENT_CLAW"])}
${GOLD}${formatNumber(getBazaarPriceDiana("ENCHANTED_GOLD") * lootTracker["items"]["ENCHANTED_GOLD"])} ${GRAY}- ${BLUE}${BOLD}Enchanted Gold: ${AQUA}${formatNumber(lootTracker["items"]["ENCHANTED_GOLD"])}
${GOLD}${formatNumber(getBazaarPriceDiana("ENCHANTED_IRON") * lootTracker["items"]["ENCHANTED_IRON"])} ${GRAY}- ${BLUE}${BOLD}Enchanted Iron: ${AQUA}${formatNumber(lootTracker["items"]["ENCHANTED_IRON"])} 
${GRAY}${BOLD}Total Burrows: ${AQUA}${lootTracker["items"]["Total Burrows"]}
`
    let totalValue = 0;
    totalValue += getBazaarPriceDiana("ENCHANTMENT_ULTIMATE_CHIMERA_1") * totalChimera;
    totalValue += getBazaarPriceDiana("DAEDALUS_STICK") * lootTracker["items"]["Daedalus Stick"];
    totalValue += getBazaarPriceDiana("GRIFFIN_FEATHER") * lootTracker["items"]["Griffin Feather"];
    totalValue += getBazaarPriceDiana("ANCIENT_CLAW") * lootTracker["items"]["ANCIENT_CLAW"];
    totalValue += getBazaarPriceDiana("ENCHANTED_ANCIENT_CLAW") * lootTracker["items"]["ENCHANTED_ANCIENT_CLAW"];
    totalValue += getBazaarPriceDiana("ENCHANTED_GOLD") * lootTracker["items"]["ENCHANTED_GOLD"];
    totalValue += getBazaarPriceDiana("ENCHANTED_IRON") * lootTracker["items"]["ENCHANTED_IRON"];
    totalValue += lootTracker["items"]["coins"];
    lootMessage += `${GOLD}${BOLD}Total Profit: ${GOLD}${formatNumber(totalValue)}
`

    return lootMessage;
}

let mythosHpOverlayObj = newOverlay("mythosMobHp", "mythosMobHp", "mythosMobHpExample", "render", "MythosHpLoc");
let mythosHpOverlay = mythosHpOverlayObj.overlay

let mythosMobHpText = new UIWrappedText("");

export function mythosMobHpOverlay(mobNamesWithHp) {
    // if (!renderGui) {
    //     mythosHpOverlayObj.renderGui = false;
    //     return;
    // }
    // else {
    //     mythosHpOverlayObj.renderGui = true;
    // }
    if(getGuiOpen()) return
    if(!mythosHpOverlay.children.includes(mythosMobHpText)) {
        mythosHpOverlay.clearChildren();
        mythosHpOverlay.addChild(mythosMobHpText);
    }
    let message = "";
    if (mobNamesWithHp.length > 0) {
        message = "";
        mobNamesWithHp.forEach((mob) => {
            message += `${mob}\n`;
        });
    }
    else {
        message = "";
    }
    mythosMobHpText.setText(message);
    mythosMobHpText.setTextScale((mythosHpOverlayObj.scale).pixels());
}

registerWhen(register("step", () => {
    if (playerHasSpade() || checkDiana()) {
        dianaMobOverlayObj.renderGui = true;
        dianaLootOverlayObj.renderGui = true;
        dianaStatsOverlayObj.renderGui = true;
    }
    else {
        dianaMobOverlayObj.renderGui = false;
        dianaLootOverlayObj.renderGui = false;
        dianaStatsOverlayObj.renderGui = false;
    }
}).setFps(1), () => settings.dianaMobTracker || settings.dianaLootTracker || settings.dianaStatsTracker);