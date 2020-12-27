/**
 * MyGameOrchestrator
 * @constructor
 */
class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene;
        this.animator = new MyAnimator(this);
        // this.theme = new MyScenegraph(…);
        this.prologInterface = new MyPrologInterface(this);
        this.selectedPiece = null;
        this.gameSequence = new MyGameSequence();
        this.gameboard = new MyGameBoard(scene,this);
        this.currentPlayer = 0;
        this.gameStarted = false;
        this.colorsWon = [-1, -1, -1];
        this.moveDone = true;
        this.bot1Diff = 1;
        this.bot1Copy = this.bot1Diff;
        this.bot1Diffs = {"Easy":1, "Medium":2, "Hard":3};
        this.bot2Diff = 1;
        this.bot2Copy = this.bot2Diff;
        this.bot2Diffs = {"Easy":1, "Medium":2, "Hard":3};
        this.gameMode = 1;
        this.gameModeCopy = this.gameMode;
        this.gameModes = { "Player vs Player":1, "Player vs AI":2, "AI vs Player":3, "AI vs AI":4};
    }

    playerTurn(){
        return this.gameStarted && !this.botTurn();
    }

    makeBotMove(){
        this.moveDone = false;
        var newBoard = this.createBoard();
        var colorsWon = this.createColors();
        var botDiff = this.getBotDiff();
        var nPiecesLeft = this.getNPiecesLeft();
        this.prologInterface.requestBotMove("choose_move([" + newBoard + "," + colorsWon + "," + nPiecesLeft + "]," + this.currentPlayer + "," + botDiff + ")");
    }

    parseBotMove(move){
        var piece = this.getAvailablePiece(move[2]);
        var newMove = new MyGameMove(piece, this.gameboard.board[[move[0], move[1]]]);
        this.makeMove(newMove);
        this.moveDone = true;
    }

    parsePicking(obj) {
        if (obj instanceof PieceBox) {
            for(var i = 0; i < obj.pieces.length; i++)
            {
                if(obj.pieces[i].tile == null)
                    {
                        this.selectedPiece = obj.pieces[i];
                        break;
                    }
            } 
        }
        else if (obj instanceof MyTile && this.selectedPiece != null) {
            if (obj.piece == null) {
                var newMove = new MyGameMove(this.selectedPiece, obj)
                this.makeMove(newMove);
            }
        }
    }

    makeMove(newMove){
        this.gameboard.movePiece(newMove);
        this.gameSequence.addMove(newMove, this.colorsWon);
        this.animator.addMoveToSequence(newMove);
        this.selectedPiece = null;
        var newBoard = this.createBoard();
        var colorsWon = this.createColors();
        this.prologInterface.requestColorsWon("updateColorsWon([" + newBoard + "," + colorsWon + "]," + this.currentPlayer + ",0)"); //REMOVE 0 LATER AFTER AI IMPLEMENTED
        this.currentPlayer = (this.currentPlayer + 1) % 2;
    }

    getAvailablePiece(color){
        switch(color){
            case "green":
                for(let i = 0;i < this.gameboard.greenPieces.length;i++){
                    if(this.gameboard.greenPieces[i].tile == null)
                        return this.gameboard.greenPieces[i];
                }
                break;
            case "purple":
                for(let i = 0;i < this.gameboard.purplePieces.length;i++){
                    if(this.gameboard.purplePieces[i].tile == null)
                        return this.gameboard.purplePieces[i];
                }
                break;
            case "orange":
                for(let i = 0;i < this.gameboard.orangePieces.length;i++){
                    if(this.gameboard.orangePieces[i].tile == null)
                        return this.gameboard.orangePieces[i];
                }
                break;
        }
    }

    getNPiecesLeft(){
        var ret = "[";
        var greenPieces = 0;
        var orangePieces = 0;
        var purplePieces = 0;
        for(let i = 0; i < this.gameboard.greenPieces.length; i++){
            if(this.gameboard.greenPieces[i].tile == null){
                greenPieces++;
            }
            if(this.gameboard.orangePieces[i].tile == null){
                orangePieces++;
            }
            if(this.gameboard.purplePieces[i].tile == null){
                purplePieces++;
            }
        }
        ret += orangePieces + "," + purplePieces + "," + greenPieces;
        ret += "]";
        return ret;
    }

    getBotDiff(){
        var ret;
        this.currentPlayer == 0 ? ret = this.bot1Copy : ret = this.bot2Copy;
        return ret;
    }

    play(){
        if(!this.gameStarted){
            this.gameStarted = true;
            this.bot1Copy = this.bot1Diff;
            this.bot2Copy = this.bot2Diff;
            this.gameModeCopy = this.gameMode;
        }
        if(this.botTurn() && this.moveDone){
            this.makeBotMove();
        }
    }

    botTurn(){
        switch(this.gameModeCopy){
            case "1":
                return false;
            case "2":
                return this.currentPlayer == 1;
            case "3":
                return this.currentPlayer == 0;
            case "4":
                return true;
        }
    }
    
    display() {
        if(this.gameStarted){
            this.play();
        }
        this.animator.display();
        this.gameboard.display();
    }

    undo()
    {
        if(this.gameSequence.moveSequence.length != 0){
            this.gameSequence.undo(this.gameboard);
            this.colorsWon = this.gameSequence.getLastColors();
            this.selectedPiece = null;
        }
    }

    createBoard() {
        let currentRow = 0;
        let nPieces = 0;
        let ret = "[";
        for (var key in this.gameboard.board) {
            if (nPieces == 0) {
                ret += "[";
            }

            if (nPieces < this.gameboard.boardLength[currentRow]) {
                if (this.gameboard.board[key].piece)
                    ret += this.gameboard.board[key].piece.color;
                else
                    ret += "empty";
                nPieces++;
                if (nPieces == this.gameboard.boardLength[currentRow] && currentRow < this.gameboard.boardLength.length-1) {
                    ret += "],";
                    currentRow++;
                    nPieces = 0;
                }
                else if(nPieces == this.gameboard.boardLength[currentRow] && currentRow == this.gameboard.boardLength.length-1) {
                    ret += "]";
                }
                else
                    ret += ",";
            }
        }
        ret += "]";
        return ret;
    }

    createColors() {
        let ret = "[";
        ret += this.colorsWon.join();
        ret += "]";
        return ret;
    }

}

