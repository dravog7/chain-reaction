class bot2 {
    constructor(color) {
        this.color=color;
        this.type='bot';
    }
    makeMove(state,owner,row=-1,column=-1) {
        return {row:2,column:2};
    }
}