class MyCylinder extends CGFobject {
    /**
     * @method constructor
     * @param  {CGFscene} scene - MyScene object
     * @param  {integer} stacks - number of divisions on Z axis (cylinder is on Z axis) 
     * @param  {integer} slices - number of divisions on the bottom circle 
     * @param  {integer} topRadius - radius of the top
     * @param  {integer} bottomRadius -  radius of the bottom
     * @param  {integer} height - height of the cylinder
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
     * Initializes the cylinder buffers
     */
    initBuffers() {


        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];



        var radiusDiff = (this.bottomRadius - this.topRadius);


        var ang = 2 * Math.PI / this.slices
        for (var j = 0; j <= this.stacks; j++) {
            for (var i = 0; i <= this.slices; i += 1) {
                this.vertices.push(
                    Math.sin(ang * i) * (this.bottomRadius - radiusDiff * (j / this.stacks)),
                    Math.cos(ang * i) * (this.bottomRadius - radiusDiff * (j / this.stacks)),
                    this.height * (j / this.stacks)
                );
                var usedToNormalize = Math.sqrt((Math.sin(2 * Math.PI * i / this.slices)*Math.sin(2 * Math.PI * i / this.slices))
                +Math.cos(2 * Math.PI * i / this.slices)*Math.cos(2 * Math.PI * i / this.slices)
                +radiusDiff / this.height*radiusDiff / this.height);

                this.normals.push(Math.sin(2 * Math.PI * i / this.slices)/usedToNormalize, Math.cos(2 * Math.PI * i / this.slices)/usedToNormalize, (radiusDiff / this.height)/usedToNormalize);
                
                this.texCoords.push(i / this.slices, j / this.stacks);

            }
        }



        for (var stack = 0; stack < this.stacks; stack++)
            for (var slice = 0; slice < this.slices; slice++) { //Reverse side so switching indices[2] with indices[1] so its counter clock-wise
                if (slice == this.slices-1) {
                    this.indices.push(stack * (this.slices+1) + slice, stack * (this.slices+1) + slice + 1, stack * (this.slices+1) + slice + 1 - (this.slices+1));
                    this.indices.push(stack * (this.slices+1) + slice, stack * (this.slices+1) + slice + (this.slices+1), stack * (this.slices+1) + slice + 1);
                    if(stack==this.stacks-1)
                        this.indices.push((stack+1) * (this.slices+1) + slice, (stack+1) * (this.slices+1) + slice + 1, (stack+1) * (this.slices+1) + slice + 1 - (this.slices+1));

                    
                } 
                else {
                    this.indices.push(stack * (this.slices+1) + slice, stack * (this.slices+1) + slice + 1 + (this.slices+1), stack * (this.slices+1) + slice + 1);
                    this.indices.push(stack * (this.slices+1) + slice, stack * (this.slices+1) + slice + (this.slices+1), stack * (this.slices+1) + slice + 1 + (this.slices+1));
                }
            }

        var centerIndex = this.vertices.length/3;


        //bottom cap
        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, -1);
        this.texCoords.push(0.5,0.5);

        var ang = 2 * Math.PI / this.slices;
        
        for (var i = 0; i <= this.slices; i += 1) {
            this.vertices.push(
                Math.sin(ang * i) * this.bottomRadius,
                Math.cos(ang * i) * this.bottomRadius,
                0
            );
            this.texCoords.push(Math.cos(ang * i) * 0.5 + 0.5, 1-(Math.sin(ang * i) * 0.5 + 0.5));
            
            this.normals.push(0, 0,-1);
        }


        for (var slice = 0; slice < this.slices; slice++) {
            this.indices.push(centerIndex+1+slice,centerIndex+2+slice,centerIndex);
        }


        //top cap

        centerIndex = this.vertices.length/3;


        this.vertices.push(0, 0, this.height);
        this.normals.push(0, 0, 1);
        this.texCoords.push(0.5,0.5);

        var ang = 2 * Math.PI / this.slices;
        
        for (var i = 0; i <= this.slices; i += 1) {
            this.vertices.push(
                Math.sin(ang * i) * this.topRadius,
                Math.cos(ang * i) * this.topRadius,
                this.height
            );
            this.texCoords.push(Math.cos(ang * i) * 0.5 + 0.5, 1-(Math.sin(ang * i) * 0.5 + 0.5));
            
            this.normals.push(0, 0, 1);
        }


        for (var slice = 0; slice < this.slices; slice++) {
            this.indices.push(centerIndex+1+slice,centerIndex,centerIndex+2+slice);
        }


        //this.enableNormalViz();

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    
    updateCoords(afs, aft)
    {
    }
}
