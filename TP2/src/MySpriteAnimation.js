class MySpriteAnimation {
    /**
     * @method constructor
     * @param {CGFscene} scene - Reference to MyScene object
     * @param {Integer} spriteSheetID - id of the animation's spritesheet
     * @param {Integer} duration - total duration of the animation
     * @param {Integer} startCell - starting cell of the animation
     * @param {Integer} endCell - end cell of the animation
     * 
     */
    constructor(scene, spriteSheetID, duration, startCell, endCell) {
        this.scene = scene;
        this.spriteSheetID = spriteSheetID;
        this.spriteSheet = null;
        this.duration = duration;
        this.startCell = startCell;
        this.endCell = endCell;
        this.currentCell=startCell;
        this.lastTime=0;
        this.nSteps=endCell-startCell;
        this.animBox = new MyRectangle(this.scene, 0, 0, 1, 1);
        this.defaultAppearance = new CGFappearance(this.scene);
        
    }

    /**
     * @method updateNSteps
     * Updates the animation's current transformations using interpolated time to not skip any frames
     */
    updateNSteps()
    {
        if(this.nSteps<0)
        {
            this.nSteps = this.spriteSheet.sizeM*this.spriteSheet.sizeN-(this.startCell-this.endCell);
        }
        this.lastCell = this.spriteSheet.sizeM*this.spriteSheet.sizeN-1;
    }

    /**
     * @method update
     * @param {Integer} t - time after epoc
     * Updates the animation's current cell
     */
    update(t)
    {
        if(this.lastTime==0){
            this.lastTime = t;
            return;
        }
        if(t-this.lastTime>=(this.duration*1000/this.nSteps))
        {  
            this.lastTime=t;
            if(this.currentCell <= this.lastCell)
                this.currentCell++;
            else
                this.currentCell=0;

            if(this.currentCell==this.endCell+1)
                this.currentCell = this.startCell;
        }
    }

    /**
     * @method display
     * Displays the animation's current cell
     */
    display(){
        this.scene.pushMatrix();
        

        this.defaultAppearance.apply();
        this.spriteSheet.texture.bind();

        this.scene.setActiveShader(this.spriteSheet.shader);
    
        this.spriteSheet.activateCellP(this.currentCell);
        this.animBox.display();

        this.scene.setActiveShader(this.scene.defaultShader);
        this.spriteSheet.texture.unbind();

        this.scene.popMatrix();
    }
}
