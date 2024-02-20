import settings from "../../settings";
import { registerWhen } from "../../utils/variables";
import { getWorld } from "../../utils/world";
import { isInSkyblock, getDateString } from '../../utils/functions';
import { refreshItemOverlay, refreshMobOverlay } from "../guis/DianaGuis";
import { isActiveForOneSecond } from "../../utils/functions";
import { getSkyblockDate, getNewMayorAtDate, getDateMayorElected, setDateMayorElected } from "../../utils/mayor";

// mob tracker
registerWhen(register("chat", (woah, mob) => {
    switch (mob) {
        case "Minos Inquisitor":
            trackMob(mob, "mobs", 1);
            break;
        case "Minos Champion":
            trackMob(mob, "mobs", 1);
            break;
        case "Minos Hunter":
            trackMob(mob, "mobs", 1);
            break;
        case "Minotaur":
            trackMob(mob, "mobs", 1);
            break;
        case "Gaia Construct":
            trackMob(mob, "mobs", 1);
            break;
        case "Siamese Lynx":
            trackMob(mob, "mobs", 1);
            break;       
    }
}).setCriteria("&c${woah}&eYou Dug out &2a ${mob}&e!"), () => getWorld() === "Hub" && settings.dianaMobTracker);

registerWhen(register("chat", () => {
    trackItem("Minos Inquisitor", "mobs", 1);
}).setCriteria("&e[NPC] Lumber Jack&f: &r&fA lumberjack always pays his debts!&r"), () => getWorld() === "Hub" && settings.dianaMobTracker);
// todo: 
// trackerMayor reset on new mayor
// mayor tracker nur reseten wenn neuer mayor diana ist
// vielleicht tracker für die letzten 2 mayor speichern

// make pickuplog only works while in no gui open
// lootchare books erkennen
// pickuplog updaterate vielleicht anpassen


registerWhen(register("chat", (drop) => {
    drop = drop.removeFormatting();
    switch (drop) {
        case "Griffin Feather":
            trackItem(drop, "items", 1);
            break;
        case "Crown of Greed":
            trackItem(drop, "items", 1);
            break;
        case "Washed-up Souvenir":
            trackItem(drop, "items", 1);
            break;
    }
}).setCriteria("&r&6&lRARE DROP! &eYou dug out a ${drop}&e!"), () => getWorld() === "Hub" && settings.dianaLootTracker && isInSkyblock());

registerWhen(register("chat", (coins) => {
    trackItem("coins", "items", coins);
    ChatLib.chat(coins);
}).setCriteria("&r&6&lRARE DROP! &eYou dug out &6${coins} coins&e!"), () => getWorld() === "Hub" && settings.dianaLootTracker && isInSkyblock());

registerWhen(register("chat", (drop, mf) => {
    switch (drop) {
        case "Enchanted Book":
            trackItem("Chimera", "items", 1);
            break;
        case "Daedalus Stick":
            trackItem(drop, "items", 1);
            break;
        case "Potato":
            trackItem(drop, "items", 1);
            break;
        case "Carrot":
            trackItem(drop, "items", 1);
            break;
    }
}).setCriteria("&r&6&lRARE DROP! &r&f${drop} &r&b(+&r&b${mf}% &r&b✯ Magic Find&r&b)&r"), () => getWorld() === "Hub" && settings.dianaLootTracker && isInSkyblock());


// test command
register('command', () => {
    trackerSession = getTracker(3);
    for (var item in trackerSession["items"]) {
        ChatLib.chat(item + ": " + trackerSession["items"][item]);
    }
}).setName("sbots");
register('command', () => {
    trackerMayor = getTracker(2);
    for (var item in trackerMayor["items"]) {
        ChatLib.chat(item + ": " + trackerMayor["items"][item]);
    }
}).setName("sbotm");

register('command', () => {
    trackerTotal = getTracker(1);
    for (var item in trackerTotal["items"]) {
        ChatLib.chat(item + ": " + trackerTotal["items"][item]);
    }
}).setName("sbott");


// loot tracker
fileLocation = "config/ChatTriggers/modules/SBO/dianaTracker";
function loadTracker(type) {
    let loadedTracker;
    try {
        loadedTracker = JSON.parse(FileLib.read(fileLocation + type + ".json")) || {};
    } catch (e) {
        loadedTracker = {};
    }
    return loadedTracker;
}

export function dianaLootCounter(item, amount) {
    countThisIds = ["ROTTEN_FLESH", "WOOD", "DWARF_TURTLE_SHELMET", "CROCHET_TIGER_PLUSHIE", "ANTIQUE_REMEDIES", "ENCHANTED_ANCIENT_CLAW", "ANCIENT_CLAW", "MINOS_RELIC"]
    if (isActiveForOneSecond()) {
        for (var i in countThisIds.values()) {
            if (item === i) {
                trackItem(item, "items", amount);
            }
        }
    }
}

function saveLoot(tracker, type) {
    FileLib.write(fileLocation + type + ".json", JSON.stringify(tracker));
}

export function getTracker(type) {
    switch (type) {
        case 1:
            return trackerTotal;
        case 2:
            return trackerMayor;
        case 3:
            return trackerSession;
    }
}

// mayor tracker
let trackerMayor = loadTracker("Mayor");
registerWhen(register("step", () => {
    if (getDateMayorElected() != undefined) {
        trackerMayor[getDateMayorElected().getFullYear()] = initializeTracker();
    }
    else {
        ChatLib.chat("No date for mayor election found (undefined)");
    }
}).setFps(1), () => !trackerMayor.hasOwnProperty('election'));

// total tracker
let trackerTotal = loadTracker("Total");
if (trackerTotal.length === 0) {
    trackerTotal = initializeTracker();
}

// session tracker
let trackerSession = {};
trackerSession = initializeTracker();


function initializeTracker() {
    tempTracker = {
        items: {
            "coins": 0,
            "Griffin Feather": 0,
            "Crown of Greed": 0,
            "Washed-up Souvenir": 0,
            "Chimera": 0,
            "Daedalus Stick": 0,
            "DWARF_TURTLE_SHELMET": 0,
            "CROCHET_TIGER_PLUSHIE": 0,
            "ANTIQUE_REMEDIES": 0,
            "ENCHANTED_ANCIENT_CLAW": 0,
            "ANCIENT_CLAW": 0,
            "MINOS_RELIC": 0,

            "ROTTEN_FLESH": 0,
            "WOOD": 0,
            "Potato": 0,
            "Carrot": 0
        },
        mobs: {
            "Minos Inquisitor": 0,
            "Minos Champion": 0,
            "Minotaur": 0,
            "Gaia Construct": 0,
            "Siamese Lynx": 0,
            "Minos Hunter": 0,
            "TotalMobs": 0
        }
    };
    return tempTracker;
}


export function trackItem(item, category, amount) {
    trackOne(trackerMayor, item, category, "Mayor", amount);
    trackOne(trackerTotal, item, category, "Total", amount);
    trackOne(trackerSession, item, category, "Session", amount);
    
    if (category === "items") {
        refreshItemOverlay(getTracker(settings.dianaLootTrackerView), settings.dianaLootTrackerView);
    }
    else if (category === "mobs") {
        refreshMobOverlay(getTracker(settings.dianaMobTrackerView), settings.dianaMobTrackerView);
    }
}

function trackOne(tracker, item, category, type, amount) {
    if (type == "Mayor") {
        if (((getSkyblockDate().getTime() / 1000) > (getNewMayorAtDate().getTime() / 1000))) {       
            ChatLib.chat("new mayor now?: " + ((getSkyblockDate().getTime() / 1000) > (getNewMayorAtDate().getTime() / 1000)));
            tracker = {};
            tracker.items = {};
            tracker.mobs = {};
            setDateMayorElected("27.3." + (getSkyblockDate().getFullYear() + 1));
            tracker.election = getDateMayorElected().getFullYear();
        }
        tracker[getDateMayorElected().getFullYear()][category][item] += amount;
    }
    else {
        tracker[category][item] += amount;
    }
    if (type !== "Session") {
        saveLoot(tracker, type);
    }
}
