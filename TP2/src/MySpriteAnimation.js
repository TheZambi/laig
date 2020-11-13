class MySpriteAnimation {
    /**
     * @method constructor
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

    updateNSteps()
    {
        if(this.nSteps<0)
        {
            this.nSteps = this.spriteSheet.sizeM*this.spriteSheet.sizeN-(this.startCell-this.endCell);
        }
    }


    update(t)
    {
        if(this.lastTime==0){
            this.lastTime = t;
            return;
        }
        if(t-this.lastTime>=(this.duration*1000/this.nSteps))
        {  
            this.lastTime=t;
            if(this.currentCell < this.spriteSheet.sizeM*this.spriteSheet.sizeN-1)
                this.currentCell++;
            else
                this.currentCell=0;

            if(this.currentCell==this.endCell+1)
                this.currentCell = this.startCell;
        }
    }

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
