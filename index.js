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

import FiniteField from "./finitefield.js";

// Veronica(Verifier) doing the setup

// Taking a small p for just learning purposes
const P = 2147483647;

// Taking a small g for just learning purposes
const G = 7;

// Defining the circuit
// Hardcoding ends here
const CIRCUIT = 3;


const ff = new FiniteField(P);


/**
 * Evaluates the target polynomial T(x) = (x-1)(x-2)...(x-n) at point x
 * This polynomial vanishes at all gate indices (T(i) = 0 for i = 1,2,...,n)
 * @param {number[][]} circuit - Circuit representation from getCircuitDetails
 * @param {number|bigint} x - Point at which to evaluate the target polynomial
 * @returns {bigint} The value of T(x)
 */
function evaluateGatesPolynomial(circuit,x){
    let result = 1n;
    for(let i =1; i<circuit.length + 1; i++){
        result = ff.mul(result, ff.sub(x, i));
    }
    return result
}

/**
 * Evaluates a polynomial at a given point x
 * @param {number[]|bigint[]} poly - Coefficient array where poly[i] is coefficient of x^i 
 * @param {number|bigint} x - Point at which to evaluate the polynomial
 * @returns {bigint} The value of the polynomial at x
 */
function evaluatePolynomial(poly, x){
    let result = 0n;
    for(let i = 0; i < poly.length; i++){
        result = ff.add(result, ff.mul(poly[i], ff.pow(x, i)));
    }
    return result;
}

/**
 * Performs Lagrange interpolation to evaluate a polynomial at point x
 * Given points, constructs the unique polynomial passing through them and evaluates it
 * @param {number[][]|bigint[][]} arrPoints - Array of [x, y] coordinate pairs
 * @param {number|bigint} x - Point at which to evaluate the interpolated polynomial
 * @returns {bigint} The value of the interpolated polynomial at x
 */
function evaluateUsingLagrange(arrPoints, x){
    let result = 0n;
    for (let i = 0; i < arrPoints.length; i++){
        const [xi, yi] = arrPoints[i];
        let numerator = 1n;
        let denominator = 1n;
        for(let k = 0; k < arrPoints.length; k++){
            if(k !== i){
                const [xk, yk] = arrPoints[k];
                numerator = ff.mul(numerator, ff.sub(x, xk));
                denominator = ff.mul(denominator, ff.sub(xi, xk));
            }
        }
        result = ff.add(result, ff.div(ff.mul(yi, numerator), denominator));
    }
    return result;
}

/**
 * Counts the number of '1' bits in a binary string
 * @param {string} binaryString - Binary representation as a string (e.g., "101")
 * @returns {number} Count of '1' characters in the string
 */
function count1(binaryString){
    let count = 0;
    for(let i = 0; i < binaryString.length; i++){
        if(binaryString[i] === '1'){
            count++;
        }
    }
    return count;
}

/**
 * Gets the positions of '1' bits in a binary string (counting from right, 1-indexed)
 * @param {string} binaryString - Binary representation as a string
 * @returns {number[]} Array of positions where '1' appears (rightmost position = 1)
 */
function get1(binaryString){
    let result = [];
    for(let i =0; i < binaryString.length; i++){
        if(binaryString[i] === '1'){
            result.push(binaryString.length-i);
        }
    }
    return result;
}

/**
 * Generates circuit details for computing y = x^k using binary decomposition
 * Creates gates for efficient exponentiation (square-and-multiply algorithm)
 * @param {number} k - The exponent for x^k computation
 * @returns {number[][]} Array of gates, each gate: [gate_no, left_input, right_input, output]
 */
function getCircuitDetails(k){
    const binaryk = k.toString(2);
    const noOfGates = count1(binaryk) + binaryk.length - 2;
    const arr1 = get1(binaryk);
    const circuit = [];
    for(let i = 1; i <=noOfGates; i++){
        if(i < binaryk.length){
            circuit.push([i,i,i,i+1]);
        }else{
            circuit.push([i,i,arr1[i-binaryk.length+1],i+1])
        }
    }
   return circuit
}

/**
 * Computes modular exponentiation: (base^exponent) mod p
 * Uses fast exponentiation (square-and-multiply) for efficiency
 * @param {number} base - Base value
 * @param {number} exponent - Exponent value (non-negative integer)
 * @returns {number} Result of (base^exponent) mod p
 */
function expo(base, exponent){
    if(exponent === 0) return 1;
    if(exponent === 1) return base % P;
    
    let result = 1;
    base = base % P;
    
    while(exponent > 0){
        if(exponent % 2 === 1){
            result = (result * base) % P;
        }
        exponent = Math.floor(exponent / 2);
        base = (base * base) % P;
    }
    
    return result;
}

/**
 * Generates sub-polynomial points for a specific wire in the QAP
 * Creates points (gate_index, coefficient) for Lagrange interpolation
 * @param {number[][]} circuit - Circuit representation from getCircuitDetails
 * @param {number} pos - Position in gate: 1=left input, 2=right input, 3=output
 * @param {number} i - Wire index (Li, Ri, or Oi)
 * @returns {number[][]} Array of [gate_number, coefficient] pairs for interpolation
 */
function getSubPolynomailPoints(circuit,pos,i){
    let result = [];
    for(let j = 0; j < circuit.length ; j++){
        result.push([circuit[j][0],circuit[j][pos]==i ? 1n:0n]) // coefficient is 0 or 1
    }
    return result
}

function evaluateSubPolynomials(circuit,pos,x){
    let result = []
    for(let i = 1; i <= circuit.length+1;i++){
        let subpoly = getSubPolynomailPoints(circuit,pos,i);
        result.push(evaluateUsingLagrange(subpoly,x));
    }
    return result
}

/**
 * Generates a random integer in the range [min, max] (inclusive)
 * @param {number} min - Minimum value (must be integer)
 * @param {number} max - Maximum value (must be integer)
 * @returns {number} Random integer between min and max
 */
function getRandInt(min, max){
    return Math.floor(Math.random() * (max - min +1)) + min;
}

////////////////////////////////////////SETUP////////////////////////////////////////////////////
//Input Value
let I = 100n;

//Calculate Output Value : Done by Philip (Prover)
let O = ff.pow(I, BigInt(CIRCUIT));


//Veronica Generates random Values
const secret = BigInt(getRandInt(1,P-1));

//Knowledge of exponent values
const alphaL = BigInt(getRandInt(1,P-1));
const alphaR = BigInt(getRandInt(1,P-1));
const alphaO = BigInt(getRandInt(1,P-1));
const betaL = BigInt(getRandInt(1,P-1));
const betaR = BigInt(getRandInt(1,P-1));
const betaO = BigInt(getRandInt(1,P-1));

const circuit = getCircuitDetails(CIRCUIT)

//Calculate g^G(s)
const encryptedG = ff.pow(G, evaluateGatesPolynomial(circuit,secret));

//Calculate L_i(s),R_i(s)_O_i(s)
const Ls = evaluateSubPolynomials(circuit,1,secret);
const Rs = evaluateSubPolynomials(circuit,2,secret);
const Os = evaluateSubPolynomials(circuit,3,secret);

// Have to handle negative values
const encryptedLs = Ls.map((elem) => {
  return ff.pow(G,elem);
});

const encryptedRs = Rs.map((elem) => {
  return ff.pow(G,elem);
});

const encryptedOs = Os.map((elem) => {
  return ff.pow(G,elem);
});