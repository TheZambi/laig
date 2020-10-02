class MyNode {
	constructor(scene,id,info = []) {
        this.scene = scene;
        this.info = info;
        this.id = id;
        this.info = info;
        this.visited = false;
        this.children = [];
        this.childrenNames = [];
        this.leaves = [];

    
		this.initBuffers();
    }

    initBuffers(){
        this.materialID = this.info[0];

        this.textureID = this.info[1][0];
        this.textureAFS = this.info[1][1];
        this.textureAFT = this.info[1][2];

        this.transformations = mat4.create();
        for(let i = 0;i< this.info[2].length;i++){
            if(this.info[2][i][0] == "t"){
                mat4.translate(this.transformations,this.transformations,[this.info[2][i][1],this.info[2][i][2],this.info[2][i][3]]);
            }
            else if(this.info[2][i][0] == "r"){
                var auxVec;
                if(this.info[2][i][1] == "x")
                {
                    auxVec = vec3.fromValues(1,0,0);
                }
                else if(this.info[2][i][1] == "y"){
                    auxVec = vec3.fromValues(0,1,0);
                }
                else if(this.info[2][i][1]== "z"){
                    auxVec = vec3.fromValues(0,0,1);
                }
                mat4.rotate(this.transformations,this.transformations,DEGREE_TO_RAD * this.info[2][i][2],auxVec);
            }
            else if(this.info[2][i][0] == "s"){
                mat4.scale(this.transformations,this.transformations,[this.info[2][i][1],this.info[2][i][2],this.info[2][i][3]])
            }
        }
        for(let i = 0;i< this.info[3].length;i++){
            if(this.info[3][i][0] == "node"){
                this.childrenNames.push(this.info[3][i][1]);
            }
            else if(this.info[3][i][0] == "leaf"){
                if(this.info[3][i][1] == "rectangle"){
                    this.leaves.push(new MyRectangle(this.scene,...this.info[3][i].slice(2)));
                }
                else if(this.info[3][i][1] == "sphere"){
                    this.leaves.push(new MySphere(this.scene,...this.info[3][i].slice(2)));
                }
                else if(this.info[3][i][1] == "torus"){
                    this.leaves.push(new MyTorus(this.scene,...this.info[3][i].slice(2)));
                }
                else if(this.info[3][i][1] == "triangle"){
                    this.leaves.push(new MyTriangle(this.scene,...this.info[3][i].slice(2)));
                }
                else if(this.info[3][i][1] == "cylinder"){
                    this.leaves.push(new MyCylinder(this.scene,...this.info[3][i].slice(2)));
                }
            }
        }

        /*console.log(this.materialID);

        console.log(this.textureID);
        console.log(this.textureAFS);
        console.log(this.textureAFT);

        console.log(this.transformations);

        console.log(this.childrenNames);*/
    }

    display(){
        this.scene.pushMatrix();

        this.scene.multMatrix(this.transformations);

        for(let i = 0;i< this.children.length;i++){
            this.children[i].display();
        }
        for(let i = 0;i< this.leaves.length;i++){
            console.log(this.id,this.leaves);
            this.leaves[i].display();
        }

        this.scene.popMatrix();
    }
}