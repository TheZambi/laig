/**
 * MyColorIndicator
 * @constructor
 */
class MyColorIndicator extends CGFobject {
	constructor(scene, color) {
        super(scene);
        this.rectangle = new MyRectangle(scene,0.5,-0.5,-0.5,0.5);
        this.box = new MyOpenBox(scene);
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

    display()
    {
        this.defaultAppearance.apply();
        this.scene.pushMatrix();
        this.scene.translate(0,0.25,0);
        this.scene.scale(1,0.45,1);
        this.scene.pushMatrix();
        this.scene.translate(0,0.5,0);
        this.scene.rotate(Math.PI/2,1,0,0);
        this.rectangle.display();
        this.scene.popMatrix();
        this.box.display();
        this.scene.popMatrix();
    }

    updateCoords(afs, aft)
    {
    }
}

