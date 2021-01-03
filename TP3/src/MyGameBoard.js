/**
 * MyGameBoard
 * @constructor
 */
class MyGameBoard extends CGFobject {
    constructor(scene,orchestrator) {
        super(scene);
        this.orchestrator = orchestrator;
        this.counter = true;
        this.board = [];
        this.boardLength = [2, 3, 4, 5, 6, 5, 6, 7, 6, 7, 6, 7, 6, 7, 6, 7, 6, 5, 6, 5, 4, 3, 2];
        this.startDiagonal = [0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 7, 7, 8, 9, 10, 11];
        this.greenPieces = [];
        this.orangePieces = [];
        this.purplePieces = [];
        this.player0Score = new MyGameScore(scene, 0, this.orchestrator.colorsWon);
        this.player1Score = new MyGameScore(scene, 1, this.orchestrator.colorsWon);

        this.boxAppearence = new CGFappearance(this.scene);
        this.boxAppearence.loadTexture('./scenes/images/cardboard.png');

        this.greenBox = new PieceBox(scene, "green", this.greenPieces);
        this.orangeBox = new PieceBox(scene,"orange",this.orangePieces);
        this.purpleBox = new PieceBox(scene,"purple",this.purplePieces);

        this.orangeIndicator = new MyColorIndicator(scene, "orange");
        this.greenIndicator = new MyColorIndicator(scene, "green");
        this.purpleIndicator = new MyColorIndicator(scene, "purple");

        this.timer = new MyTurnTimer(scene,orchestrator);

        this.maxOdd = 7;
        this.maxEven = 6;
        this.initBuffers();
    }

    /**
     * @method prepareForMovie
     * prepares the board for the movie by unsetting all pieces from its tiles
     */
    prepareForMovie()
    {
        for (var key in this.board) {
            if(this.board[key].piece != null){
                this.board[key].piece.unsetTile();
                this.board[key].unsetPiece();
            }
        }
    }

    /**
     * @method initBoard
     * Initializes the Board by placing its tiles
     */
    initBoard() {
        for (let i = 0; i < this.boardLength.length; i++) {
            let aux = this.startDiagonal[i];

            

            for (let j = 0; j < this.boardLength[i]; j++){
                if (i % 2 == 0) {
                    var format = 1.5 + (this.maxEven - this.boardLength[i]) * 1.5;
                }
                else {
                    var format = (this.maxOdd - this.boardLength[i]) * 1.5;
                }
                var offSet = (aux+j - this.startDiagonal[i]) * 3;

                // Takes into account board translation aswell with -9 x and 9.5 z
                // Axis rotated to facilitate animation
                var translation = [-9 + offSet + format, 0.5, 9.5-(i*0.865)];


                this.board[[i, aux + j]] = new MyTile(this.scene,i, aux + j, this, this.orchestrator, translation);
            }
        }
    }

    /**
     * @method initPieces
     * Initializes the pieces available
     */
    initPieces() {
        for (let i = 0; i < 42; i++) {
            this.greenPieces.push(new MyPiece(this.scene, "green",[10,1,-17]));
            this.purplePieces.push(new MyPiece(this.scene, "purple",[-10,1,-17]));
            this.orangePieces.push(new MyPiece(this.scene, "orange",[0,1,-17]));
        }
    }

    /**
     * @method initBuffers
     * Initializes the object's buffers
     */
    initBuffers() {
        this.initBoard();
        this.initPieces();
    }

    /**
     * @method addPiece
     * Sets the piece on [x,y] coords
     */
    addPiece(x, y, piece) {
        this.board[[x, y]].setPiece(piece);
    }

    /**
     * @method removePiece
     * Removes the piece on [x,y] coords
     */
    removePiece(x, y) {
        this.board[[x, y]].unsetPiece();
    }

    /**
     * @method getTileByPiece
     * Returns the tile that has the corresponding piece received
     */
    getTileByPiece(piece) {
        for (let i = 0; i < 42; i++) {
            if (this.greenPieces[i] == piece) return this.greenPieces[i].tile;
            if (this.purplePieces[i] == piece) return this.purplePieces[i].tile;
            if (this.orangePieces[i] == piece) return this.orangePieces[i].tile;
        }
        return null;
    }

     /**
     * @method getPieceByTile
     * Returns the piece that has the corresponding tile received
     */
    getPieceByTile(tile) {
        for (var key in this.board) {
            if (this.board[key] == tile) {
                return this.board[key].getPiece();
            }
        }
        return null;
    }

     /**
     * @method getTilePieceByCoords
     * Returns the piece on the [x,y] tile
     */
    getTilePieceByCoords(x, y) {
        return this.board[[x, y]].getPiece();
    }

    /**
     * @method movePiece
     * moves the piece to its tile
     */
    movePiece(gamemove) {
        gamemove.getTile().setPiece(gamemove.getPiece());
    }


    /**
     * @method displayTiles
     * Displays the tiles
     */
    displayTiles() {
        this.scene.pushMatrix();


        //centers the board
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

            this.board[key].display();
            this.scene.popMatrix();
        }


        this.scene.popMatrix();
    }


    /**
     * @method displayBoxed
     * Displays the piece boxes
     */
    displayBoxes()
    {
        this.boxAppearence.apply();
        this.scene.pushMatrix();
        // this.scene.rotate(Math.PI/4,0,1,0);
        this.scene.pushMatrix();
        this.scene.translate(0,0,-17);


        if(this.orangeBox.pieces[this.orangeBox.pieces.length-1].tile == null && this.orchestrator.playerTurn() && !this.orchestrator.replayMode){
            this.scene.registerForPick(this.scene.currentPickIndex, this.orangeBox);
            this.scene.currentPickIndex++;
        }
        else
        {
            this.scene.clearPickRegistration();
        }
        this.orangeBox.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(10,0,-17);

        if(this.greenBox.pieces[this.greenBox.pieces.length-1].tile == null && this.orchestrator.playerTurn() && !this.orchestrator.replayMode){
            this.scene.registerForPick(this.scene.currentPickIndex, this.greenBox);
            this.scene.currentPickIndex++;
        }
        else
        {
            this.scene.clearPickRegistration();
        }
        this.boxAppearence.apply();

        this.greenBox.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-10,0,-17);

        if(this.purpleBox.pieces[this.purpleBox.pieces.length-1].tile == null && this.orchestrator.playerTurn() && !this.orchestrator.replayMode){
            this.scene.registerForPick(this.scene.currentPickIndex, this.purpleBox);
            this.scene.currentPickIndex++;
        }
        else
        {
            this.scene.clearPickRegistration();
        }
        this.boxAppearence.apply();

        this.purpleBox.display();
        this.scene.popMatrix();
        this.scene.popMatrix();
    }

    /**
     * @method displayIndicators
     * Displays the color indicators on the borders of the board
     */
    displayIndicators()
    {
        this.scene.pushMatrix();
        this.scene.scale(6.5,1,4.2);

        this.scene.pushMatrix();
        this.scene.translate(0.8,0,-1.95);
        this.orangeIndicator.display();

        this.scene.translate(0,0,3.9);
        this.purpleIndicator.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI,0,1,0);
        this.scene.translate(0.8,0,-1.95);
        this.orangeIndicator.display();

        this.scene.translate(0,0,3.9);
        this.purpleIndicator.display();

        this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();

        this.scene.translate(9.54,0,0);        
        this.scene.rotate(Math.PI/4,0,1,0);
        this.scene.scale(6,1,6);
        this.greenIndicator.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-9.54,0,0);        
        this.scene.rotate(Math.PI/4,0,1,0);
        this.scene.scale(6,1,6);
        this.greenIndicator.display();

        this.scene.popMatrix();
    }

    /**
     * @method displayScores
     * Displays the score markers
     */
    displayScores()
    {
        this.scene.pushMatrix();
        this.scene.translate(16,0,0);
        this.player0Score.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(-16,0,0);
        this.scene.rotate(Math.PI,0,1,0);
        this.player1Score.display();
        this.scene.popMatrix();
    }

    /**
     * @method displayTimer
     * Displays the timer
     */
    displayTimer(){
        this.scene.pushMatrix();
        this.scene.translate(0,10,-20);
        this.timer.display();
        this.scene.popMatrix();
    }

    /**
     * @method display
     * Displays all objects
     */
    display() {
        
        this.displayIndicators();
        this.displayScores();
        this.displayTimer();
        this.displayTiles();
        this.scene.pushMatrix();
        this.scene.translate(0,1.51,0);
        this.displayBoxes();
        this.scene.popMatrix();

    }

    /**
     * @method undo
     * undoes a move
     */
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

