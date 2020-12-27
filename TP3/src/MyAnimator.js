/**
 * MyAnimator
 * @constructor
 */
class MyAnimator {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.moveSequence = [];
        this.animationSequence = [];
    }

    addMoveToSequence(move) {
        this.moveSequence.push(move);
        console.log(this.moveSequence);
        //CREATE NEW ANIMATION
    }

    display() {
        for (let i = 0; i < this.moveSequence.length; i++) {
            this.orchestrator.scene.pushMatrix();

            // //centers the board
            // this.orchestrator.scene.translate(-9, 0, 9.5);
            // this.scene.rotate(-Math.PI / 2, 1, 0, 0);

            // this.orchestrator.scene.translate(...this.moveSequence[i].tile.translation);

                       
            this.orchestrator.scene.translate(...this.moveSequence[i].piece.translation);

            this.moveSequence[i].piece.display();
            this.orchestrator.scene.popMatrix();
        }
    }


}

