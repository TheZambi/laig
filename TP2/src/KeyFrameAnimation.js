class KeyFrameAnimation extends Animation {
    /**
     * @method constructor
     * @extends {Animation}
     * @param  {Array} keyframes - animation's keyframes
     */
    constructor(keyframes) {
        super(0,0);
        this.keyFrames = [];
        this.animationMatrix = mat4.create();
        this.lastUpdate = 0;
        this.totalTime = 0;
        this.currentKeyFrame = 0;
        for (let i = 0; i < keyframes.length; i++)
            this.keyFrames.push(new AnimationKeyFrame(keyframes[i]));
        this.keyFrames.sort(compareAnimations);

        this.endKeyFrame=this.keyFrames.length;

        this.lastTime = this.keyFrames[this.endKeyFrame-1].instant;
        
    }

    /**
     * @method apply
     * @param {CGFscene} scene - Reference to MyScene object
     * Applies the animation's current transformations
     */
    apply(scene) {
        scene.multMatrix(this.animationMatrix);
    }

    /**
     * @method update
     * @param {Integer} t - time after epoc
     * Updates time to possibilitate the animation's interpolation
     */
    update(t) {
        if (this.lastUpdate == 0) {
            this.lastUpdate = t;
        }
        this.interpolationTime = t - this.lastUpdate;
        this.totalTime += this.interpolationTime;
        this.totalSeconds = this.totalTime/1000;

        if(this.currentKeyFrame<this.endKeyFrame-1 && this.totalSeconds > this.keyFrames[this.currentKeyFrame+1].instant){
            this.totalTime = this.keyFrames[this.currentKeyFrame+1].instant*1000;
        }


        this.interpolateKeyframes();

        this.lastUpdate = t;
        if (this.currentKeyFrame + 1 < this.endKeyFrame && this.totalSeconds >= this.keyFrames[this.currentKeyFrame + 1].instant) {
            this.currentKeyFrame++;
        }
    }


    /**
     * @method interpolateKeyframes
     * Updates the animation's current transformations using interpolated time to not skip any frames
     */
    interpolateKeyframes() {
        var translations = [];
        var scales = [];
        var rotations = [];
        if (this.currentKeyFrame + 1 < this.endKeyFrame) {
            this.animationMatrix = mat4.create();
            var instant = this.keyFrames[this.currentKeyFrame + 1].instant - this.keyFrames[this.currentKeyFrame].instant;
            for (var i = 0; i < 3; i++) {
                if (this.totalSeconds >= this.keyFrames[this.currentKeyFrame].instant) {
                    var timePassed = (this.totalTime - this.keyFrames[this.currentKeyFrame].instant * 1000) / (instant * 1000);
                    //translations
                    var value = this.keyFrames[this.currentKeyFrame + 1].translation[i] - this.keyFrames[this.currentKeyFrame].translation[i];
                    translations.push(value * timePassed + this.keyFrames[this.currentKeyFrame].translation[i]);

                    //scales
                    value = this.keyFrames[this.currentKeyFrame + 1].scale[i] - this.keyFrames[this.currentKeyFrame].scale[i];
                    scales.push(value * timePassed + this.keyFrames[this.currentKeyFrame].scale[i])

                    //rotations
                    value = this.keyFrames[this.currentKeyFrame + 1].rotation[i] - this.keyFrames[this.currentKeyFrame].rotation[i];
                    rotations.push(value * timePassed + this.keyFrames[this.currentKeyFrame].rotation[i])
                }
            }
            mat4.translate(this.animationMatrix, this.animationMatrix, translations);
            mat4.rotateX(this.animationMatrix, this.animationMatrix, rotations[0] * DEGREE_TO_RAD);
            mat4.rotateY(this.animationMatrix, this.animationMatrix, rotations[1] * DEGREE_TO_RAD);
            mat4.rotateZ(this.animationMatrix, this.animationMatrix, rotations[2] * DEGREE_TO_RAD);
            mat4.scale(this.animationMatrix, this.animationMatrix, scales);
        }
    }


}



function compareAnimations(a, b) {
    return a.instant - b.instant;
}
