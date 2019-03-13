"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var win = null;
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 1000,
        height: 1000,
        resizable: false,
        title: 'Connect Four'
    });
    win.loadFile('index.html');
    win.on('closed', function () {
        win = null;
    });
}
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    if ('window-all-closed' === null) {
        createWindow();
    }
});
electron_1.app.on('browser-window-created', function (e, window) {
    window.setMenu(null);
});
//From here on is interactive functions for the HTML
electron_1.ipcMain.on("resetBoard", function () {
    boardArr =
        [
            [3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3],
            [3, 3, 3, 3, 3, 3, 3]
        ];
    row = {
        "column_1": 1,
        "column_2": 1,
        "column_3": 1,
        "column_4": 1,
        "column_5": 1,
        "column_6": 1,
        "column_7": 1
    };
    player = "red";
    win.loadFile('index.html');
});
var row = {
    "column_1": 1,
    "column_2": 1,
    "column_3": 1,
    "column_4": 1,
    "column_5": 1,
    "column_6": 1,
    "column_7": 1
};
var col = {
    "column_1": 1,
    "column_2": 2,
    "column_3": 3,
    "column_4": 4,
    "column_5": 5,
    "column_6": 6,
    "column_7": 7
};
var playerDict = {
    "red": 0,
    "blue": 1
};
var boardArr = [
    [3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3]
];
var player = "red";
var winLen = 4;
var boardSize = 7;
electron_1.ipcMain.on("dropPiece", function (event, elemId) {
    //console.log(elemId);
    var location = row[elemId] + "," + col[elemId];
    //console.log(location + " | " + player);
    boardArr[row[elemId] - 1][col[elemId] - 1] = playerDict[player];
    //console.log(boardArr);
    var locationArr = [row[elemId] - 1, col[elemId] - 1];
    var winner = null; //start of win conditions
    var winCondition = null;
    var diagOut = gameLogic(locationArr);
    //console.log(diagOut);
    if (diagOut == true) {
        winner = boardArr[locationArr[0]][locationArr[1]] == 0;
        winCondition = [true, winner];
    }
    if (winner == null) {
        winCondition = [false, null];
    }
    row[elemId]++;
    event.returnValue = [player, location, row[elemId], winCondition];
    player = (player == "red") ? "blue" : "red";
});
//console.log(gameLogic([0,4]));
function gameLogic(locator) {
    //console.log("Locator: " + locator + "\n");
    var winDiag = false;
    var cornersAligned = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    var forwardDiag = 0;
    var backwardDiag = 0;
    var vert = 0;
    var horz = 0;
    /* boardArr =
    [
        [ 3, 0, 0, 0, 0, 3, 3 ],
        [ 3, 1, 1, 0, 3, 3, 3 ],
        [ 3, 3, 1, 1, 3, 3, 3 ],
        [ 3, 3, 3, 3, 3, 3, 3 ],
        [ 3, 3, 3, 3, 3, 3, 3 ],
        [ 3, 3, 3, 3, 3, 3, 3 ],
        [ 3, 3, 3, 3, 3, 3, 3 ]
    ] */
    for (var radius = 1; radius <= winLen && winDiag === false; radius++) {
        for (var rows = -1; rows <= 1 && winDiag === false; rows++) {
            var ik = rows * (radius);
            //console.log("loop 1")
            if (locator[0] + (ik) < 0 || locator[0] + (ik) > boardSize - 1) { // checking for outOfBounds
                //console.log("outOfBounds: rows");
                continue;
            }
            else {
                for (var cols = -1; cols <= 1; cols++) {
                    var jk = cols * (radius);
                    //console.log("loop 2")
                    forwardDiag = cornersAligned[0][2] + cornersAligned[2][0]; // calculates sums of win directions
                    backwardDiag = cornersAligned[0][0] + cornersAligned[2][2];
                    vert = cornersAligned[0][1] + cornersAligned[2][1];
                    horz = cornersAligned[1][0] + cornersAligned[1][2];
                    if (forwardDiag >= winLen - 1 || backwardDiag >= winLen - 1 || vert >= winLen - 1 || horz >= winLen - 1) { // checks sums and breaks if a win has been found
                        winDiag = true;
                        break;
                    }
                    if (cols == 0 && rows == 0) { // continues when middle point will be selected
                        continue;
                    }
                    if (locator[1] + (jk) < 0 || locator[1] + (jk) > boardSize - 1) { // checking for outOfBounds
                        //console.log("outOfBounds: cols");
                        continue;
                    }
                    else {
                        //console.log("6")
                        /* var temp = [
                            radius,
                            ik,
                            jk,
                            locator[0],
                            locator[1],
                            boardArr[locator[0]][locator[1]],
                            boardArr[locator[0] + ik][locator[1] + jk]
                        ] */
                        //console.log(temp);
                        if (cornersAligned[-1 * rows + 1][cols + 1] == null) { //stops adding to broken chains
                            //console.log("Skipping broken chain");
                            continue;
                        }
                        else if (boardArr[locator[0]][locator[1]] == boardArr[locator[0] + ik][locator[1] + jk]) {
                            //console.log("1");
                            cornersAligned[-1 * rows + 1][cols + 1] += 1;
                        }
                        else {
                            cornersAligned[-1 * rows + 1][cols + 1] = null;
                        }
                        //console.log(cornersAligned);
                    }
                }
            }
        }
    }
    var forwardDiag = cornersAligned[0][2] + cornersAligned[2][0];
    var backwardDiag = cornersAligned[0][0] + cornersAligned[2][2];
    var vert = cornersAligned[0][1] + cornersAligned[2][1];
    var horz = cornersAligned[1][0] + cornersAligned[1][2];
    //console.log("\n" + forwardDiag + " | " + backwardDiag + " | " + vert + " | " + horz);
    //console.log("cornersAligned: " + cornersAligned)
    if (forwardDiag >= winLen - 1 || backwardDiag >= winLen - 1 || vert >= winLen - 1 || horz >= winLen - 1) {
        winDiag = true;
    }
    return (winDiag);
}



