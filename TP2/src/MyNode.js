class MyNode {
    /**
     * @method constructor
     * @param  {CGFscene} scene - MyScene object
     * @param  {string} id - ID of the node
     * @param  {Array} info - array with info about this node (materials, transformations, descendants and textures) 
     */
    constructor(scene, id, info = []) {
        this.scene = scene;
        this.info = info;
        this.id = id;
        this.visited = false;
        this.children = [];
        this.childrenNames = [];
        this.leaves = [];
        this.texture = null;
        this.material = null;
        this.animation = null;
        this.textSprites = [];
        this.animSprites = [];

        this.initBuffers();
    }

    /**
     * @method initBuffers
     * Initializes the node buffers
     */
    initBuffers() {
        this.materialID = this.info[0];
        this.animationID = this.info[4];

        this.textureID = this.info[1][0];
        this.textureAFS = this.info[1][1];
        this.textureAFT = this.info[1][2];

        this.transformations = mat4.create();
        for (let i = 0; i < this.info[2].length; i++) {
            if (this.info[2][i][0] == "t") {
                mat4.translate(this.transformations, this.transformations, [this.info[2][i][1], this.info[2][i][2], this.info[2][i][3]]);
            } else if (this.info[2][i][0] == "r") {
                var auxVec;
                if (this.info[2][i][1] == "x") {
                    auxVec = vec3.fromValues(1, 0, 0);
                } else if (this.info[2][i][1] == "y") {
                    auxVec = vec3.fromValues(0, 1, 0);
                } else if (this.info[2][i][1] == "z") {
                    auxVec = vec3.fromValues(0, 0, 1);
                }
                mat4.rotate(this.transformations, this.transformations, DEGREE_TO_RAD * this.info[2][i][2], auxVec);
            } else if (this.info[2][i][0] == "s") {
                mat4.scale(this.transformations, this.transformations, [this.info[2][i][1], this.info[2][i][2], this.info[2][i][3]])
            }
        }
        for (let i = 0; i < this.info[3].length; i++) {
            if (this.info[3][i][0] == "node") {
                this.childrenNames.push(this.info[3][i][1]);
            } else if (this.info[3][i][0] == "leaf") {
                if (this.info[3][i][1] == "rectangle") {
                    this.leaves.push(new MyRectangle(this.scene, ...this.info[3][i].slice(2)));
                } else if (this.info[3][i][1] == "sphere") {
                    this.leaves.push(new MySphere(this.scene, ...this.info[3][i].slice(2)));
                } else if (this.info[3][i][1] == "torus") {
                    this.leaves.push(new MyTorus(this.scene,...this.info[3][i].slice(2)));
                } else if (this.info[3][i][1] == "triangle") {
                    this.leaves.push(new MyTriangle(this.scene, ...this.info[3][i].slice(2)));
                } else if (this.info[3][i][1] == "cylinder") {
                    this.leaves.push(new MyCylinder(this.scene, ...this.info[3][i].slice(2)));
                } else if (this.info[3][i][1] == "spritetext") {
                    this.textSprites.push(new MySpriteText(this.scene, ...this.info[3][i].slice(2)));
                } else if (this.info[3][i][1] == "spriteanim") {
                    this.animSprites.push(new MySpriteAnimation(this.scene, ...this.info[3][i].slice(2)));
                }
            }
        }
        if(this.id=="Floor")
            console.log(this);
    }

    /**
     * @method display
     * displays this node and its descendants
     */
    display() {
        
        this.scene.pushMatrix();
        
        this.scene.multMatrix(this.transformations);
        
        if(this.animation != null)
            this.animation.apply(this.scene);

        if (this.materialID != "null") {
            this.scene.matStack.push(this.material);
            this.material.apply();
            if(this.scene.texStack.length!=0 && this.textureID == "null")
                this.scene.texStack[this.scene.texStack.length-1].bind();
        }

        if (this.textureID != "null") {
            if(this.textureID!="clear"){
                this.scene.texStack.push(this.texture);
                this.texture.bind();
            }
            else if(this.scene.texStack.length != 0)
                this.scene.texStack[this.scene.texStack.length-1].unbind(); 
        }

        for (let i = 0; i < this.leaves.length; i++) {
            this.leaves[i].display();
        }
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].display();
        }

        if (this.materialID != "null") {
            this.scene.matStack.pop();
           
            this.scene.matStack[this.scene.matStack.length - 1].apply();
            if (this.scene.texStack.length != 0) {
                this.scene.texStack[this.scene.texStack.length - 1].bind();
            }
        }

        if (this.textureID != "null") {
            if(this.textureID!="clear"){
                this.scene.texStack.pop();
                if(this.scene.texStack.length == 0){
                    this.texture.unbind();
                }
                if (this.scene.texStack.length != 0) {
                    this.scene.texStack[this.scene.texStack.length - 1].bind();
                }
            }
            else
                if (this.scene.texStack.length != 0) {
                    this.scene.texStack[this.scene.texStack.length - 1].bind();
                }
        }



        this.scene.popMatrix();


    }

    /**
     * @method updateCoords
     * updates nodes' descendants texture coordinates
     */
    updateCoords()
    {
        for (let i = 0; i < this.leaves.length; i++) {
            this.leaves[i].updateCoords(this.textureAFS, this.textureAFT);
        }
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].updateCoords();
        }
    }
}