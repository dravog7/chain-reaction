class player {
    constructor(color) {
        this.color=color;
        this.type='player'
    }
    makeMove(state,owner,row=-1,column=-1) {
        return {row,column};
    }
}