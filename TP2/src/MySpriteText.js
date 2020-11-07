class MySpriteText {
    /**
     * @method constructor
     * @param scene Reference to MyScene object
     * @param text text to be displayed
     */
    constructor(scene, text) {
        this.scene = scene;
        this.text = text;
        this.textBox = [];
        for(let i = 0;i< text.length;i++){
            this.textBox.push(new MyRectangle(this.scene,0+i,0,1+i,1));
        }
        console.log(this.textBox);
    }

    getCharacterPosition(character){
        return [character%this.scene.textSheet.sizeM,Math.floor(character/this.scene.textSheet.sizeN)];
    }
}
