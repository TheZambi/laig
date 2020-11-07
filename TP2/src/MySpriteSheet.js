class MySpriteSheet {
    /**
     * @method constructor
     * @param texture spriteSheet texture
     * @param sizeM spriteSheet length
     * @param sizeN spriteSheet height
     */
    constructor(scene,texture, sizeM, sizeN) {
        this.scene = scene;
        this.texture = texture;
        this.sizeM = sizeM;
        this.sizeN = sizeN;
        this.shader = new CGFshader(this.scene.gl,"./scenes/shaders/sprite.vert","./scenes/shaders/sprite.frag");
        this.shader.setUniformsValues({sizeN:this.sizeN});
        this.shader.setUniformsValues({sizeM:this.sizeM});
    }

    activateCellMN(m, n){
        this.shader.setUniformsValues({n:n});
        this.shader.setUniformsValues({m:m});
    }

    activateCellP(p){
        this.shader.setUniformsValues({n:Math.floor(p/this.sizeN)});
        this.shader.setUniformsValues({m:p%this.sizeM});
    }
}