import {count1,get1} from "./misc.js";

/**
 * Generates circuit details for computing y = x^k using binary decomposition
 * Creates gates for efficient exponentiation (square-and-multiply algorithm)
 * @param {number} k - The exponent for x^k computation
 * @returns {number[][]} Array of gates, each gate: [gate_no, left_input, right_input, output]
 */
export function getCircuitDetails(k){
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
 * Generates sub-polynomial points for a specific wire in the QAP
 * Creates points (gate_index, coefficient) for Lagrange interpolation
 * @param {number[][]} circuit - Circuit representation from getCircuitDetails
 * @param {number} pos - Position in gate: 1=left input, 2=right input, 3=output
 * @param {number} i - Wire index (Li, Ri, or Oi)
 * @returns {number[][]} Array of [gate_number, coefficient] pairs for interpolation
 */
export function getSubPolynomailPoints(circuit,pos,i){
    let result = [];
    for(let j = 0; j < circuit.length ; j++){
        result.push([circuit[j][0],circuit[j][pos]==i ? 1n:0n]) // coefficient is 0 or 1
    }
    return result
}
