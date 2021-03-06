/**
 * MyGameOrchestrator
 * @constructor
 */
class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene;
        this.currentGame = 0;
        this.boardTranslation = [0,0,0];
        this.animator = new MyAnimator(this);
        this.theme = 0;
        this.colorsWon = [-1, -1, -1];
        this.prologInterface = new MyPrologInterface(this);
        this.selectedPiece = null;
        this.gameSequence = new MyGameSequence();
        this.gameboard = new MyGameBoard(scene, this);
        this.currentPlayer = 0;
        this.gameStarted = false;
        this.winner = -1;
        this.moveDone = true;
        this.bot1Diff = 1;
        this.bot1Copy = this.bot1Diff;
        this.currentTurnStart = 0;
        this.startTurnTimer = false;
        this.turnTimers = [30,30,20,10];
        this.bot1Diffs = {
            "Easy": 1,
            "Medium": 2,
            "Hard": 3
        };
        
        this.gameMode = "1";
        this.gameModeCopy = this.gameMode;
        this.gameModes = {
            "Player vs Player": 1,
            "Player vs AI": 2,
            "AI vs Player": 3,
            "AI vs AI": 4
        };
        this.currentTime = 0;
        this.replayMode = false;
    }

    /**
     * @method replay
     * Starts the move replay
     */
    replay() {
        if(this.playerTurn() || this.winner != -1)
            this.animator.replay();
    }

    /**
     * @method endReplay
     * Ends the move replay
     */
    endReplay() {
        if (this.replayMode)
            this.animator.endReplay();
    }

    /**
     * @method prepareForMovie
     * Prepares the game for replayMode
     */
    prepareForMovie() {
        this.gameboard.prepareForMovie();
        this.currentPlayer = 0;
        this.moveDone = true;
        this.replayMode = true;
    }

    /**
     * @method reset
     * Resets the game to its initial state
     */
    reset() {
        if (!this.replayMode) {
            this.gameSequence = new MyGameSequence();
            this.gameboard = new MyGameBoard(this.scene, this);
            this.animator = new MyAnimator(this);
            this.gameStarted = false;
            this.winner = -1;
            this.currentPlayer = 0;
            this.colorsWon = [-1, -1, -1];
            this.gameboard.player0Score.colors = this.colorsWon;
            this.gameboard.player1Score.colors = this.colorsWon;
            this.moveDone = true;
            this.selectedPiece = null
        }
    }

    /**
     * @method update
     * updates the game according to timePassed
     */
    update(t) {
        this.currentTime = t;
        if(this.startTurnTimer){
            this.currentTurnStart = t;
            this.startTurnTimer = false;
        }
        this.currentTurnTimer = Math.floor((t - this.currentTurnStart)/1000);
        switch (this.gameMode){
            case "1":
                var turnTimeGamemode = this.turnTimers[this.gameMode-1];
                break;
            case "2":
                var turnTimeGamemode = this.turnTimers[this.bot1Diff];
                break;
            case "3":
                var turnTimeGamemode = this.turnTimers[this.bot1Diff];
                break;
            
        }
        
        this.newText = turnTimeGamemode - this.currentTurnTimer;
        if(this.gameStarted && this.newText < 0){
            this.winner = (this.currentPlayer + 1) % 2;
            this.gameStarted = false;
            this.newText = "";
            this.gameboard.timer.updateText(this.newText.toString());
        }
        if(this.winner == -1){
            this.gameboard.timer.updateText(this.newText.toString());
        }
        else if(this.winner != -1){
            this.newText = "Player " + (this.winner+1);
            this.gameboard.timer.updateText(this.newText.toString());
        }
        this.animator.update(t);
    }

    /**
     * @method playerTurn
     * Returns true if it is the player turn
     */
    playerTurn() {
        return this.gameStarted && !this.botTurn();
    }

    /**
     * @method makeBotMove
     * requests a bot move to prologInterface
     */
    makeBotMove() {
        this.moveDone = false;
        var newBoard = this.createBoard();
        var colorsWon = this.createColors();
        var nPiecesLeft = this.getNPiecesLeft();
        this.prologInterface.requestBotMove("choose_move([" + newBoard + "," + colorsWon + "," + nPiecesLeft + "]," + this.currentPlayer + "," + 1 + ")", this.currentGame);
    }

    /**
     * @method parseBotMove
     * Parses the move received from prolog interface
     */
    parseBotMove(move) {
        var piece = this.getAvailablePiece(move[2]);
        var newMove = new MyGameMove(piece, this.gameboard.board[[move[0], move[1]]], this.currentTime);
        this.makeMove(newMove);
        this.moveDone = true;
    }

    /**
     * @method parsePicking
     * Parses picking for a player move
     */
    parsePicking(obj) {
        if (obj instanceof PieceBox) {
            for (var i = 0; i < obj.pieces.length; i++) {
                if (obj.pieces[i].tile == null) {
                    this.selectedPiece = obj.pieces[i];
                    break;
                }
            }
        } else if (obj instanceof MyTile && this.selectedPiece != null) {
            if (obj.piece == null) {
                var newMove = new MyGameMove(this.selectedPiece, obj, this.currentTime);
                this.makeMove(newMove);
            }
        }
    }

    /**
     * @method makeMove
     * Makes a move and checks if someone has won
     */
    makeMove(newMove) {
        this.gameboard.movePiece(newMove);
        this.gameSequence.addMove(newMove, this.colorsWon);
        this.selectedPiece = null;
        this.startTurnTimer = true;
        var newBoard = this.createBoard();
        var colorsWon = this.createColors();
        if(!this.replayMode)
            this.prologInterface.requestColorsWon("updateColorsWon([" + newBoard + "," + colorsWon + "]," + this.currentPlayer + ",0)"); //REMOVE 0 LATER AFTER AI IMPLEMENTED
        this.currentPlayer = (this.currentPlayer + 1) % 2;

    }

    /**
     * @method getAvailablePiece
     * Gets the next available piece for color received
     */
    getAvailablePiece(color) {
        switch (color) {
            case "green":
                for (let i = 0; i < this.gameboard.greenPieces.length; i++) {
                    if (this.gameboard.greenPieces[i].tile == null)
                        return this.gameboard.greenPieces[i];
                }
                break;
            case "purple":
                for (let i = 0; i < this.gameboard.purplePieces.length; i++) {
                    if (this.gameboard.purplePieces[i].tile == null)
                        return this.gameboard.purplePieces[i];
                }
                break;
            case "orange":
                for (let i = 0; i < this.gameboard.orangePieces.length; i++) {
                    if (this.gameboard.orangePieces[i].tile == null)
                        return this.gameboard.orangePieces[i];
                }
                break;
        }
    }

    /**
     * @method getNPiecesLeft
     * Returns number of available pieces for each color
     */
    getNPiecesLeft() {
        var ret = "[";
        var greenPieces = 0;
        var orangePieces = 0;
        var purplePieces = 0;
        for (let i = 0; i < this.gameboard.greenPieces.length; i++) {
            if (this.gameboard.greenPieces[i].tile == null) {
                greenPieces++;
            }
            if (this.gameboard.orangePieces[i].tile == null) {
                orangePieces++;
            }
            if (this.gameboard.purplePieces[i].tile == null) {
                purplePieces++;
            }
        }
        ret += orangePieces + "," + purplePieces + "," + greenPieces;
        ret += "]";
        return ret;
    }

    /**
     * @method getBotDiff
     * Returns bot difficulty for prolog requesr
     */
    getBotDiff() {
        var ret;
        this.currentPlayer == 0 ? ret = this.bot1Copy : ret = this.bot2Copy;
        return ret;
    }

    /**
     * @method checkFinish
     * Checks if game has finished
     */
    checkFinish() {
        var playerColors = [0, 0];
        for (let i = 0; i < 3; i++) {
            if (this.colorsWon[i] != -1)
                playerColors[this.colorsWon[i]]++;
        }
        if (playerColors[0] >= 2) {
            this.winner = 0;
            this.gameStarted = false;
        } else if (playerColors[1] >= 2) {
            this.winner = 1;
            this.gameStarted = false;
        }
    }

    /**
     * @method startGame
     * Starts the game
     */
    startGame() {
        this.currentGame++;
        this.gameStarted = true;
        this.bot1Copy = this.bot1Diff;
        this.bot2Copy = this.bot2Diff;
        this.gameModeCopy = this.gameMode;
    }

    /**
     * @method play
     * Called during update loop, manages turns or starts game
     */
    play() {
        if (!this.gameStarted && this.winner == -1) {
            this.startGame();
            this.startTurnTimer = true;
        } else if (!this.gameStarted && this.winner != -1) {
            this.reset();
            this.startGame();
        }
        if (this.botTurn() && this.moveDone) {
            this.makeBotMove();
        }
    }

    /**
     * @method botTurn
     * Checks if it's a bot turn
     */
    botTurn() {
        switch (this.gameModeCopy) {
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

    /**
     * @method orchestrate
     * Orchestrates the game
     */
    orchestrate()
    {
        if (this.gameStarted && !this.replayMode) {
            this.play();
        }
        this.display();
    }

    /**
     * @method display
     * Displays the gameboard and other objects
     */
    display() {
        this.scene.pushMatrix();
        this.scene.translate(...this.boardTranslation);
        this.scene.scale(0.3,0.3,0.3);
        this.animator.display();
        this.gameboard.display();
        this.scene.popMatrix();
    }

    /**
     * @method undo
     * Undoes a move
     */
    undo() {
        if (!this.replayMode && this.gameStarted && this.playerTurn()) {
            switch (this.gameModeCopy) {
                case "1":
                    if (this.gameSequence.moveSequence.length != 0) {
                        this.gameSequence.undo(this.gameboard);
                        this.colorsWon = this.gameSequence.getLastColors();
                        this.selectedPiece = null;
                        this.currentPlayer = (this.currentPlayer + 1) % 2;
                    }
                    break;
                case "4":
                    break;
                default:
                    if (this.gameSequence.moveSequence.length >= 2) {
                        this.gameSequence.undo(this.gameboard);
                        this.colorsWon = this.gameSequence.getLastColors();
                        this.gameSequence.undo(this.gameboard);
                        this.colorsWon = this.gameSequence.getLastColors();
                        this.selectedPiece = null;
                    }
            }
            this.gameboard.player0Score.updateColors(this.colorsWon);
            this.gameboard.player1Score.updateColors(this.colorsWon);
        }
    }

    /**
     * @method createBoard
     * creates a board in a prolog friendly format
     */
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
                if (nPieces == this.gameboard.boardLength[currentRow] && currentRow < this.gameboard.boardLength.length - 1) {
                    ret += "],";
                    currentRow++;
                    nPieces = 0;
                } else if (nPieces == this.gameboard.boardLength[currentRow] && currentRow == this.gameboard.boardLength.length - 1) {
                    ret += "]";
                } else
                    ret += ",";
            }
        }
        ret += "]";
        return ret;
    }

    /**
     * @method createColors
     * creates colorsWon in a prolog friendly format
     */
    createColors() {
        let ret = "[";
        ret += this.colorsWon.join();
        ret += "]";
        return ret;
    }

}
