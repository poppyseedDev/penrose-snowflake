
import React from 'react';
import { ReactP5Wrapper } from "react-p5-wrapper";

function PenroseSnowflakeSketch(p5) {
   let ds;

   p5.setup = () => {
    p5.createCanvas(710, 400);

    // Parameters that the user can modify
    let startLength = 460.0;
    let theta = p5.TWO_PI / 10; // Adjusted for p5 instance mode
    let generations = 5; // Number of generations 1-6
    let rules = {
      W: "YF++ZF----XF[-YF----WF]++",
      X: "+YF--ZF[---WF--XF]+",
      Y: "-WF++XF[+++YF++ZF]-",
      Z: "--YF++++WF[+ZF++++XF]--XF"
    };

    let newRules = randomizeRules(p5, rules);
    console.log(newRules);
    let repeats = 1; // Control for repeats in render()
    let bgColor = [0, 22, 21]; // Adjusted to array for p5
    let strokeColor = [255, 60]; // Stroke color

    ds = new PenroseLSystem(p5, startLength, theta, generations, newRules, repeats, bgColor, strokeColor);
    ds.simulate(generations);
    
    return () => {
        p5.createCanvas(600, 400, p5.WEBGL);
      };
  };

  p5.draw = () => {
    p5.background(ds.bgColor[0], ds.bgColor[1], ds.bgColor[2]);
    ds.render(p5);
  };

function randomizeRules(p5, rules) {
    let symbols = ['F', '+', '-', 'X', 'Y', 'Z', 'W'];
    let modifiedRules = {};
  
    for (let key in rules) {
      let rule = rules[key];
      let newRule = '';
  
      for (let i = 0; i < rule.length; i++) {
        let currentChar = rule[i];
        if (currentChar === '[' || currentChar === ']') {
          newRule += currentChar;
        } else if (p5.random() < 0.1) {
          newRule += p5.random(symbols);
        } else {
          newRule += currentChar;
        }
      }
  
      modifiedRules[key] = newRule;
    }
  
    return modifiedRules;
  }
  
  function PenroseLSystem(p5, startLength, theta, generations, rules, repeats, bgColor, strokeColor) {
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

PenroseLSystem.prototype.render = function (p5) {
    p5.translate(p5.width / 2, p5.height / 2);

    if (typeof this.steps === 'undefined') {
        this.steps = 0; // Initialize steps if not already initialized
    }
    this.steps += 200;
    if(this.steps > this.production.length) {
        this.steps = this.production.length;
    }

    for(let i = 0; i < this.steps; ++i) {
        let step = this.production.charAt(i);
        if(step == 'F') {
            p5.stroke(this.strokeColor[0], this.strokeColor[1]);
            for(let j = 0; j < this.repeats; j++) {
                p5.line(0, 0, 0, -this.drawLength);
                p5.noFill();
                p5.translate(0, -this.drawLength);
            }
            this.repeats = 1;
        }
        else if(step == '+') {
            p5.rotate(this.theta);
        }
        else if(step == '-') {
            p5.rotate(-this.theta);
        }
        else if(step == '[') {
            p5.push();
        }
        else if(step == ']') {
            p5.pop();
        }
    }
};




};


export default () => {
    return <ReactP5Wrapper sketch={PenroseSnowflakeSketch} />;
  };