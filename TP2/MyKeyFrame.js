class MyKeyFrame{
    /**
     * @method constructor
     * @param  {CGFscene} scene - MyScene object
     * @param  {Array} keyframes - values of the keyframes
     */
    constructor(scene, keyframes) {  
        super(scene);
        for(let i = 0;i<keyframes.length;i++)
        {
            if(keyframes[i][0]=="instant")
                this.instant = keyframes[i][1]
            if(keyframes[i][0]=="translation")
            {
                this.translation=[];
                this.translation.push(...keyframes[i].slice(1));
            }
            if(keyframes[i][0]=="scale")
            {
                this.scale=[];
                this.scale.push(...keyframes[i].slice(1));
            }
            if(keyframes[i][0]=="rotationX")
            {
                this.rotationX=keyframes[i][1];
            }
            if(keyframes[i][0]=="rotationY")
            {
                this.rotationY=keyframes[i][1];
            }
            if(keyframes[i][0]=="rotationZ")
            {
                this.rotationZ=keyframes[i][1];
            }
        }
        this.rotations=[this.rotationX,this.rotationY,this.rotationZ];
    }
  
    
  }
  