/**
 * MyOpenedBox
 * @constructor
 */
class MyOpenBox extends CGFobject {
    constructor(scene) {
        super(scene);
        this.quad = new MyRectangle(scene, -0.5, -0.5, 0.5, 0.5);
        this.quadRev = new MyRectangle(scene, 0.5, -0.5, -0.5, 0.5);
    }


    display() {
       
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
    }

    updateCoords() {}
}