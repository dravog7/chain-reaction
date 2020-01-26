class environment {
    constructor(ps,side) {
        this.ps=ps;
        this.state=this.makeState(side,side);
        this.running=0;
        this.player=-1;
        this.winner=-1;
        this.setPlayer();this.setWinner();
        this.interval="";
    }
    reset() {
        clearInterval(this.interval);
        this.player=-1;
        this.running=0;
        this.winner=-1;
        this.state=this.makeState(this.state.length,this.state[0].length);
        this.interval="";
        this.setPlayer();this.setWinner();
    }
    run() {
        this.player=0;
        this.setPlayer();
        this.interval=setInterval(this.mover.bind(this),300);   
    }
    mover() {
        if((env.running==1)||(env.winner!=-1)||env.player==-1)
                return;
        else if(env.isBot())
        {
            let obj=this.ps[this.player].makeMove(this.state,this.player);
            let pl=this.player; //player changes after makeMove
            this.makeMove(obj.row,obj.column);
            this.ps[pl].checkWin(this.state,this.winner);
        }
    }
    isBot() {
        return this.ps[this.player].type!='player';
    }
    checkWinner() {
        let winner=-1;
        for(let i=0;i<this.state.length;i++) {
            for(let j=0;j<this.state[0].length;j++) {
                if(winner==-1)
                    winner=this.state[i][j].owner;
                else if((winner!=this.state[i][j].owner)&&(this.state[i][j].owner!=-1))
                    return -1;
            }
        }
        return winner;
    }
    setWinner() {
        let el=document.getElementById('winner');
        el.innerText=this.winner;
        if(this.player>-1)
        {
            wins[this.player]+=1;
            el.style.setProperty('color',this.ps[this.winner].color);
        }
            
        else
            el.style.removeProperty('color');
    }
    setPlayer() {
        let el=document.getElementById('pl');
        el.innerText=this.player;
        if(this.player>-1)
            el.style.setProperty('color',this.ps[this.player].color);
        else
            el.style.removeProperty('color')
    }
    makeState(row,column) {
        let state=[];
        for(let i=0;i<row;i++) {
            let arr=[];
            for(let j=0;j<column;j++) {
                arr.push({owner:-1,number:0});
            }
            state.push(arr);
        }
        return state;
    }
    setTable() {
        if(this.state) {
            let tds=document.getElementsByTagName('td');
            for(let i=0;i<this.state.length;i++) {
                for (let j=0;j<this.state[0].length;j++) {
                    let index=i*this.state.length+j;
                    let element=tds[index];
                    element.innerHTML=this.getElement(this.state[i][j]);
                }
            }
        }
    }
    getElement(el) {
        if((el.owner==-1)||(el.number==0))
            return "";
        let color=this.ps[el.owner].color;
        let number=el.number;
        return '<div class="cell" style="color:'+color+'">'+number+'</div>';
    }
    async makeMove(row,column) {
        this.running=1;
        if((this.state[row][column].owner==-1)||(this.state[row][column].owner==this.player)) {
        this.state[row][column].number+=1;
        this.state[row][column].owner=this.player;
        this.player=(this.player+1)%this.ps.length;
        this.setTable();
        await this.floodFill(row,column);
        this.setPlayer();
        }
        this.running=0;
    }
    getCell(row,column) {
        return this.state[row][column];
    }
    async floodFill(row,column) {
        //start checking from row,column for threshold
        //corners<2
        //edges<3
        //others<4
        let q=[{row,column,parent:""}];
        while(q.length>0) {
            let curr=q.splice(0,1)[0];
            let obj=this.getCell(curr.row,curr.column);
            let sides=this.getSides(curr);
            //check length of sides with number
            if(obj.number>=sides.length) {
                for(let i=0;i<sides.length;i++) {
                    this.state[sides[i].row][sides[i].column].number+=1;
                    this.state[sides[i].row][sides[i].column].owner=obj.owner;
                    obj.number-=1;
                }
            if(obj.number<=0)
                obj.owner=-1;
            q=q.concat(sides);
            await new Promise((res)=>{setTimeout(()=>{res();},500)});
            this.winner=this.checkWinner();
            if(this.winner!=-1) {
                this.setWinner();
                this.setTable();
                return;
            }
            }
            this.setTable();
        }
    }
    getSides(curr) {
        let row=curr.row,column=curr.column;
        let left,right,up,down;
        left={row:row-1,column:column,parent:curr};
        right={row:row+1,column:column,parent:curr};
        up={row:row,column:column-1,parent:curr};
        down={row:row,column:column+1,parent:curr};
        let sides = [left ,right,up,down];
        let passed=[];
        for(let i=0;i<4;i++) {
            if((sides[i].row<0)||(sides[i].row>=this.state.length)||(sides[i].column<0)||(sides[i].column>=this.state[0].length))
                continue;
            passed.push(sides[i]);
        }
        return passed;
    }
}