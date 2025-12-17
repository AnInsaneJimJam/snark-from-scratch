import FiniteField from "../utils/finitefield.js";
import Polynomial from "../utils/polynomial.js";
import { polynomialG, polynomialsLi, polynomialsOi, polynomialsRi } from "./commonSetup.js"
import { CIRCUIT, I, P } from "./parameters.js";
import { getCircuitDetails } from "../utils/circuit.js";
import fs from 'fs';
import { bigIntParse, bigIntStringify } from '../utils/serialization.js';


const provingKeyPath = new URL('./proving_key.json', import.meta.url).pathname;
console.log(`Loading proving key from ${provingKeyPath}...`);
const provingKey = bigIntParse(fs.readFileSync(provingKeyPath, 'utf8'));

const {
    encryptedLs,
    encryptedRs,
    encryptedOs,
    encryptedAlphaLs,
    encryptedAlphaRs,
    encryptedAlphaOs,
    encryptedSubPolynomialSum,
    PowersOfG
} = provingKey;

const ff = new FiniteField(P)



function evalcircuit(input) {
    const circuit = getCircuitDetails(BigInt(CIRCUIT));
    const wires = { 1: input };

    for (let i = 0; i < circuit.length; i++) {
        const [gateNo, left, right, out] = circuit[i];
        const leftVal = wires[left];
        const rightVal = wires[right];
        wires[out] = leftVal * rightVal;
    }

    const result = [];
    const numWires = circuit.length + 1;
    for(let i = 1; i <= numWires; i++) {
        result.push(wires[i]);
    }
    return result
}

const Ci = evalcircuit(I);

const noOfPolynomials = polynomialsLi.length

function getSubPoly(pos) {
    let result;
    switch (pos) {
        case 1:
            result = new Polynomial([Ci[0]], ff).mul(polynomialsLi[0])
            for (let i = 1n; i < noOfPolynomials; i++) {
                result = result.add(new Polynomial([Ci[i]], ff).mul(polynomialsLi[i]));
            }
            break;
        case 2:
            result = new Polynomial([Ci[0]], ff).mul(polynomialsRi[0])
            for (let i = 1n; i < noOfPolynomials; i++) {
                result = result.add(new Polynomial([Ci[i]], ff).mul(polynomialsRi[i]));
            }
            break;
        case 3:
            result = new Polynomial([Ci[0]], ff).mul(polynomialsOi[0])
            for (let i = 1n; i < noOfPolynomials; i++) {
                result = result.add(new Polynomial([Ci[i]], ff).mul(polynomialsOi[i]));
            }
            break;
    }
    return result
}

// W(x) = L(x)R(x) - O(x)
const polynomialW = getSubPoly(1).mul(getSubPoly(2)).sub(getSubPoly(3));

const polynomialH = polynomialW.div(polynomialG);

function getEncryptedInterSubPoly(arr) {
    let result =1n;
    for (let i = 1; i < arr.length-1; i++) {
        result = ff.mul(result,ff.pow(arr[i],Ci[i]));
    }
    return result
}

// //Proving the knowledge of exponent 
const encryptedLmid = getEncryptedInterSubPoly(encryptedLs);
const encryptedRmid = getEncryptedInterSubPoly(encryptedRs);
const encryptedOmid = getEncryptedInterSubPoly(encryptedOs);
const encryptedAlphaLmid = getEncryptedInterSubPoly(encryptedAlphaLs);
const encryptedAlphaRmid = getEncryptedInterSubPoly(encryptedAlphaRs);
const encryptedAlphaOmid = getEncryptedInterSubPoly(encryptedAlphaOs);
const encryptedInterCombined = getEncryptedInterSubPoly(encryptedSubPolynomialSum);


function getEncryptedH(){
    let result = 1n;
    for(let i =0; i<polynomialH.quotient.coeffs.length; i++){
        result = ff.mul(result,ff.pow(PowersOfG[i],polynomialH.quotient.coeffs[i]));
    }
    return result
}

const verificationkey = {
    output: Ci[Ci.length-1],
    encryptedLmid,
    encryptedRmid,
    encryptedOmid,
    encryptedAlphaLmid,
    encryptedAlphaRmid,
    encryptedAlphaOmid,
    encryptedInterCombined,
    encryptedH: getEncryptedH()
};

console.log("Saving proving key to SARK/verification_key.json...");
fs.writeFileSync("verification_key.json", bigIntStringify(verificationkey));
console.log("Done.");



