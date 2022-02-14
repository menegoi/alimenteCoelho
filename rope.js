class Rope {

    constructor(nlink, pointA){

        this.nlink = nlink;
        this.pointA = pointA;

        const group = Body.nextGroup(true);
        const rects = Composites.stack(100, 100,this.nlink, 1,5, 5,
             //Função Callback
             function(x, y) {
      
                return Bodies.rectangle(x, y, 30, 5, { collisionFilter: { group: group } });
            }
        );
      
  
        this.body = Composites.chain(rects, 0.1, 0, -0.6, 0, {stiffness: 0.1, length: 0.1, render: {type: 'line'}});
      
        Composite.add(world, this.body);
  

      
        Composite.add(rects, Constraint.create({
            pointA: this.pointA,
            bodyB: rects.bodies[0],
            pointB: {x: -25, y: 0},
            length:10,
            stiffness: 0.1
            })
        );
      
    }

    break(){ 
      this.body = null;
    }
    
   display(){
      if(this.body!=null){

          for (var i = 0; i < this.body.bodies.length-1; i++){
              this.drawVertices(this.body.bodies[i].vertices);
            }
        }
    }
    
    drawVertices(vertices){
      
        beginShape();
        fill('#FFF717')
        noStroke();
      
      for (var i = 0; i < vertices.length; i++){
          vertex(vertices[i].x, vertices[i].y);
        }

        endShape(CLOSE);
   }

   showConstraints(constraints){
        
        if(constraints!=null){
            for (var i = 0; i < constraints.length; i++) {
              this.drawConstraint(constraints[i]);
            }
        }
    }
  
  drawConstraint(constraint){
    
    if(constraint!=null){

        const offsetA = constraint.pointA;
        var posA = {x:0, y:0};

        const offsetB = constraint.pointB;
        var posB = {x:0, y:0};

        if (constraint.bodyA) {
          posA = constraint.bodyA.position;
        }

        if (constraint.bodyB) {
          posB = constraint.bodyB.position;
        }

        //Criar linha pontilhada
        push()
        strokeWeight(4);
        stroke(255);
        line(posA.x + offsetA.x, posA.y + offsetA.y,posB.x + offsetB.x,posB.y + offsetB.y);
        pop();                  
      }
  }
  
    


}