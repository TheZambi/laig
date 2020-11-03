class AnimationKeyFrame{
    /**
     * @method constructor
     * @param  {Array} keyframes - values of the keyframes
     */
    constructor(keyframes) {  
        for(let i = 0;i<keyframes.length;i++)
        {
            if(keyframes[i][0]=="instant")
                this.instant = keyframes[i][1];

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
        this.rotation=[this.rotationX,this.rotationY,this.rotationZ];

    }
  
    
  }
  