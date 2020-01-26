<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>chain reaction</title>
    <link rel='stylesheet' href='style.css'/>
</head>
<body>
    <div id='header'>
        <h1>Player:<b id='pl'>-1</b>,winner:<b id='winner'>-1</b></h1>
        <button id='reset'>RESET!</button>
    </div>
    <script src='environment.js'></script>
    <script src='player.js'></script>
    <script src='bot.js'></script>
    <script src='bot2.js'></script>
    <script>
        function createTable(n) {
            let table=document.createElement('table');
            table.addEventListener('click',add);
            for(let i=0;i<n;i++) {
                let tr= document.createElement('tr');
                for(let j=0;j<n;j++) {
                    let td=document.createElement('td');
                    td.setAttribute('row',i);
                    td.setAttribute('col',j);
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
            document.body.appendChild(table);
        }
        document.getElementById('reset').addEventListener('click',startGame);
        window.addEventListener('load',()=>{
            let side=Number(prompt("enter dimension!",2));
            createTable(side);
            window.sideLength=side;
            startGame();
        });
        function add(e) {
            if((env.running==1)||(env.winner!=-1)||env.player==-1||env.isBot())
                return;
            let el=closest(e.path,'TD')
            let row=Number(el.getAttribute('row'));
            let col=Number(el.getAttribute('col'));
            console.log(row+","+col);
            env.makeMove(row,col);
        }
        function closest(path,tag) {
            for(let i=0;i<path.length;i++)
                if(path[i].tagName==tag)
                    return path[i];
        }
        function startGame() {
            if(!window.env) {
                let players=[new player('#ff0000'),new bot('#0000ff')];
                window.env=new environment(players,window.sideLength);
                window.env.setTable();
                window.env.run();
            }
            else {
                window.env.reset();
                window.env.setTable();
                window.env.run();
            }
            
        }
    </script>
</body>
</html>