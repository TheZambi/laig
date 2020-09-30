class MyCylinder extends CGFobject {
    /**
     * @method constructor
     * @param  {CGFscene} scene - MyScene object
     * @param  {integer} stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
     */
    constructor(scene, slices, stacks, topRadius, bottomRadius, height) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.topRadius = topRadius;
        this.bottomRadius = bottomRadius;
        this.height = height;
        this.initBuffers();
    }

    /**
     * @method initBuffers
     * Initializes the sphere buffers
     * TODO: DEFINE TEXTURE COORDINATES
     */
    initBuffers() {


        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];



        var radiusDiff = (this.bottomRadius - this.topRadius);


        var ang = 2 * Math.PI / this.slices
        for (var j = 0; j <= this.stacks; j++) {
            for (var i = 0; i < this.slices; i += 1) {
                this.vertices.push(
                    Math.sin(ang * i) * (this.bottomRadius - radiusDiff * (j / this.stacks)),
                    Math.cos(ang * i) * (this.bottomRadius - radiusDiff * (j / this.stacks)),
                    this.height * (j / this.stacks)
                );

                var usedToNormalize = Math.sqrt((Math.sin(2 * Math.PI * i / this.slices)*Math.sin(2 * Math.PI * i / this.slices))
                                                +Math.cos(2 * Math.PI * i / this.slices)*Math.cos(2 * Math.PI * i / this.slices)
                                                +radiusDiff / this.height*radiusDiff / this.height);

                this.normals.push(Math.sin(2 * Math.PI * i / this.slices)/usedToNormalize, Math.cos(2 * Math.PI * i / this.slices)/usedToNormalize, (radiusDiff / this.height)/usedToNormalize);
                this.texCoords.push((this.slices - i) / this.slices, (1 - j) / this.stacks);
            }
        }



        for (var stack = 0; stack < this.stacks; stack++)
            for (var slice = 0; slice < this.slices; slice++) { //Reverse side so switching indices[2] with indices[1] so its counter clock-wise
                if (slice == this.slices - 1) {
                    this.indices.push(stack * this.slices + slice, stack * this.slices + slice + 1, stack * this.slices + slice + 1 - this.slices);
                    this.indices.push(stack * this.slices + slice, stack * this.slices + slice + this.slices, stack * this.slices + slice + 1);
                } else {
                    this.indices.push(stack * this.slices + slice, stack * this.slices + slice + 1 + this.slices, stack * this.slices + slice + 1);
                    this.indices.push(stack * this.slices + slice, stack * this.slices + slice + this.slices, stack * this.slices + slice + 1 + this.slices);
                }
            }

        for (var stack = 0; stack < this.stacks; stack++)
            for (var slice = 0; slice < this.slices; slice++) { //Reverse side so switching indices[2] with indices[1] so its counter clock-wise
                if (slice == this.slices - 1) {
                    this.indices.push(stack * this.slices + slice, stack * this.slices + slice + 1, stack * this.slices + slice + 1 - this.slices);
                    this.indices.push(stack * this.slices + slice, stack * this.slices + slice + this.slices, stack * this.slices + slice + 1);
                } else {
                    this.indices.push(stack * this.slices + slice, stack * this.slices + slice + 1 + this.slices, stack * this.slices + slice + 1);
                    this.indices.push(stack * this.slices + slice, stack * this.slices + slice + this.slices, stack * this.slices + slice + 1 + this.slices);
                }
            }

        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, -1);
        this.vertices.push(0, 0, this.height);
        this.normals.push(0, 0, 1);
        for (var slice = 0; slice < this.slices; slice++) {
            if (slice == this.slices - 1) {
                this.indices.push(slice, 0, this.slices * (this.stacks + 1));
                this.indices.push((this.slices * this.stacks) + slice, this.slices * (this.stacks + 1) + 1, (this.slices * this.stacks));
            } else {
                this.indices.push(slice, slice + 1, this.slices * (this.stacks + 1));
                this.indices.push((this.slices * this.stacks) + slice, this.slices * (this.stacks + 1) + 1, (this.slices * this.stacks) + slice + 1);

            }
        }
        var ang = 2 * Math.PI / this.slices
        for (var j = 0; j <=1; j++) {
            for (var i = 0; i < this.slices; i += 1) {
                this.vertices.push(
                    Math.sin(ang * i) * (this.bottomRadius - radiusDiff * (j / this.stacks)),
                    Math.cos(ang * i) * (this.bottomRadius - radiusDiff * (j / this.stacks)),
                    j*this.height
                );
                this.normals.push(0, 0, j*2-1);
                
            }
        }

        // this.enableNormalViz();

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}