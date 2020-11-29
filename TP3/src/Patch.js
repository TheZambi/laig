/**
 * Patch
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {Integer} divsU - Number of divisions along U axis
 * @param {Integer} divsV - Number of divisions along V axis
 * @param {Array} controlPoints - Array of control points
 * 
 */
class Patch extends CGFobject {
    constructor(scene, divsU, divsV, controlPoints) {
        super(scene);
        this.divsU = divsU;
        this.divsV = divsV;
        this.degreeU = controlPoints.length-1; 
        this.degreeV = controlPoints[0].length-1; 
        this.surface = new CGFnurbsSurface(this.degreeU, this.degreeV, controlPoints);
        this.object = new CGFnurbsObject(scene, this.divsU, this.divsV, this.surface);
        this.initBuffers();
    }

    /**
     * @method initBuffers
     * Initializes the triangle buffers
     */
    initBuffers() {
        this.object.initBuffers();
    }

    display() {
        this.object.display();
    }

    updateCoords() {}
}