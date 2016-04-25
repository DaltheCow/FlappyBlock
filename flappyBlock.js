(function () {
    canvas = document.getElementById("screen");
    context = canvas.getContext('2d');
    context.font = "20px Verdana";
    var bird = {x:canvas.width/2 - 5, y:canvas.height/2 - 5, speed:0, gravity:5}
    var pipeArray = [], HoleT, Hole, interval, score = 0, scoresize;

    function pipeObj () {
        HoleT = 200;
        while (HoleT > 140 || HoleT < 25){
            Hole = Math.floor((30 + Math.random() * 170));
            HoleT = Math.abs(pipeArray[pipeArray.length-1].hole - Hole);
        }
        return {x:300,hole:Hole}
    }
    function spliceFront (array,size) {
        if (array.length > size) {
            array.splice(0,1);
            return spliceFront(array,size);
        }
        else
            return array;
    }
    function init() {
        birdCtrl();
        pipeArray.push({x:300,hole:115});
        setInterval(function() {
            pipeArray = spliceFront(pipeArray,3);
            pipeArray.push(pipeObj());
            score++;
        },1500);
    }

    function birdCtrl () {
        interval = setInterval(function() {
            bird.speed -= bird.gravity;
            bird.y -= bird.speed;
            if (bird.y > 300) {
                bird.y = 300;
            }
            else if (bird.y < 0) {
                bird.y = 0;
            }
            context.clearRect(0,0,300,300);
            pipe();
            SCORE();
            drawBird(angle());
            pipeArray.forEach(function(AE) {
                if(collisions(bird,AE)) {
                    endgame();
                }
            });
        },100);

        addEventListener('keypress',function(event) {
            if (event.charCode === 32) {
                bird.speed = 24;
            }
        });
    }

    function SCORE() {
        scoretime = 11;
        if (score >= 10)
            scoretime += 13;
        if (score >= 100)
            scoretime += 13;
        context.clearRect(151,268,scoretime,19);
        context.fillText(score,150,285);
    }

    function endgame() {
        clearInterval(interval);
    }

    function pipe() {
        pipeArray.forEach(function(AE) {
            AE.x-=10;
            drawPipe(AE.x,AE.hole);
        });
    }

    function drawPipe(x,hole) {
        context.fillRect(x,0,30,300);
        context.clearRect(x,hole,30,70);
    }
//for collisions, check if bird block is in the segment of pipe from 0->hole and from x->x+30
//and also from hole+60->300
    function collisions(bird,pipe) {
        //I added in the extra 5's to see if it would make it look a tad closer to a legit collision
        if (bird.x >= pipe.x && bird.x <= pipe.x+30 && (bird.y <= pipe.hole || bird.y >= pipe.hole+70-14))
            return true;
        else
            return false;
    }

    function drawBird(rad) {
        context.translate(bird.x+5, bird.y+5);
        context.rotate(rad);
        context.fillRect(-10,-5,20,10);
        context.rotate(-rad);
        context.translate(-1*(bird.x+5),-1*(bird.y+5));
    }

    function angle() {
        if (bird.speed > 0) {
            if (bird.speed > 20)
                return -4 * Math.PI/9;
            else
                return -Math.PI/45 * bird.speed;
        }
        else if (bird.speed === 0)
            return 0;
        else {
            if (bird.speed < -15)
                return 4 * Math.PI/9;
            else
                return -4 * Math.PI/135 * bird.speed;
        }
    }

    init();
})();