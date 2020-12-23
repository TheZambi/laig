/**
 * MyGameBoard
 * @constructor
 */
class MyGameBoard extends CGFobject {
    constructor(scene) {
        super(scene);
        this.counter = true;
        this.board = [];
        this.boardLength = [2, 3, 4, 5, 6, 5, 6, 7, 6, 7, 6, 7, 6, 7, 6, 7, 6, 5, 6, 5, 4, 3, 2];
        this.startDiagonal = [0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 7, 7, 8, 9, 10, 11];
        this.greenPieces = [];
        this.orangePieces = [];
        this.purplePieces = [];
        this.maxOdd = 7;
        this.maxEven = 6;
        this.initBuffers();
    }

    initBoard() {
        for (let i = 0; i < this.boardLength.length; i++) {
            let aux = this.startDiagonal[i];
            for (let j = 0; j < this.boardLength[i]; j++)
                this.board[[i, aux + j]] = new MyTile(this.scene,i, aux + j, this);
        }
    }

    initPieces() {
        for (let i = 0; i < 42; i++) {
            this.greenPieces.push(new MyPiece(this.scene, "green"));
            this.purplePieces.push(new MyPiece(this.scene, "purple"));
            this.orangePieces.push(new MyPiece(this.scene, "orange"));
        }
    }

    initBuffers() {
        this.initBoard();
        this.initPieces();
    }

    addPiece(x, y, piece) {
        this.board[[x, y]].setPiece(piece);
    }

    removePiece(x, y) {
        this.board[[x, y]].unsetPiece();
    }

    getTileByPiece(piece) {
        for (let i = 0; i < 42; i++) {
            if (this.greenPieces[i] == piece) return this.greenPieces[i];
            if (this.purplePieces[i] == piece) return this.purplePieces[i];
            if (this.orangePieces[i] == piece) return this.orangePieces[i];
        }
        return null;
    }

    getPieceByTile(tile) {
        for (var key in this.board) {
            if (this.board[key] == tile) {
                return this.board[key].getPiece();
            }
        }
        return null;
    }

    getTilePieceByCoords(x, y) {
        return this.board[[x, y]].getPiece();
    }

    movePiece(gamemove) {
        gamemove.getTile().setPiece(gamemove.getPiece());
    }


    displayTiles() {
        this.scene.pushMatrix();

        //rotates whole board 
        this.scene.rotate(-Math.PI * 2.25 / 3, 0, 1, 0);

        //centers the board
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.translate(-9, 0, 9.5);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);

        //tile display
        for (var key in this.board) {
            var coords = key.split(",");
            let row = coords[0];
            let diag = coords[1];
            if (row % 2 == 0) {
                var format = 1.5 + (this.maxEven - this.boardLength[row]) * 1.5;
            }
            else {
                var format = (this.maxOdd - this.boardLength[row]) * 1.5;
            }
            var offSet = (diag - this.startDiagonal[row]) * 3;

            this.scene.pushMatrix();

            this.scene.translate(offSet + format, (row) * 0.865, 0);
            this.scene.rotate(Math.PI / 2, 0, 0, 1);

            this.board[key].display();
            this.scene.popMatrix();
        }


        this.scene.popMatrix();
    }

    displayPieces() {
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/4,0,1,0);
        for(let i = 0;i<this.greenPieces.length;i++){
            this.row = (i%7);
            this.column = (i%6);
            if(!this.greenPieces[i].tile){
                this.scene.pushMatrix();
                this.scene.translate(-20+this.row,0,-12.5+this.column);
                this.greenPieces[i].display();
                this.scene.popMatrix();
            }

            if(!this.orangePieces[i].tile){
                this.scene.pushMatrix();
                this.scene.translate(-20+this.row,0,-2.5+this.column);
                this.orangePieces[i].display();
                this.scene.popMatrix();
            }

            if(!this.purplePieces[i].tile){
                this.scene.pushMatrix();
                this.scene.translate(-20+this.row,0,7.5+this.column);
                this.purplePieces[i].display();
                this.scene.popMatrix();
            }
        }

        
        this.scene.popMatrix();
    }

    display() {
        this.displayTiles();
        this.displayPieces();

    }

    undo(undoMove) {
        undoMove.tile.unsetPiece();
        undoMove.piece.unsetTile();
    }

    /**
     * @method updateCoords
     * Updates the list of texture coordinates of the triangle
     * @param {integer} afs - Amplification on s axis
     * @param {integer} aft - Amplification on t axis
     */
    updateCoords(afs, aft) {

    }
}
