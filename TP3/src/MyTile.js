/**
 * MyTile
 * @constructor
 */
class MyTile extends CGFobject {
	constructor(scene, row, diag, board) {
        super(scene);
        this.piece = null;
        this.board = board;
        this.color = null;
        this.tile = new MyCylinder(scene,6,1,1,1,0.5);
        this.defaultAppearance = scene.tileAppearence;
        this.row = row;
        this.diag = diag;
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
        this.piece.setTile(this);
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

        if(!this.piece){
            this.scene.registerForPick(this.scene.currentPickIndex, this);
            this.scene.currentPickIndex++;
        }
        else{
            this.scene.clearPickRegistration();
        }
        
        this.defaultAppearance.apply();
        //Remove display and add clickable
        this.tile.display();

        if(this.piece){
            this.scene.pushMatrix();
            this.scene.rotate(Math.PI/2,1,0,0);
            this.scene.translate(0,-0.5,0);
            this.piece.display();
            this.scene.popMatrix();
        }
       
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

