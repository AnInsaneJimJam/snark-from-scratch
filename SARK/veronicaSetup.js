import { P, G } from "./parameters.js";
import { getRandInt } from "../utils/misc.js";
import FiniteField from "../utils/finitefield.js";
import { polynomialsLi, polynomialsRi, polynomialsOi, polynomialG } from "./commonSetup.js";
import fs from "fs";
import { bigIntStringify } from "../utils/serialization.js";

// Finite field
const ff = new FiniteField(P);

//select a random secret
const secret = BigInt(getRandInt(1, P - 1));

// Compute encrypted polynomials
const encryptedLs = polynomialsLi.map(poly => ff.pow(G, poly.eval(secret)));
const encryptedRs = polynomialsRi.map(poly => ff.pow(G, poly.eval(secret)));
const encryptedOs = polynomialsOi.map(poly => ff.pow(G, poly.eval(secret)));

const encryptedG = ff.pow(G, polynomialG.eval(secret));

//Knowledge of exponent values
const alphaL = BigInt(getRandInt(1, P - 1));
const alphaR = BigInt(getRandInt(1, P - 1));
const alphaO = BigInt(getRandInt(1, P - 1));
const betaL = BigInt(getRandInt(1, P - 1));
const betaR = BigInt(getRandInt(1, P - 1));
const betaO = BigInt(getRandInt(1, P - 1));

// Compute values needed for knowledge of exponent check
const encryptedAlphaLs = encryptedLs.map(encPoly => ff.pow(encPoly, alphaL));
const encryptedAlphaRs = encryptedRs.map(encPoly => ff.pow(encPoly, alphaR));
const encryptedAlphaOs = encryptedOs.map(encPoly => ff.pow(encPoly, alphaO));

// Compute beta values
const encryptedBetaLs = encryptedLs.map(encPoly => ff.pow(encPoly, betaL));
const encryptedBetaRs = encryptedRs.map(encPoly => ff.pow(encPoly, betaR));
const encryptedBetaOs = encryptedOs.map(encPoly => ff.pow(encPoly, betaO));

// Compute beta combination
function getEncryptedSubPolynomialSum() {
    let result = [];
    for (let i = 0n; i < encryptedBetaLs.length; i++) {
        result.push(ff.mul(ff.mul(encryptedBetaLs[i], encryptedBetaRs[i]), encryptedBetaOs[i]))
    }
    return result
}

const encryptedSubPolynomialSum = getEncryptedSubPolynomialSum()

// Degree of H(x) = 2*(n-1) - n
const degH = BigInt(encryptedLs.length) - 2n;


function getPowersOfG() {
    let PowersOfG = [];
    for (let i = 0n; i <= degH; i++) {
        PowersOfG.push(ff.pow(G, secret ** i))
    }
    return PowersOfG
}

const PowersOfG = getPowersOfG()

const provingKey = {
    encryptedLs,
    encryptedRs,
    encryptedOs,
    encryptedAlphaLs,
    encryptedAlphaRs,
    encryptedAlphaOs,
    encryptedSubPolynomialSum,
    PowersOfG
};

const secretkey = {
    secret,
    alphaL,
    alphaR,
    alphaO,
    betaL,
    betaR,
    betaO
};

console.log("Saving proving key to SARK/proving_key.json...");
fs.writeFileSync("proving_key.json", bigIntStringify(provingKey));
console.log("Done.");

console.log("Saving secret key to SARK/secret_key.json...");
fs.writeFileSync("secret_key.json", bigIntStringify(secretkey));
console.log("Done.");
