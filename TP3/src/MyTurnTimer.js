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
        this.box = new MyOpenBox(scene);
        this.tvCylinder = new MyCylinder(scene,20,10,1,1,8);
        this.helperText = new MySpriteText(scene,"Winner:");

        this.screen = new CGFappearance(this.scene);
        this.screen.loadTexture('./scenes/images/messageScreen.png');

        this.blackSides = new CGFappearance(this.scene);
        this.blackSides.loadTexture('./scenes/images/cabinRoof.png');
    }
    
    updateText(text){
        this.text.updateText(text);
    }

    timeisValid(){
        var max = this.orchestrator.turnTimers.reduce(function(a,b){
            return Math.max(a,b);
        })
        return parseInt(this.text.text) >= 0 && parseInt(this.text.text) <= max;
    }

    display()
    {
        this.blackSides.apply();
        this.scene.pushMatrix();
        this.scene.translate(0,-3,-5);
        this.scene.rotate(Math.PI/2,1,0,0);
        this.tvCylinder.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
        this.scene.translate(0.2,0,0);
        this.scene.scale(10,10,10);
        this.scene.pushMatrix();
        this.scene.translate(0,0,-0.5);
        this.scene.rotate(Math.PI/2,1,0,0);
        this.box.display();
        this.scene.popMatrix();
        this.screen.apply();
        this.timer.display();
        this.scene.popMatrix();
        if(this.orchestrator.gameStarted && this.timeisValid() && this.orchestrator.gameMode != "4" ){
            this.scene.pushMatrix();
            this.scene.scale(2.5,2.5,2.5);
            this.text.display();
            this.scene.popMatrix();
        }
        else if(!this.orchestrator.gameStarted && this.orchestrator.winner != -1){
            this.scene.pushMatrix();
            this.scene.translate(0.2,0,0);
            this.scene.pushMatrix();
            this.scene.translate(0,2.5,0);
            this.helperText.display();
            this.scene.popMatrix();
            this.text.display();
            this.scene.popMatrix();
        }
    }
}
