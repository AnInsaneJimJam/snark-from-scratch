import FiniteField from "../utils/finitefield.js";
import Polynomial from "../utils/polynomial.js";
import {P, CIRCUIT} from "./parameters.js";
import {getCircuitDetails,getSubPolynomailPoints} from "../utils/circuit.js";

const circuit = getCircuitDetails(CIRCUIT);

function getGPolynomial(){
    const points = circuit.map(elem => [BigInt( elem[0]),0n])
    return Polynomial.lagrange(points)
}

function getSubPolynomials(pos){
    let result = []
    for(let i = 1; i <= circuit.length+1;i++){
        let subpoly = getSubPolynomailPoints(circuit,pos,i);
        result.push(Polynomial.lagrange(subpoly));
    }
    return result
}

let polynomialG = getGPolynomial();
let polynomialsLi = getSubPolynomials(1);
let polynomialsRi = getSubPolynomials(2);
let polynomialsOi = getSubPolynomials(3);