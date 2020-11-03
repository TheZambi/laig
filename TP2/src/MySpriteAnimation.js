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
    }

}
