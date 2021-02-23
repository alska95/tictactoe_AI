var bodyHtml = document.body;
var gameBoard = document.createElement('table');
var row = []; //줄
var allBlocks = []; //모든 칸들
var turn = ['O', 'X'];
var OXFlag = 0; //0 == 0 1 == X -1 == none //0 = 플레이어 1 = 컴퓨터


var valueArr = []; //가중치를 모든 배열에 저장
var counter = document.createElement('div'); //스코어 저장
var score = [0, 0]; //스코어 저장

var valid = 1; //동기 지연 세마포어 //보드가 꽉찬 경우 , 게임이 종료된 경우 플레이하지 못하게 막음


function showValues() {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            console.log(i + " " + j + " " + valueArr[i][j]);
        }
    }
}

function initValueArr() {
    for (var i = 0; i < 3; i++) {
        valueArr.push([]);
        for (var j = 0; j < 3; j++) {
            valueArr[i][j] = 0;
        }
    }
}

function initBoard() {

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            allBlocks[i][j].value = undefined;
            allBlocks[i][j].textContent = "";
        }
    }
    valid = 1;
    OXFlag = 0;
}

function isFull() {
    var fulltest = 0;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (allBlocks[i][j].value == undefined)
                fulltest = 1;
        }
    }
    if (fulltest == 0)
        return 1;
}
function makeBody(){
    for (var i = 0; i < 3; i++) {
        var singleRow = document.createElement('tr');
        allBlocks.push([]);
        row.push(singleRow);
        for (var j = 0; j < 3; j++) {
            var singleData = document.createElement('td');
            singleData.addEventListener('click', userClicked)
            allBlocks[i].push(singleData);
            singleRow.appendChild(singleData);
        }
        gameBoard.appendChild(singleRow);
    }


    bodyHtml.appendChild(gameBoard);
    bodyHtml.appendChild(counter);
}
////////////////////////////////////////init
function changeOX(target) {
    if (target == 1)
        return 0;
    else
        return 1;
}

function computerTurn() {
    initValueArr();
    if (isFull()) {
        valid = 0;
        setTimeout(() => initBoard(), 2000);
    } else {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (allBlocks[i][j].value == undefined) {
                    valueArr[i][j] += winnigCondition(i, j, 0, allBlocks);
                    //컴퓨터가(i,j)에 착수했을때 수의 가중치를 조사 //플레이어가 이기는 수 하나당 +10 , 컴퓨터가 이기는 수 하나당 +100
                    //컴퓨터가 연속 2개 만드는 수 +2 // 플레이어가 연속 2개 만드는 수 +2
                    valueArr[i][j] += winnigCondition(i, j, 1, allBlocks);
                }
            }
        }

        var targetX, targetY, biggest = -1;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (allBlocks[i][j].value == undefined) {
                    if (biggest <= valueArr[i][j]) {
                        biggest = valueArr[i][j];
                        targetY = i , targetX = j;
                    }
                }
            }
        }

        if (allBlocks[1][1].value == undefined && biggest < 10) {
            targetX = 1;
            targetY = 1;
        }

        allBlocks[targetY][targetX].textContent = turn[OXFlag];
        allBlocks[targetY][targetX].value = OXFlag;
        showValues();
        initValueArr();

        if (biggest >= 100) {
            valid = 0;
            counter.textContent = "플레이어 : " + score[0] + "  컴퓨터 : " + ++score[1];
            setTimeout(() => initBoard(), 2000);

        }
        if (OXFlag == 1)
            OXFlag = 0;
        else
            OXFlag = 1;
    }
}


var userClicked = function (event) {
    if (valid == 1) { //게임이 리셋되는 동안 정지시킴
        var selectedRow = row.indexOf(event.target.parentNode);
        var selectedBlock = allBlocks[selectedRow].indexOf(event.target);
        //console.log(selectedBlock , selectedRow , allBlocks[selectedRow][selectedBlock].value);
        if (allBlocks[selectedRow][selectedBlock].value == undefined) {
            var won = 0;
            //console.log("yes");
            allBlocks[selectedRow][selectedBlock].textContent = turn[OXFlag];
            allBlocks[selectedRow][selectedBlock].value = OXFlag;
            won = winnigCondition(selectedRow, selectedBlock, OXFlag, allBlocks);
            if (won == 10) {
                counter.textContent = "플레이어 : " + ++score[0] + "    컴퓨터 : " + score[1];
                setTimeout(() => initBoard(), 2000);

            }
            if (OXFlag == 1)
                OXFlag = 0;
            else
                OXFlag = 1;

            computerTurn();
        }
    }
}

var winnigCondition = function (indexY, indexX, flag, targetArr) {
    var returnVal = 1;
    var dx = [1, 1, 1, 0, 0, -1, -1, -1];
    var dy = [-1, 1, 0, -1, 1, 1, -1, 0];
    for (var i = 0; i < 8; i++) {
        var newX = dx[i] + indexX;
        var newY = dy[i] + indexY;
        if (newX < 0 || newX > 2 || newY < 0 || newY > 2) {
            continue;
        }
        if (targetArr[newY][newX].value == flag) {
            returnVal+= 1;
            newX += dx[i];
            newY += dy[i];
            if (newX < 0 || newX > 2 || newY < 0 || newY > 2) {
            }else
            if (targetArr[newY][newX].value == flag) {
                if (flag == 1)
                    returnVal+= 100; //컴퓨터 승리
                else
                    returnVal+= 10; //플레이어 승리
            }
            //////////////////////한칸 띄고 성립할경우
            newX = indexX - dx[i];
            newY = indexY - dy[i];
            if (newX < 0 || newX > 2 || newY < 0 || newY > 2) {
            }else
            if (targetArr[newY][newX].value == flag) {
                if (flag == 1)
                    returnVal+= 100; //컴퓨터 승리
                else
                    returnVal+= 10; //플레이어 승리
            }
        }

    }
    return returnVal; //결착x
}
//////////////////////////////////////////함수들

//makeBody();
