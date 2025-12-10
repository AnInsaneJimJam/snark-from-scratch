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

// Taking a small g for just learning purposes
const g = 7;


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

function count1(binaryString){
    let count = 0;
    for(let i = 0; i < binaryString.length; i++){
        if(binaryString[i] === '1'){
            count++;
        }
    }
    return count;
}

function get1(binaryString){
    let result = [];
    for(let i =0; i < binaryString.length; i++){
        if(binaryString[i] === '1'){
            result.push(binaryString.length-i);
        }
    }
    return result;
}

// For now, y = x^k computation only
// [[Gate no., Left input, Right input, Output]]
function getCircuitDetails(k){
    const binaryk = k.toString(2);
    const noOfGates = count1(binaryk) + binaryk.length - 2;
    const arr1 = get1(binaryk);
    const circuit = [];
    for(let i = 1; i <=noOfGates; i++){
        if(i < binaryk.length){
            circuit.push([i,i,i,i+1]);
        }else{
            console.log(i-binaryk.length)
            circuit.push([i,i,arr1[i-binaryk.length+1],i+1])
        }
    }
   return circuit
}

// Min,max needs to be integer
function getRandInt(min, max){
    return Math.floor(Math.random() * (max - min +1)) + min;
}
    

//Input Value
let C1 = 100;


//Veronica Generates random Values
secret = getRandInt(1,p-1);

const num = 5

console.log(getCircuitDetails(5));
