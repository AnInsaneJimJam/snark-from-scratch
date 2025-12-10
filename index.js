/*
SARK implementation for a hardcoded circuit y=x^5 as done in one of best paper I have ever read: https://ebuchman.github.io/pdf/snarks.pdf. I will try to keep this project as modular and reader friendly as possible. (I can't promise though)


Computation to be done: y = x^5

Circuit:
  C₁   C₁        C₁        C₁        C₁
    \ /         /         /         /
    (x)        /         /         /
     |        /         /         /
     C₂      /         /         /
      \     /         /         /
       \   /         /         /
        (x)         /         /
         |         /         /
         C₃       /         /
          \      /         /
           \    /         /
            (x)          /
             |          /
             C₄        /
              \       /
               \     /
                (x)
                 |
                 C₅
                 

Where each gate multiplies the previous result by x:
- C₁: x (input)
- C₂: x * x = x²
- C₃: x² * x = x³
- C₄: x³ * x = x⁴
- C₅: x⁴ * x = x⁵ = y
*/

// Veronica(Verifier) doing the setup

// Taking a small p for just learning purposes
const p = 2147483647;


function getGatesPolynomial(){
    // For now, hardcoding for y = x^3
    return [24,-50,35,-10,1];
}

function evaluatePolynomial(poly, x){
    let result = 0;
    for(let i = 0; i < poly.length; i++){
        result += poly[i] * Math.pow(x, i);
    }
    return result;
}

// arrpoints = [[x,y]]
function evaluateUsingLagrange(arrPoints, x){
    let result = 0;
    for (let i = 0; i < arrPoints.length; i++){
        const [xi, yi] = arrPoints[i];
        let numerator = 1;
        let denominator = 1;
        for(let k = 0; k < arrPoints.length; k++){
            if(k !== i){
                const [xk, yk] = arrPoints[k];
                numerator = numerator * (x - xk);
                denominator = denominator * (xi - xk);
            }
        }
        result += (yi * numerator) / denominator;
    }
    return result;
}

// Min,max needs to be integer
function getRandInt(min, max){
    return Math.floor(Math.random() * (max - min +1)) + min;
}
/*
//Hardcoded for now for y = x^3
function getLpolynomials(){
    return[[2,-1],[-1,1],[0,0]];
}

function getRpolynomials(){
    return[[1,0],[0,0],[0,0]];
}

function getOpolynomials(){
    return[[0,0],[2,-1],[-1,1]];
}
*/
    

//Input Value
let C1 = 100;


//Veronica Generates random Values
secret = getRandInt(1,p-1);


