class bot {
    constructor(color,owner) {
        this.color=color;
        this.type='bot';
        this.model=undefined;
        this.prevstate=undefined;
        this.owner=owner;
        this.prevrow=-1;
        this.prevcolumn=-1;
        this.alpha=0.99;
        this.discount=0.75;
    }
    makeMove(state,owner,row=-1,column=-1) {
        this.owner=owner;
        row=state.length;
        column=state[0].length;
        if(!this.model)
            this.setup(state);
        //get move
        let actions=this.Q(state).arraySync()[0];
        this.filter(actions,state);
        let obj=this.getMax(actions);
        this.prevstate=state;
        this.prevrow=obj.row;
        this.prevcolumn=obj.column;
        return obj;
    }
    setup(state) {
        this.makeModel(state);
    }
    async save() {
        await this.model.save("localstorage://CR-"+this.owner);
    }
    async load() {
        this.model=await tf.loadLayersModel('localstorage://CR-'+this.owner);
        this.model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});
    }
    makeModel(state) {
        //shape is 
        //row,column,4
        //3 bits denote number
        //1 bit denote your own or not
        let row=state.length,column=state[0].length;
        let model=tf.sequential();
        model.add(tf.layers.reshape({targetShape:[row*column*5],inputShape:[row,column,5]}));
        model.add(tf.layers.dense({units:row*column,activation:'tanh'}));
        model.add(tf.layers.dense({units:row*column,activation:'tanh'}));
        model.add(tf.layers.dense({units:row*column,activation:'tanh'}));
        model.add(tf.layers.reshape({targetShape:[row,column]}));
        model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});
        this.model=model;
    }
    Q(state) {
        let inp=this.normalize(state); //get tensor4d [1,row,column,5]
        inp=tf.tensor4d([inp],[1,state.length,state[0].length,5]);
        let pred=this.model.predict(inp);
        return pred;
    }
    checkWin(state,b) {
        let R=0;
        if(b==-1)
            R=0;
        if(b==this.owner)
            R=2;
        else if(b!=this.owner)
            R=-1;
        let currQ=this.getMax(this.Q(state).arraySync()[0]).m; //max(q(s`,a)) for all a
        let peQ=this.Q(this.prevstate).arraySync()[0];//q(s,)
        let prevQ=peQ[this.prevrow][this.prevcolumn];
        let newQ=(1-this.alpha)*prevQ+this.alpha*(R+this.discount*currQ); //Q-learning equation
        console.log(prevQ+','+newQ);
        let inp=this.normalize(this.prevstate);
        peQ[this.prevrow][this.prevcolumn]=newQ;
        this.filter(peQ,this.prevstate); //remove invalid actions
        let oup=tf.tensor3d([peQ],[1,peQ.length,peQ[0].length]);
        inp=tf.tensor4d([inp],[1,inp.length,inp[0].length,inp[0][0].length]);
        this.model.fit(inp,oup,{epoch:10});
    }
    normalize(state) {
        let a=[];
        for(let i=0;i<state.length;i++) {
            let b=[];
            for(let j=0;j<state[0].length;j++) {
                //binary(number)+owned+empty length=5
                let empty=Number(state[i][j].owner==-1);
                let own=Number(this.owner==state[i][j].owner);
                let c=state[i][j].number.toString(2);
                if(c.length==1) {
                    c="00"+c;
                }
                if(c.length==2) {
                    c="0"+c;
                }
                c=c+own;
                c=c+empty;
                c=Array.from(c).map((val)=>{return Number(val);});
                b.push(c);
            }
            a.push(b);
        }
        return a;
    }
    getMax(arr) {
        let m=-10,ii=0,ij=0;
        for(let i=0;i<arr.length;i++) {
            for(let j=0;j<arr[0].length;j++) {
                if(arr[i][j]>m) {
                    ii=i;ij=j;m=arr[i][j];
                }
            }
        }
        return {row:ii,column:ij,m:m};
    }

    filter(arr,state) {
        for(let i=0;i<arr.length;i++) {
            for(let j=0;j<arr[0].length;j++) {
                if((state[i][j].owner==-1)||(state[i][j].owner==this.owner))
                    continue;
                else
                    arr[i][j]=-1;
            }
        }
        return arr;
    }
}