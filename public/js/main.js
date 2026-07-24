import Engine from "./engine.js";

const playButton = document.getElementById("playButton");
const settingsButton = document.getElementById("settingsButton");
const leaderboardButton = document.getElementById("leaderboardButton");

const mainMenu = document.getElementById("mainMenu");
const hud = document.getElementById("hud");
const crosshair = document.getElementById("crosshair");

const playerName = document.getElementById("playerName");
const weapon = document.getElementById("weapon");

let game = null;

playButton.addEventListener("click", () => {

    const name = playerName.value.trim();

    if (name.length < 2) {
        alert("Please enter your name.");
        return;
    }

    localStorage.setItem("playerName", name);
    localStorage.setItem("weapon", weapon.value);

    mainMenu.style.display = "none";

    hud.style.display = "block";

    crosshair.style.display = "block";

    game = new Engine();

    game.start();

});

settingsButton.addEventListener("click", () => {

    alert("Settings menu will be added soon.");

});

leaderboardButton.addEventListener("click", () => {

    alert("Leaderboard will be added soon.");

});

window.addEventListener("load", () => {

    const savedName = localStorage.getItem("playerName");

    const savedWeapon = localStorage.getItem("weapon");

    if (savedName)
        playerName.value = savedName;

    if (savedWeapon)
        weapon.value = savedWeapon;

});
