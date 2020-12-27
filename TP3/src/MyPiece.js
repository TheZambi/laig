/**
 * MyPiece
 * @constructor
 */
class MyPiece extends CGFobject {
	constructor(scene, color, translation) {
        super(scene);
        this.tile = null;
        this.color = color;
        this.translation = translation;
        this.piece = new MyCylinder(scene,20,20,0.5,0.5,0.5);
        this.defaultAppearance = new CGFappearance(scene);
        if(color == "green"){
            this.defaultAppearance.setAmbient(0,0.5,0,1);
            this.defaultAppearance.setDiffuse(0,0.5,0,1);
            this.defaultAppearance.setSpecular(0,0.5,0,1);

        }
        else if(color == "orange"){
            this.defaultAppearance.setAmbient(1,0.31,0,1);
            this.defaultAppearance.setDiffuse(1,0.31,0,1);
            this.defaultAppearance.setSpecular(1,0.31,0,1);
        }
        else{
            this.defaultAppearance.setAmbient(0.47,0.32,0.66,1);
            this.defaultAppearance.setDiffuse(0.47,0.32,0.66,1);
            this.defaultAppearance.setSpecular(0.47,0.32,0.66,1);
        }
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
        
        
        //rotates piece to xz axis
        this.scene.pushMatrix();
        this.defaultAppearance.apply();
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.piece.display();
        this.scene.popMatrix();
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

