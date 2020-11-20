class Animation {
    /**
     * @abstract
     * @method constructor
     * @param  {Array} keyframes - animation's keyframes
     */
    constructor(currentKeyFrame,endKeyFrame) {
        if (this.constructor == Animation) {
            throw new Error("Abstract classes can't be instantiated.");
          }
        this.currentKeyFrame = currentKeyFrame;
        this.endKeyFrame=endKeyFrame;
    }

    apply(scene)
    {
        throw new Error("Method apply must be instantiated")
    }
    update(t)
    {
        throw new Error("Method update must be instantiated")
    }
}

    