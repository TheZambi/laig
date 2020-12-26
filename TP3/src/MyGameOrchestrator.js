/**
 * MyGameOrchestrator
 * @constructor
 */
class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene;
        // this.animator = new MyAnimator(…);
        // this.theme = new MyScenegraph(…);
        this.prologInterface = new MyPrologInterface(this);
        this.selectedPiece = null;
        this.gameSequence = new MyGameSequence();
        this.gameboard = new MyGameBoard(scene);
        this.currentPlayer = 0;
        this.colorsWon = [-1, -1, -1];
    }

    display() {
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
                this.gameboard.movePiece(newMove);
                this.gameSequence.addMove(newMove, this.colorsWon);
                this.selectedPiece = null;
                var newBoard = this.createBoard();
                var colorsWon = this.createColors();
                this.prologInterface.requestColorsWon("updateColorsWon([" + newBoard + "," + colorsWon + "]," + this.currentPlayer + ",0)"); //REMOVE 0 LATER AFTER AI IMPLEMENTED
                this.currentPlayer = (this.currentPlayer + 1) % 2;
            }
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

