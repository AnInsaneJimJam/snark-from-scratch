/**
 * Counts the number of '1' bits in a binary string
 * @param {string} binaryString - Binary representation as a string (e.g., "101")
 * @returns {number} Count of '1' characters in the string
 */
export function count1(binaryString){
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
export function get1(binaryString){
    let result = [];
    for(let i =0; i < binaryString.length; i++){
        if(binaryString[i] === '1'){
            result.push(binaryString.length-i);
        }
    }
    return result;
}

export function getRandInt(min, max){
    return Math.floor(Math.random() * (max - min +1)) + min;
}