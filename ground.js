class Ground {
    constructor(x,y,w,h){
        var options = {
            isStatic:true
        };

        this.w = w;
        this.h = h;
        this.body = Bodies.rectangle(x,y,w,h, options);
        Composite.add(world,this.body);
    }

    display(){
        var position = this.body.position;

        push();
        rectMode(CENTER);
        noStroke();
        fill(148,127,146);
        rect(position.x,position.y,this.w,this.h);
        pop();
    }
}