import { app, BrowserWindow, ipcMain } from "electron";

let win: any = null;
function createWindow(): void {
    win = new BrowserWindow({
        width: 1000,
        height: 1000,
        resizable: false,
        title: 'Connect Four'
    });

    win.loadFile('index.html');

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', (): void => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});


app.on('activate', (): void => {
    if ('window-all-closed' === null) {
        createWindow();
    }
});

app.on('browser-window-created', function(e, window): void { // removes top menu
    window.setMenu(null);
});

//From here on is interactive functions for the HTML

ipcMain.on("resetBoard", (): void => { //resets board variables
    boardArr = 
    [
        [3,3,3,3,3,3,3],
        [3,3,3,3,3,3,3],
        [3,3,3,3,3,3,3],
        [3,3,3,3,3,3,3],
        [3,3,3,3,3,3,3],
        [3,3,3,3,3,3,3],
        [3,3,3,3,3,3,3]
    ]
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
})

var row: object = { // tracks row idx
    "column_1": 1,
    "column_2": 1,
    "column_3": 1,
    "column_4": 1,
    "column_5": 1,
    "column_6": 1,
    "column_7": 1
};
const col: object = {
    "column_1": 1,
    "column_2": 2,
    "column_3": 3,
    "column_4": 4,
    "column_5": 5,
    "column_6": 6,
    "column_7": 7
};
const playerDict: object = {
    "red": 0,
    "blue": 1
}
var boardArr: Array<Array<number>> = 
[
    [3,3,3,3,3,3,3],
    [3,3,3,3,3,3,3],
    [3,3,3,3,3,3,3],
    [3,3,3,3,3,3,3],
    [3,3,3,3,3,3,3],
    [3,3,3,3,3,3,3],
    [3,3,3,3,3,3,3]
]
var player: string = "red";
var winLen: number = 4;
var boardSize: number = 7;
ipcMain.on("dropPiece", (event: any, elemId: string): void => {
    //console.log(elemId);
    var location: string = row[elemId] + "," + col[elemId];
    //console.log(location + " | " + player);
    boardArr[row[elemId]-1][col[elemId]-1] = playerDict[player];
    //console.log(boardArr);
    var locationArr = [row[elemId]-1, col[elemId]-1];
    
    var winner: boolean = null; //start of win conditions
    var winCondition: Array<boolean> = null;
    var diagOut: boolean = gameLogic(locationArr);
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
})
//console.log(gameLogic([0,4]));

function gameLogic(locator: Array<number>): boolean {
    //console.log("Locator: " + locator + "\n");
    var winDiag: boolean = false;
    var cornersAligned: Array<Array<number>> = [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ]
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

    for (let radius = 1; radius <= winLen && winDiag === false; radius++) {
        for (let rows = -1; rows <= 1 && winDiag === false; rows++) {
            var ik: number = rows * (radius);
            //console.log("loop 1")
            
            if (locator[0] + (ik) < 0 || locator[0] + (ik) > boardSize-1) { // checking for outOfBounds
                //console.log("outOfBounds: rows");
                continue;
            }
            else {
                for (let cols = -1; cols <= 1; cols++) {
                    var jk: number = cols * (radius);
                    //console.log("loop 2")

                    forwardDiag = cornersAligned[0][2] + cornersAligned[2][0]; // calculates sums of win directions
                    backwardDiag = cornersAligned[0][0] + cornersAligned[2][2];
                    vert = cornersAligned[0][1] + cornersAligned[2][1];
                    horz = cornersAligned[1][0] + cornersAligned[1][2];

                    if (forwardDiag >= winLen-1 || backwardDiag >= winLen-1 || vert >= winLen-1 || horz >= winLen-1) { // checks sums and breaks if a win has been found
                        winDiag = true;
                        break;
                    }
                    if (cols == 0 && rows == 0) { // continues when middle point will be selected
                        continue;
                    }
                    if (locator[1] + (jk) < 0 || locator[1] + (jk) > boardSize-1) { // checking for outOfBounds
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
                        if (cornersAligned[-1*rows+1][cols+1] == null) { //stops adding to broken chains
                            //console.log("Skipping broken chain");
                            continue;
                        }
                        else if (boardArr[locator[0]][locator[1]] == boardArr[locator[0] + ik][locator[1] + jk]) {
                            //console.log("1");
                            cornersAligned[-1*rows+1][cols+1] += 1;
                            
                        }
                        else {
                            cornersAligned[-1*rows+1][cols+1] = null;
                        }
                        //console.log(cornersAligned);
                    }
                }
            }   
        }
    }
    var forwardDiag: number = cornersAligned[0][2] + cornersAligned[2][0];
    var backwardDiag: number = cornersAligned[0][0] + cornersAligned[2][2];
    var vert: number = cornersAligned[0][1] + cornersAligned[2][1];
    var horz: number = cornersAligned[1][0] + cornersAligned[1][2];
    //console.log("\n" + forwardDiag + " | " + backwardDiag + " | " + vert + " | " + horz);
    //console.log("cornersAligned: " + cornersAligned)
    if (forwardDiag >= winLen-1 || backwardDiag >= winLen-1 || vert >= winLen-1 || horz >= winLen-1) {
        winDiag = true;
    }
    return(winDiag);
}