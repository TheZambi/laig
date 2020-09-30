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
        
        
        
        var radiusDiff = (this.bottomRadius-this.topRadius);


        var ang = 2 * Math.PI / this.slices
        for (var j = 0; j <= this.stacks; j++) {
            for (var i = 0; i < this.slices; i += 1) {
                this.vertices.push(
                                    Math.sin(ang * i)*(this.bottomRadius-radiusDiff*(j/this.stacks)),
                                    Math.cos(ang * i)*(this.bottomRadius-radiusDiff*(j/this.stacks)),
                                    this.height*(j/this.stacks)
                                   );
                this.normals.push(Math.sin(2 * Math.PI * i / this.slices), Math.cos(2 * Math.PI * i / this.slices), radiusDiff/this.height);
                this.texCoords.push((this.slices-i)/this.slices,(1-j)/this.stacks);
            }
        }

        this.enableNormalViz();
    
        for(var stack = 0; stack < this.stacks; stack++)
        for (var slice = 0; slice < this.slices; slice++) { //Reverse side so switching indices[2] with indices[1] so its counter clock-wise
            if (slice == this.slices - 1) {
              this.indices.push(stack*this.slices+slice, stack*this.slices+slice + 1, stack*this.slices+slice + 1 - this.slices);
              this.indices.push(stack*this.slices+slice, stack*this.slices+slice + this.slices, stack*this.slices+slice + 1);
            }
            else {
              this.indices.push(stack*this.slices+slice,stack*this.slices+ slice + 1 + this.slices, stack*this.slices+slice + 1);
              this.indices.push(stack*this.slices+slice,stack*this.slices+ slice + this.slices, stack*this.slices+slice + 1 + this.slices);
            }
          }

          this.vertices.push(0,0,0);
          this.vertices.push(0,0,this.height);
          for(var slice = 0; slice <= this.slices ; slice++)
          {
              this.indices(slice,slice+1,this.slices*(this.stacks+1));
          }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}