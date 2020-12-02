/**
 * MyPiece
 * @constructor
 */
class MyPiece extends CGFobject {
	constructor(scene, color) {
        super(scene);
        this.tile = null;
        this.color = color;
	}
	
	/**
     * @method initBuffers
     * Initializes the triangle buffers
     */
	initBuffers() {
	
		this.initGLBuffers();
	}

    getTile()
    {
        return this.tile;
    }

    setTile(tile)
    {
        this.tile = tile;
    }

    unsetTile(tile)
    {
        this.tile = null;
    }


    display()
    {

    }

    animate()
    {

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

