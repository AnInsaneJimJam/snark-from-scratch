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