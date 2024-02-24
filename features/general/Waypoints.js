import settings from "../../settings";
import { registerWhen } from "../../utils/variables";

import RenderLibV2 from "../../../RenderLibv2";
import renderBeaconBeam from "../../../BeaconBeam/index";

let patcherWaypoints = [];
export function getPatcherWaypoints() { 
    return patcherWaypoints 
};

let inqWaypoints = [];
export function getInqWaypoints() { 
    return inqWaypoints 
};

registerWhen(register("chat", (trash, player, spacing, x, y, z) => {
    isInq = !z.includes(" ");
    if (isInq) {
        if(settings.inqWaypoints) {
            Client.Companion.showTitle(`&6INQUISITOR &dFound!`, "", 0, 90, 35);
            World.playSound("random.orb", 1, 1);
            z = z.replace("&r", "");
            player = player + "'s " + "Inquisitor";
            inqWaypoints.push([player, x, y, z]);
            removeWaypointAfterDelay(inqWaypoints, 60);
        }
        else{
            z = z.replace("&r", "");
            patcherWaypoints.push([player, x, y, z]);
            removeWaypointAfterDelay(patcherWaypoints, 30);
        }
    }
    else {
        if(settings.patcherWaypoints) {
            z = z.split(" ")[0];
            patcherWaypoints.push([player, x, y, z]);
            removeWaypointAfterDelay(patcherWaypoints, 30);
        }
    }
}).setCriteria("&r&9Party ${trash} ${player}&f${spacing}x: ${x}, y: ${y}, z: ${z}"), () => (settings.patcherWaypoints || settings.inqWaypoints) && settings.waypoints);

function removeWaypointAfterDelay(Waypoints, seconds) {
    // remove wayspoints older than 30 seconds
    setTimeout(() => {
        Waypoints.shift();
    }, seconds*1000); // 30
} 

let formatted = [];
registerWhen(register("step", () => {
    formatted = [];
    formatWaypoints(patcherWaypoints, 0, 0.2, 1); // Purple Waypoint
    formatWaypoints(inqWaypoints, 1, 0.84, 0); // Gold Waypoint

}).setFps(3), () => settings.waypoints);

let formattedGuess = [];
registerWhen(register("step", () => {
    formattedGuess = [];
    if (guessWaypoint !== undefined) {
        formatWaypoints([guessWaypoint], 0, 1, 0);
    }
}).setFps(20), () => settings.dianaBurrowGuess);

registerWhen(register("renderWorld", () => {
    renderWaypoint(formatted);
}), () => settings.waypoints);
registerWhen(register("renderWorld", () => {
    renderWaypoint(formattedGuess);
}), () => settings.dianaBurrowGuess);

function formatWaypoints(waypoints, r, g, b) {
    if (!waypoints.length) return;
    let x, y, z, distance, xSign, zSign = 0;

    waypoints.forEach((waypoint) => {
        wp = [["", 0, 0, 0], [0, 0, 0], [r, g, b]];
        x = Math.round(waypoint[1]);
        y = Math.round(waypoint[2]);
        z = Math.round(waypoint[3]);
        distance = Math.hypot(Player.getX() - x, Player.getY() - y, Player.getZ() - z);

        // Formats and realins everything
        distance = Math.round(distance) + "m";
        xSign = x == 0 ? 1 : Math.sign(x);
        zSign = z == 0 ? 1 : Math.sign(z);
        wp[0] = [`${waypoint[0]} §b[${distance}]`, x + 0.5*xSign, y - 1, z + 0.5*zSign];

        // Aligns the beam correctly based on which quadrant it is in
        if (xSign == 1) xSign = 0;
        if (zSign == 1) zSign = 0;
        wp[1] = [x + xSign, y - 1, z + zSign];

        /* Return Matrix
           [message, x, y ,z]
           [beacon x, y, z]
           [r, g, b]
        */
        if (waypoint[0] == "Guess") {
            formattedGuess.push(wp);
        }
        else
        {
            formatted.push(wp);
        }
    });
}


function renderWaypoint(waypoints) {
    if (!waypoints.length) return;

    waypoints.forEach((waypoint) => {
        box = waypoint[0];
        beam = waypoint[1];
        rgb = waypoint[2];

        RenderLibV2.drawEspBoxV2(box[1], box[2], box[3], 1, 1, 1, rgb[0], rgb[1], rgb[2], 1, false);
        RenderLibV2.drawInnerEspBoxV2(box[1], box[2], box[3], 1, 1, 1, rgb[0], rgb[1], rgb[2], 0.25, false);
        Tessellator.drawString(box[0], box[1], box[2] + 1.5, box[3], 0xffffff, false);
        renderBeaconBeam(beam[0], beam[1], beam[2], rgb[0], rgb[1], rgb[2], 0.5, false);
    });
}

let guessWaypoint = undefined;
export function createDianaGuess(x, y, z) {
    guessWaypoint = ["Guess", x, y, z];    
}