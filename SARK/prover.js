import FiniteField from "../utils/finitefield";
import Polynomial from "../utils/polynomial";
import { polynomialG, polynomialsLi, polynomialsOi, polynomialsRi } from "./commonSetup"
import { P } from "./parameters";

/* TODO: Reading logic of the communicated values provided by Veronica
    input: I
    encrptedLmids,encryptedAlphaLmids ....
*/

ff = new FiniteField(P)

function evalcircuit(input) {
    // TODO: Implement circuit
}

const Ci = evalcircuit(I)

const noOfGates = polynomialsLi.length

function getSubPoly(pos) {
    let result;
    switch (pos) {
        case 1:
            result = new Polynomial([scalar], ff).mul(polynomialsLi[0])
            for (let i = 1n; i < noOfGates; i++) {
                result = result.add(new Polynomial([scalar], ff).mul(polynomialsLi[i]));
            }
            break;
        case 2:
            result = new Polynomial([scalar], ff).mul(polynomialsRi[0])
            for (let i = 1n; i < noOfGates; i++) {
                result = result.add(new Polynomial([scalar], ff).mul(polynomialsRi[i]));
            }
            break;
        case 3:
            result = new Polynomial([scalar], ff).mul(polynomialsOi[0])
            for (let i = 1n; i < noOfGates; i++) {
                result = result.add(new Polynomial([scalar], ff).mul(polynomialsOi[i]));
            }
            break;
    }
    return result
}

// W(x) = L(x)R(x) - O(x)
const polynomialW = getSubPoly(1).mul(getSubPoly(2)).sub(getSubPoly(3));

const polynomialH = polynomialW.div(polynomialG);


// TODO: Correct later
function getEncryptedInterSubPoly(pos) {
    let result;
    switch (pos) {
        case 1:
            result = new Polynomial([scalar], ff).mul(polynomialsLi[0])
            for (let i = 1n; i < noOfGates; i++) {
                result = result.add(new Polynomial([scalar], ff).mul(polynomialsLi[i]));
            }
            break;
        case 2:
            result = new Polynomial([scalar], ff).mul(polynomialsRi[0])
            for (let i = 1n; i < noOfGates; i++) {
                result = result.add(new Polynomial([scalar], ff).mul(polynomialsRi[i]));
            }
            break;
        case 3:
            result = new Polynomial([scalar], ff).mul(polynomialsOi[0])
            for (let i = 1n; i < noOfGates; i++) {
                result = result.add(new Polynomial([scalar], ff).mul(polynomialsOi[i]));
            }
            break;
    }
    return result
}

//Proving the knowledge of exponent 
const encryptedLmid = getInterSubPoly(encryptedLmids)
const encryptedRmid = getInterSubPoly(encryptedRmids)
const encryptedOmid = getInterSubPoly(encryptedOmids)
const encryptedAlphaLmid = getInterSubPoly(encryptedAplhaLmids)
const encryptedAlphaRmid = getInterSubPoly(encryptedAlphaLmids)
const encryptedAlphaOmid = getInterSubPoly(encryptedAlphaLmids)
const encryptedInterCombined = getInterSubPoly(encryptedSubPolynomialSum)



