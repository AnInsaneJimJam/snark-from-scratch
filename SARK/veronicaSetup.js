import { P, G } from "./parameters.js";
import { getRandInt } from "./misc.js";
import { FiniteField } from "../utils/finitefield.js";
import { polynomialsLi, polynomialsRi, polynomialsOi, polynomialG } from "./commonSetup.js";

// Finite field
const ff = new FiniteField(P);

//select a random secret
const secret = BigInt(getRandInt(1, P - 1));

// Compute encrypted polynomials
const encryptedLs = polynomialsLi.map(poly => ff.pow(G, poly.evaluate(secret)));
const encryptedRs = polynomialsRi.map(poly => ff.pow(G, poly.evaluate(secret)));
const encryptedOs = polynomialsOi.map(poly => ff.pow(G, poly.evaluate(secret)));

const encryptedG = ff.pow(G, polynomialG.evaluate(secret));

//Knowledge of exponent values
const alphaL = BigInt(getRandInt(1, P - 1));
const alphaR = BigInt(getRandInt(1, P - 1));
const alphaO = BigInt(getRandInt(1, P - 1));
const betaL = BigInt(getRandInt(1, P - 1));
const betaR = BigInt(getRandInt(1, P - 1));
const betaO = BigInt(getRandInt(1, P - 1));

// Compute values needed for knowledge of exponent check
const encryptedAlphaLs = encryptedLs.map(encPoly => ff.pow(encPoly, alphaL));
const encryptedAlphaRs = encryptedLs.map(encPoly => ff.pow(encPoly, alphaR));
const encryptedAlphaOs = encryptedLs.map(encPoly => ff.pow(encPoly, alphaO));

// Compute beta values
const encryptedBetaLs = encryptedLs.map(encPoly => ff.pow(encPoly, betaL));
const encryptedBetaRs = encryptedLs.map(encPoly => ff.pow(encPoly, betaR));
const encryptedBetaOs = encryptedLs.map(encPoly => ff.pow(encPoly, betaO));

// Computa beta comination
const encryptedSubPolynomialSum = ff.mul(ff.mul(encryptedBetaLs,encryptedAlphaRs),encryptedAlphaOs);
