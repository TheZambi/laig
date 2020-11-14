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

        let controlPoints = 
        [
            [
                [0,baseRadius,0,1],
                [baseRadius,baseRadius,0,1],
                [baseRadius,0,0,1],
                [baseRadius,-baseRadius,0,1],
                [0,-baseRadius,0,1],
                [-baseRadius,-baseRadius,0,1],
                [-baseRadius,0,0,1],
                [-baseRadius,baseRadius,0,1],
                [0,baseRadius,0,1]
            ],
            [
                [0,middleRadius,this.height/2,1],
                [middleRadius,middleRadius,this.height/2,1],
                [middleRadius,0,this.height/2,1],
                [middleRadius,-middleRadius,this.height/2,1],
                [0,-middleRadius,this.height/2,1],
                [-middleRadius,-middleRadius,this.height/2,1],
                [-middleRadius,0,this.height/2,1],
                [-middleRadius,middleRadius,this.height/2,1],
                [0,middleRadius,this.height/2,1]
            ],
            [
                [0,baseRadius,this.height,1],
                [baseRadius,baseRadius,this.height,1],
                [baseRadius,0,this.height,1],
                [baseRadius,-baseRadius,this.height,1],
                [0,-baseRadius,this.height,1],
                [-baseRadius,-baseRadius,this.height,1],
                [-baseRadius,0,this.height,1],
                [-baseRadius,baseRadius,this.height,1],
                [0,baseRadius,this.height,1]
            ],
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
    }

    updateCoords() {}
}