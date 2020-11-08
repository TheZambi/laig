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
        this.defaultAppearance = new CGFappearance(this.scene);
        this.defaultAppearance.setTexture(this.scene.textSheet.texture);
        for(let i = 0;i< text.length;i++){
            this.textBox.push(new MyRectangle(this.scene, 0+i, 0, 1+i, 1));
        }
    }

    getCharacterPosition(character){
        return character.charCodeAt(0);
    }

    display(){
        this.scene.pushMatrix();

        this.scene.translate(-(this.text.length/2),-0.5,0);
        this.defaultAppearance.apply();
        this.scene.setActiveShader(this.scene.textSheet.shader);
    
        for(let i = 0;i<this.textBox.length;i++){
            this.scene.textSheet.activateCellP(this.getCharacterPosition(this.text[i]));
            this.textBox[i].display();
        }

        this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.popMatrix();
    }
}
