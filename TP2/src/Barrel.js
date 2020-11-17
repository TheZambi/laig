/**
 * Barrel
 * @constructor
 * @param {CGFscene} scene - Reference to MyScene object
 * @param {Integer} slices - Number of slices
 * @param {Integer} stacks - Number of stacks
 * @param {Float} baseRadius - Radius of the base
 * @param {Float} middleRadius - Radius of the middle
 * @param {Float} height - height of the barrel
 * 
 */
class Barrel extends CGFobject {
    constructor(scene, baseRadius, middleRadius, height, slices,stacks) {
        super(scene);
        this.baseRadius = baseRadius;
        this.middleRadius = middleRadius;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.hBase = 4/3*this.baseRadius; 
        this.hMiddle = 4/3*this.middleRadius;
        this.H = 4/3*(this.middleRadius-this.baseRadius);

        let controlPoints = 
        [
            [
                [-this.baseRadius,0,0,1],
                [-this.baseRadius,this.hBase,0,1],
                [this.baseRadius,this.hBase,0,1],
                [this.baseRadius,0,0,1]
            ],
            [
                [-this.baseRadius-this.H,0,this.H/(Math.sqrt(3)/3),1],
                [-this.baseRadius-this.H,this.hMiddle,this.H/(Math.sqrt(3)/3),1],
                [this.baseRadius+this.H,this.hMiddle,this.H/(Math.sqrt(3)/3),1],
                [this.baseRadius+this.H,0,this.H/(Math.sqrt(3)/3),1]
            ],
            [
                [-this.baseRadius-this.H,0,this.height-this.H/(Math.sqrt(3)/3),1],
                [-this.baseRadius-this.H,this.hMiddle,this.height-this.H/(Math.sqrt(3)/3),1],
                [this.baseRadius+this.H,this.hMiddle,this.height-this.H/(Math.sqrt(3)/3),1],
                [this.baseRadius+this.H,0,this.height-this.H/(Math.sqrt(3)/3),1]
            ],
            [
                [-this.baseRadius,0,this.height,1],
                [-this.baseRadius,this.hBase,this.height,1],
                [this.baseRadius,this.hBase,this.height,1],
                [this.baseRadius,0,this.height,1]
            ]
        ];
        this.degreeU = controlPoints.length-1; 
        this.degreeV = controlPoints[0].length-1; 
        this.surface = new CGFnurbsSurface(this.degreeU, this.degreeV, controlPoints);
        this.object = new CGFnurbsObject(scene, this.slices, this.stacks, this.surface);
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
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI,0,0,1);
        this.object.display();
        this.scene.popMatrix();
    }

    updateCoords() {}
}