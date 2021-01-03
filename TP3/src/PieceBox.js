/**
 * PieceBox
 * @constructor
 */
class PieceBox extends CGFobject {
    constructor(scene, color, pieces) {
        super(scene);
        this.pieces = pieces;
        this.pieceColors = color;
        this.box = new MyOpenBox(scene);
    }


    display() {
        this.scene.pushMatrix();
        this.scene.scale(8,3,8);
        this.box.display();
        this.scene.popMatrix();
        this.displayPieces();
    }

    //displays the unused pieces
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
}