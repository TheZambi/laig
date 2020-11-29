/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - x coordinate corner 1
 * @param y1 - y coordinate corner 1
 * @param x2 - x coordinate corner 2
 * @param y2 - y coordinate corner 2
 * @param x3 - x coordinate corner 3
 * @param y3 - y coordinate corner 3
 */
class MyTriangle extends CGFobject {
	constructor(scene, x1, y1, x2, y2,x3,y3) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;
		this.x3 = x3;
		this.y3 = y3;

		this.a = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
		this.b = Math.sqrt(Math.pow(x3-x2,2)+Math.pow(y3-y2,2));
		this.c = Math.sqrt(Math.pow(x1-x3,2)+Math.pow(y1-y3,2));

		this.cosA = (this.a*this.a - this.b*this.b + this.c*this.c)/(2*this.a*this.c);

		this.sinA = Math.sqrt(1-this.cosA*this.cosA);

		this.initBuffers();
	}
	
	/**
     * @method initBuffers
     * Initializes the triangle buffers
     */
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y2, 0,	//1
			this.x3, this.y3, 0 	//2
			
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2
		];
		
		var Ux = this.x2-this.x1;
		var Uy = this.y2-this.y1;
		var Vx = this.x3-this.x1;
		var Vy = this.y3-this.y1;

		//Facing Z positive
		this.normals = [
			0, 0, (Ux*Vy)-(Uy*Vx),
			0, 0, (Ux*Vy)-(Uy*Vx),
			0, 0, (Ux*Vy)-(Uy*Vx)
		];

		this.texCoords = [
			0, 1,
			this.a, 1,
			this.c*this.cosA, 1-this.c*this.sinA
		];
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}

	/**
     * @method updateCoords
     * Updates the list of texture coordinates of the triangle
	 * @param {integer} afs - Amplification on s axis
	 * @param {integer} aft - Amplification on t axis
     */
    updateCoords(afs, aft)
    {
		this.texCoords=[];

		this.texCoords = [
			0, 1,
			this.a/afs, 1,
			this.c*this.cosA/afs, 1-(this.c*this.sinA)/aft
		];

        this.updateTexCoordsGLBuffers();
    }
}

