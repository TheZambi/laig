/**
 * Plane
 * @constructor
 * @param scene - Reference to MyScene object
 */
class Plane extends CGFobject {
    constructor(scene, divsU, divsV) {
        super(scene);
        this.divsU = divsU;
        this.divsV = divsV;
        let auxControlPoints = 
        [
            [
                [0.5, 0, -0.5, 1],
                [0.5, 0, 0.5, 1]
            ],
            [
                [-0.5, 0, -0.5, 1],
                [-0.5, 0, 0.5, 1]
            ]
        ];
        this.surface = new CGFnurbsSurface(1, 1, auxControlPoints);
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