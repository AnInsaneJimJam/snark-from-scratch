import {P,G} from "./parameters.js";
import {getRandInt} from "./misc.js";
import {FiniteField} from "./finitefield.js";
import {polynomialsLi,polynomialsRi,polynomialsOi,polynomialG} from "./commonSetup.js";

// Finite field
const ff = new FiniteField(P);

//select a random secret
const secret = BigInt(getRandInt(1,P-1));

// Compute encrypted polynomials
const encryptedLs = polynomialsLi.map(poly => ff.pow(G,poly.evaluate(secret)));
const encryptedRs = polynomialsRi.map(poly => ff.pow(G,poly.evaluate(secret)));
const encryptedOs = polynomialsOi.map(poly => ff.pow(G,poly.evaluate(secret)));

const encryptedG = ff.pow(G,polynomialG.evaluate(secret));