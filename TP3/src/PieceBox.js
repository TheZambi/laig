/**
 * PieceBox
 * @constructor
 */
class PieceBox extends CGFobject {
    constructor(scene, color, pieces) {
        super(scene);
        this.pieces = pieces;
        this.pieceColors = color;
        this.quad = new MyRectangle(scene, -0.5, -0.5, 0.5, 0.5);
        this.quadRev = new MyRectangle(scene, 0.5, -0.5, -0.5, 0.5);
    }


    display() {
        this.scene.pushMatrix();
        this.scene.scale(8,3,8);
        this.scene.pushMatrix();
        this.scene.translate(0,0,0.5);

        this.quad.display(); //Base
        this.quadRev.display(); //Base


        this.scene.pushMatrix();
        this.scene.rotate(Math.PI,0,0,1);
        this.scene.rotate(Math.PI,1,0,0);
        this.scene.translate(0,0,1);
        this.quad.display();
        this.quadRev.display();
        this.scene.popMatrix();

        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.5,0,0);
        this.scene.rotate(Math.PI/2, 0,1,0);
        
        this.quad.display();
        this.quadRev.display();
        
        this.scene.rotate(Math.PI,0,1,0);
        this.scene.translate(0,0,1);
        this.quad.display();
        this.quadRev.display();
        this.scene.popMatrix();
        

        this.scene.pushMatrix();
        this.scene.translate(0,-0.5,0);
        this.scene.rotate(Math.PI/2,1,0,0);
        
        this.quad.display();
        this.quadRev.display();

        this.scene.popMatrix();
        this.scene.popMatrix();


        this.displayPieces();
    }

    displayPieces() {
        this.scene.pushMatrix();
        for(let i = 0;i<this.pieces.length;i++){
            this.row = (i%7);
            this.column = (i%6);
            if(!this.pieces[i].tile){
                this.scene.pushMatrix();
                this.scene.translate(-3 + this.row,-1,-2.5 + this.column);
                this.pieces[i].display();
                this.scene.popMatrix();
            }
        }

        
        this.scene.popMatrix();
    }

    updateCoords() {}
}