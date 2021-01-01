/**
 * MyTurnTimer
 * @constructor
 */
class MyTurnTimer extends CGFobject {
	constructor(scene, orchestrator) {
        super(scene);
        this.orchestrator = orchestrator;
        this.timer = new MyRectangle(scene,-0.5,-0.5,0.5,0.5);
        this.text = new MySpriteText(scene,"");

        this.screen = new CGFappearance(this.scene);
        this.screen.loadTexture('./scenes/images/messageScreen.png');
    }
    
    updateText(text){
        this.text.updateText(text);
    }

    timeisValid(){
        return parseInt(this.text.text) >= 0 && parseInt(this.text.text) <= 15;
    }

    display()
    {
        this.scene.pushMatrix();
        this.scene.translate(0.2,0,0);
        this.scene.scale(10,10,10);
        this.screen.apply();
        this.timer.display();
        this.scene.popMatrix();
        if(this.orchestrator.gameStarted && this.timeisValid() && this.orchestrator.gameMode != "4" ){
            this.scene.pushMatrix();
            this.scene.scale(2.5,2.5,2.5);
            this.text.display();
            this.scene.popMatrix();
        }
    }
}
