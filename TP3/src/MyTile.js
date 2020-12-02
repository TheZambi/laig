/**
 * MyTile
 * @constructor
 */
class MyTile extends CGFobject {
	constructor(scene) {
        super(scene);
        this.piece = null;
        this.board = null;
        this.color = null;
        this.tile = new MyCylinder(scene,6,1,1,1,0.5);
        this.defaultAppearance = new CGFappearance(this.scene);
        this.defaultAppearance.loadTexture('./scenes/images/door.png');
    }
	
	/**
     * @method initBuffers
     * Initializes the triangle buffers
     */
	initBuffers() {
	
	}

    getPiece()
    {
        return this.piece;
    }

    setPiece(piece)
    {
        this.piece = piece;
        // this.piece.setTile(this).
    }
    
    unsetPiece()
    {
        this.piece = null;
    }

    getBoard()
    {
        return this.board;
    }

    setBoard(board)
    {
        this.board = board;
    }

    display()
    {
        // this.display();
        
        this.defaultAppearance.apply();
        //Remove display and add clickable
        this.tile.display();

        if(this.piece)
            this.piece.display();
    }

	/**
     * @method updateCoords
     * Updates the list of texture coordinates of the triangle
	 * @param {integer} afs - Amplification on s axis
	 * @param {integer} aft - Amplification on t axis
     */
    updateCoords(afs, aft)
    {
		
    }
}

