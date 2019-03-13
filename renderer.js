const ipcRenderer = require('electron').ipcRenderer;
function dropPiece(elemId) {
    //console.log(elemId);
    var returnVal = ipcRenderer.sendSync("dropPiece", elemId);
    //console.log(returnVal);

    if (returnVal[2] <= 8) {
        var color = returnVal[0];
        var location = returnVal[1];
        var elements = document.getElementsByClassName("board-buttons");
        document.getElementById(location).style.backgroundColor = color;
        var nextColor = (color == "red") ? "blue" : "red";
        for(var i = 0; i < elements.length; i++) { 
            elements[i].style.backgroundColor = nextColor;
        }
    }
    if (returnVal[2] > 7) {
        document.getElementById(elemId).disabled = true;
        document.getElementById(elemId).classList.add("full");
    }        
    //var logicOut = ipcRenderer.sendSync("gameLogic", returnVal[3]);
    //console.log(logicOut);
    if (returnVal[3][0] == true) {
        if (returnVal[3][1] == true) { //red win
           document.getElementsByTagName("body")[0].classList.add("red-win");
        }
        else if (returnVal[3][1] == false) { //blue win
            document.getElementsByTagName("body")[0].classList.add("blue-win");
        }
        for (var i = 0; i < elements.length; i++) { 
            elements[i].classList.add("full");
            elements[i].disabled = true;
        }
    }
}
function resetBoard() {
    ipcRenderer.sendSync("resetBoard");
}