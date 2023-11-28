
let ds;

function setup() {
  createCanvas(710, 400);

  // Parameters that the user can modify
  let startLength = 460.0;
  let theta = TWO_PI / 6; // 6, 10 
  let generations = 5; // Number of generations 1-6
  let rules = {
    W: "YF++ZF----XF[-YF----WF]++",
    X: "+YF--ZF[---WF--XF]+",
    Y: "-WF++XF[+++YF++ZF]-",
    Z: "--YF++++WF[+ZF++++XF]--XF"
  };

  let newRules = randomizeRules(rules);
  console.log(newRules);
  let repeats = 1; // Control for repeats in render()
  let bgColor = (0, 22, 21); // Background color
  let strokeColor = [255, 60]; // Stroke color

  ds = new PenroseLSystem(startLength, theta, generations, newRules, repeats, bgColor, strokeColor);
  ds.simulate(generations);
}

function draw() {
  background(ds.bgColor);
  ds.render();
}

function randomizeRules(rules) {
  let symbols = ['F', '+', '-', 'X', 'Y', 'Z', 'W']; // Removed brackets from the list
  let modifiedRules = {};

  for (let key in rules) {
    let rule = rules[key];
    let newRule = '';

    for (let i = 0; i < rule.length; i++) {
      let currentChar = rule[i];
      
      // Check if the current character is a bracket
      if (currentChar === '[' || currentChar === ']') {
        newRule += currentChar; // Keep the bracket unchanged
      } else {
        // Randomly decide whether to modify this character
        if (random() < 0.1) { // 10% chance to modify the character
          newRule += random(symbols); // Replace with a random symbol
        } else {
          newRule += currentChar;
        }
      }
    }

    modifiedRules[key] = newRule;
  }

  return modifiedRules;
}


function PenroseLSystem(startLength, theta, generations, rules, repeats, bgColor, strokeColor) {
    this.steps = 0;
    this.axiom = "[X]++[X]++[X]++[X]++[X]";
    this.ruleW = rules.W;
    this.ruleX = rules.X;
    this.ruleY = rules.Y;
    this.ruleZ = rules.Z;
    this.startLength = startLength;
    this.theta = theta;
    this.generations = generations;
    this.repeats = repeats;
    this.bgColor = bgColor;
    this.strokeColor = strokeColor;
    this.reset();
}

PenroseLSystem.prototype.simulate = function (gen) {
  while (this.getAge() < gen) {
    this.iterate(this.production);
  }
}

PenroseLSystem.prototype.reset = function () {
    this.production = this.axiom;
    this.drawLength = this.startLength;
    this.generations = 0;
  }

PenroseLSystem.prototype.getAge = function () {
    return this.generations;
  }

//apply substitution rules to create new iteration of production string
PenroseLSystem.prototype.iterate = function() {
    let newProduction = "";

    for(let i=0; i < this.production.length; ++i) {
      let step = this.production.charAt(i);
      //if current character is 'W', replace current character
      //by corresponding rule
      if (step == 'W') {
        newProduction = newProduction + this.ruleW;
      }
      else if (step == 'X') {
        newProduction = newProduction + this.ruleX;
      }
      else if (step == 'Y') {
        newProduction = newProduction + this.ruleY;
      }
      else if (step == 'Z') {
        newProduction = newProduction + this.ruleZ;
      }
      else {
        //drop all 'F' characters, don't touch other
        //characters (i.e. '+', '-', '[', ']'
        if (step != 'F') {
          newProduction = newProduction + step;
        }
      }
    }

    this.drawLength = this.drawLength * 0.5;
    this.generations++;
    this.production = newProduction;
}

//convert production string to a turtle graphic
PenroseLSystem.prototype.render = function () {
    translate(width / 2, height / 2);
    this.steps += 200;
    if(this.steps > this.production.length) {
      this.steps = this.production.length;
    }

    for(let i = 0; i < this.steps; ++i) {
      let step = this.production.charAt(i);
      if( step == 'F') {
        stroke(this.strokeColor[0], this.strokeColor[1]);
        for(let j = 0; j < this.repeats; j++) {
          line(0, 0, 0, -this.drawLength);
          noFill();
          translate(0, -this.drawLength);
        }
        this.repeats = 1;
      }
      else if (step == '+') {
        rotate(this.theta);
      }
      else if (step == '-') {
        rotate(-this.theta);
      }
      else if (step == '[') {
        push();
      }
      else if (step == ']') {
        pop();
      }
    }
  }


