/**
 * MyTurnTimer
 * @constructor
 */
class MyTurnTimer extends CGFobject {
	constructor(scene, orchestrator) {
        super(scene);
        this.orchestrator = orchestrator;
        this.timer = new MyRectangle(scene,-0.5,-0.5,0.5,0.5);
        this.text = new MySpriteText(scene,""); //used to display time left
        this.box = new MyOpenBox(scene);
        this.tvCylinder = new MyCylinder(scene,20,10,1,1,8);
        this.helperText = new MySpriteText(scene,"Winner:"); // to use when displaying winner
        this.turnPlayer = new MySpriteText(scene,"");// to use when displaying turn's player

        this.screen = new CGFappearance(this.scene);
        this.screen.loadTexture('./scenes/images/messageScreen.png');

        this.blackSides = new CGFappearance(this.scene);
        this.blackSides.loadTexture('./scenes/images/cabinRoof.png');
    }
    
    updateText(text){ //updates text's text
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
        // displays box to serve as a display screen
        this.blackSides.apply();

        this.scene.pushMatrix();
        this.scene.translate(0,-3,-5);
        this.scene.rotate(Math.PI/2,1,0,0);
        this.tvCylinder.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.5,0,0);
        this.scene.scale(10,10,10);

        this.scene.pushMatrix();
        this.scene.translate(0,0,-0.5);
        this.scene.rotate(Math.PI/2,1,0,0);
        this.box.display();
        this.scene.popMatrix();
        
        this.screen.apply();
        this.timer.display();
        this.scene.popMatrix();

        if(this.orchestrator.gameStarted && this.timeisValid() && this.orchestrator.gameMode != "4" ){ //displays turn's player and time left
            this.scene.pushMatrix();
            this.scene.translate(0.5,0.1,0.1);
            this.turnPlayer.updateText("Player:" + (this.orchestrator.currentPlayer+1));
            this.scene.pushMatrix();
            this.scene.translate(0.1,2.5,0.1);
            this.turnPlayer.display();
            this.scene.popMatrix();
            this.scene.scale(2.5,2.5,2.5);
            this.text.display();
            this.scene.popMatrix();
        }
        else if(!this.orchestrator.gameStarted && this.orchestrator.winner != -1){ //displays winner
            this.scene.pushMatrix();
            this.scene.translate(0.2,0,0.1);
            this.scene.pushMatrix();
            this.scene.translate(0.1,2.5,0.1);
            this.helperText.display();
            this.scene.popMatrix();
            this.text.display();
            this.scene.popMatrix();
        }
    }
}
