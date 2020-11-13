class KeyFrameAnimation extends Animation {
    /**
     * @method constructor
     * @extends {Animation}
     * @param  {Array} keyframes - animation's keyframes
     */
    constructor(keyframes) {
        super();
        this.keyFrames = [];
        this.animationMatrix = mat4.create();
        this.lastUpdate = 0;
        this.totalTime = 0;
        this.currentKeyFrame = 0;
        for (let i = 0; i < keyframes.length; i++)
            this.keyFrames.push(new AnimationKeyFrame(keyframes[i]));
        this.keyFrames.sort(compareAnimations);

        this.lastTime = this.keyFrames[this.keyFrames.length-1].instant;
        
    }

    apply(scene) {
        scene.multMatrix(this.animationMatrix);
    }

    update(t) {
        if (this.lastUpdate == 0) {
            this.lastUpdate = t;
        }
        this.interpolationTime = t - this.lastUpdate;
        this.totalTime += this.interpolationTime;

        if(this.totalTime/1000 > this.lastTime){
            this.totalTime = this.lastTime*1000;
        }

        this.interpolateKeyframes();

        this.lastUpdate = t;
        if (this.currentKeyFrame + 1 < this.keyFrames.length && this.totalTime / 1000 >= this.keyFrames[this.currentKeyFrame + 1].instant) {
            this.currentKeyFrame++;
        }
    }

    interpolateKeyframes() {
        var translations = [];
        var scales = [];
        var rotations = [];
        if (this.currentKeyFrame + 1 < this.keyFrames.length) {
            this.animationMatrix = mat4.create();
            var instant = this.keyFrames[this.currentKeyFrame + 1].instant - this.keyFrames[this.currentKeyFrame].instant;
            for (var i = 0; i < 3; i++) {
                if (this.totalTime / 1000 >= this.keyFrames[this.currentKeyFrame].instant) {
                    //translations
                    var value = this.keyFrames[this.currentKeyFrame + 1].translation[i] - this.keyFrames[this.currentKeyFrame].translation[i];
                    translations.push(value * (this.totalTime - this.keyFrames[this.currentKeyFrame].instant * 1000) / (instant * 1000) + this.keyFrames[this.currentKeyFrame].translation[i]);

                    //scales
                    value = this.keyFrames[this.currentKeyFrame + 1].scale[i] - this.keyFrames[this.currentKeyFrame].scale[i];
                    scales.push(value * (this.totalTime - this.keyFrames[this.currentKeyFrame].instant * 1000) / (instant * 1000) + this.keyFrames[this.currentKeyFrame].scale[i])

                    //rotations
                    value = this.keyFrames[this.currentKeyFrame + 1].rotation[i] - this.keyFrames[this.currentKeyFrame].rotation[i];
                    rotations.push(value * (this.totalTime - this.keyFrames[this.currentKeyFrame].instant * 1000) / (instant * 1000) + this.keyFrames[this.currentKeyFrame].rotation[i])
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
