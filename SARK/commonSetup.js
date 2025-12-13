import FiniteField from "../utils/finitefield.js";
import Polynomial from "../utils/polynomial.js";
import {P, CIRCUIT} from "./parameters.js";
import {getCircuitDetails,getSubPolynomailPoints} from "../utils/circuit.js";

const circuit = getCircuitDetails(CIRCUIT);
const ff = new FiniteField(P);

function getGPolynomial(){
    const points = circuit.map(elem => [BigInt( elem[0]),0n])
    return Polynomial.lagrange(points,ff)
}

function getSubPolynomials(pos){
    let result = []
    for(let i = 1; i <= circuit.length+1;i++){
        let subpoly = getSubPolynomailPoints(circuit,pos,i);
        result.push(Polynomial.lagrange(subpoly,ff));
    }
    return result
}

export const polynomialG = getGPolynomial();
export const polynomialsLi = getSubPolynomials(1);
export const polynomialsRi = getSubPolynomials(2);
export const polynomialsOi = getSubPolynomials(3);