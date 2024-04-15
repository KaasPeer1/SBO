import settings from "../../settings";
import { registerWhen } from "../../utils/variables";
import { getWorld } from "../../utils/world";
import { state, loadGuiSettings, playerHasSpade } from "../../utils/functions";
import { YELLOW, BOLD, GOLD, DARK_GREEN, LIGHT_PURPLE, DARK_PURPLE, GREEN, DARK_GRAY, GRAY, WHITE, AQUA, ITALIC, BLUE} from "../../utils/constants";
import { getDateMayorElected } from "../../utils/mayor";
import { UIWrappedText } from "../../../Elementa";
import { getGuiOpen, newOverlay } from "../../utils/overlays";
import { checkDiana } from "../../utils/checkDiana";

registerWhen(register("entityDeath", (entity) => {
    let dist = entity.distanceTo(Player.getPlayer());
    if (dist < 10 ) {
        state.entityDeathOccurred = true;
        setTimeout(() => {
            state.entityDeathOccurred = false;
        }, 2000);
    }
}), () => getWorld() === "Hub" && settings.dianaLootTracker);


let guiSettings = loadGuiSettings();

let dianaMobOverlayObj = newOverlay("dianaMobTracker", settings.dianaMobTracker, "dianaMobTrackerExample", "render", "MobLoc");
let dianaMobOverlay = dianaMobOverlayObj.overlay;

let dianaLootOverlayObj = newOverlay("dianaLootTracker", settings.dianaLootTracker, "dianaLootTrackerExample", "render", "LootLoc");
let dianaLootOverlay = dianaLootOverlayObj.overlay;

function loadDianaMobTracker() {
    if(guiSettings != undefined) {
        dianaMobOverlay.setX((guiSettings["MobLoc"]["x"]).pixels());
        dianaMobOverlay.setY((guiSettings["MobLoc"]["y"]).pixels());
    }
}
function loadDianaLootTracker() {
    if(guiSettings != undefined) {
        dianaLootOverlay.setX((guiSettings["LootLoc"]["x"]).pixels());
        dianaLootOverlay.setY((guiSettings["LootLoc"]["y"]).pixels());
    }
}
loadDianaMobTracker();
loadDianaLootTracker();

let dianaMobTrackerText = new UIWrappedText("");
let dianaLootTrackerText = new UIWrappedText("");


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
    if (setting == 2) {
        mobTracker = mobTracker[getDateMayorElected().getFullYear()] 
    }
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
    `${YELLOW}${BOLD}Diana Mob Tracker ${GRAY}(${YELLOW}${BOLD}${mobTrackerType}${GRAY})
------------------
${LIGHT_PURPLE}${BOLD}Minos Inquisitor: ${AQUA}${BOLD}${mobTracker["mobs"]["Minos Inquisitor"]} ${GRAY}(${AQUA}${percentDict["Minos Inquisitor"]}%${GRAY})
${DARK_PURPLE}${BOLD}Minos Champion: ${AQUA}${BOLD}${mobTracker["mobs"]["Minos Champion"]} ${GRAY}(${AQUA}${percentDict["Minos Champion"]}%${GRAY})
${GOLD}${BOLD}Minotaur: ${AQUA}${BOLD}${mobTracker["mobs"]["Minotaur"]} ${GRAY}(${AQUA}${percentDict["Minotaur"]}%${GRAY})
${GREEN}${BOLD}Gaia Construct: ${AQUA}${BOLD}${mobTracker["mobs"]["Gaia Construct"]} ${GRAY}(${AQUA}${percentDict["Gaia Construct"]}%${GRAY})
${GREEN}${BOLD}Siamese Lynx: ${AQUA}${BOLD}${mobTracker["mobs"]["Siamese Lynxes"]} ${GRAY}(${AQUA}${percentDict["Siamese Lynxes"]}%${GRAY})
${GREEN}${BOLD}Minos Hunter: ${AQUA}${BOLD}${mobTracker["mobs"]["Minos Hunter"]} ${GRAY}(${AQUA}${percentDict["Minos Hunter"]}%${GRAY})
${GRAY}${BOLD}Total Mobs: ${AQUA}${BOLD}${mobTracker["mobs"]["TotalMobs"]}
`
    }
    dianaMobTrackerText.setText(message);
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
    if (lootViewSetting == 2) {
        lootTracker = lootTracker[getDateMayorElected().getFullYear()] 
    }
    if (lootViewSetting > 0) {
        message = getLootMessage(lootTracker, lootViewSetting, settings.dianaMobTracker, percentDict);
    }
    dianaLootTrackerText.setText(message);
}

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
    let lootMessage = `${YELLOW}${BOLD}Diana Loot Tracker ${GRAY}(${YELLOW}${BOLD}${lootTrackerType}${GRAY})
-------------------
`;
    if (mobSetting) {
        lootMessage += `${LIGHT_PURPLE}${BOLD}Chimera: ${AQUA}${BOLD}${lootTracker["items"]["Chimera"]} ${GRAY}(${AQUA}${percentDict["Chimera"]}%${GRAY})
${DARK_PURPLE}${BOLD}Minos Relic: ${AQUA}${BOLD}${lootTracker["items"]["MINOS_RELIC"]} ${GRAY}(${AQUA}${percentDict["Minos Relic"]}%${GRAY})
${GOLD}${BOLD}Daedalus Stick: ${AQUA}${BOLD}${lootTracker["items"]["Daedalus Stick"]} ${GRAY}(${AQUA}${percentDict["Daedalus Stick"]}%${GRAY})
`
    }
    else {
        lootMessage += `${LIGHT_PURPLE}${BOLD}Chimera: ${AQUA}${BOLD}${lootTracker["items"]["Chimera"]}
${DARK_PURPLE}${BOLD}Minos Relic: ${AQUA}${BOLD}${lootTracker["items"]["MINOS_RELIC"]}
${GOLD}${BOLD}Daedalus Stick: ${AQUA}${BOLD}${lootTracker["items"]["Daedalus Stick"]}
`
    }
    lootMessage += `${GOLD}${BOLD}Crown of Greed: ${AQUA}${BOLD}${lootTracker["items"]["Crown of Greed"]}
${GOLD}${BOLD}Souvenir: ${AQUA}${BOLD}${lootTracker["items"]["Washed-up Souvenir"]}
${DARK_GREEN}${BOLD}Turtle Shelmet: ${AQUA}${BOLD}${lootTracker["items"]["DWARF_TURTLE_SHELMET"]}
${DARK_GREEN}${BOLD}Tiger Plushie: ${AQUA}${BOLD}${lootTracker["items"]["CROCHET_TIGER_PLUSHIE"]}
${DARK_GREEN}${BOLD}Antique Remedies: ${AQUA}${BOLD}${lootTracker["items"]["ANTIQUE_REMEDIES"]}
${GOLD}${BOLD}Griffin Feather: ${AQUA}${BOLD}${lootTracker["items"]["Griffin Feather"]}
`
    if (lootTracker["items"]["coins"] > 1000000) {
        lootMessage += `${GOLD}${BOLD}Coins: ${AQUA}${BOLD}${(lootTracker["items"]["coins"]/1000000).toFixed(2)}M
`
    }
    else if (lootTracker["items"]["coins"] > 1000) {
        lootMessage += `${GOLD}${BOLD}Coins: ${AQUA}${BOLD}${Math.round(lootTracker["items"]["coins"]/1000)}K
`
    }
    else {
        lootMessage += `${GOLD}${BOLD}Coins: ${AQUA}${BOLD}${lootTracker["items"]["coins"]}
`
    }
    lootMessage += `${BLUE}${BOLD}Ancient Claws: ${AQUA}${BOLD}${lootTracker["items"]["ANCIENT_CLAW"]}
${BLUE}${BOLD}Enchanted Ancient Claws: ${AQUA}${BOLD}${lootTracker["items"]["ENCHANTED_ANCIENT_CLAW"]}
${GRAY}${BOLD}Total Burrows: ${AQUA}${BOLD}${lootTracker["items"]["Total Burrows"]}
`
    return lootMessage;
}

let loadedMythosHp = false;
let mythosHpOverlayObj = newOverlay("mythosMobHp", settings.mythosMobHp, "mythosMobHpExample", "render", "MythosHpLoc");
let mythosHpOverlay = mythosHpOverlayObj.overlay


let mythosMobHpText = new UIWrappedText("");

function loadMythosHpOverlay() {
    if(guiSettings != undefined && !loadedMythosHp) {
        mythosHpOverlay.setX((guiSettings["MythosHpLoc"]["x"]).pixels());
        mythosHpOverlay.setY((guiSettings["MythosHpLoc"]["y"]).pixels());
        loadedMythosHp = true;
    }
}
loadMythosHpOverlay();

export function mythosMobHpOverlay(mobNamesWithHp) {
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
}

registerWhen(register("step", () => {
    if (playerHasSpade() || checkDiana()) {
        dianaMobOverlayObj.renderGui = true;
        dianaLootOverlayObj.renderGui = true;
    }
    else {
        dianaMobOverlayObj.renderGui = false;
        dianaLootOverlayObj.renderGui = false;
    }
}).setFps(1), () => settings.dianaMobTracker || settings.dianaLootTracker);