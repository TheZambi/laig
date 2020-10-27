class MyAnimation{
    /**
     * @method constructor
     * @param  {CGFscene} scene - MyScene object
     * @param  {Array} keyframes - animation's keyframes
     */
    constructor(scene, keyframes) {  
        super(scene);
        this.keyFrames = [];
        for(let i = 0; i<keyframes.length; i++) 
            // this.keyFrames.push(new MyKeyFrame(scene,keyframes[i])); 
        this.initBuffers();
    }
  
    /**
     * @method initBuffers
     * Initializes the animation transformations
     */
    initBuffers() {
    }
  }
  