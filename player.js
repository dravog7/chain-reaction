class player {
    constructor(color,owner) {
        this.color=color;
        this.type='player'
    }
    makeMove(state,owner,row=-1,column=-1) {
        return {row,column};
    }
}