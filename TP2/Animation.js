class Animation{
    /**
     * @method constructor
     * @param  {Array} keyframes - animation's keyframes
     */
    constructor(keyframes) {  
        this.keyFrames = [];
        for(let i = 0; i<keyframes.length; i++) 
            this.keyFrames.push(new AnimationKeyFrame(keyframes[i])); 
    }
  
  }
  