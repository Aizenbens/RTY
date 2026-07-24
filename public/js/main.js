import Engine from "./engine.js";

const playButton = document.getElementById("playButton");
const settingsButton = document.getElementById("settingsButton");
const leaderboardButton = document.getElementById("leaderboardButton");

const mainMenu = document.getElementById("mainMenu");
const hud = document.getElementById("hud");
const crosshair = document.getElementById("crosshair");

const playerName = document.getElementById("playerName");
const weapon = document.getElementById("weapon");

let engine = null;

window.addEventListener("load", () => {

    playerName.value =
        localStorage.getItem("playerName") || "Player";

    weapon.value =
        localStorage.getItem("weapon") || "AK-47";

});

playButton.addEventListener("click", () => {

    const name =
        playerName.value.trim();

    if(name.length < 2){

        alert("Please enter your name.");

        return;

    }

    localStorage.setItem(
        "playerName",
        name
    );

    localStorage.setItem(
        "weapon",
        weapon.value
    );

    mainMenu.style.display = "none";

    hud.style.display = "block";

    crosshair.style.display = "block";

    engine = new Engine();

    engine.start();

});

settingsButton.addEventListener("click",()=>{

    alert("Settings will be available soon.");

});

leaderboardButton.addEventListener("click",()=>{

    alert("Leaderboard coming soon.");

});
