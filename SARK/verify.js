import { I, P } from "./parameters.js";
import fs from "fs";
import { bigIntParse} from "../utils/serialization.js";
import { assert } from "console";
import FiniteField from "../utils/finitefield.js";

const secretKeyPath = new URL('./secret_key.json', import.meta.url).pathname;
console.log(`Loading secret key from ${secretKeyPath}...`);
const secretKey = bigIntParse(fs.readFileSync(secretKeyPath, 'utf8'));

const verificationKeyPath = new URL('./verification_key.json', import.meta.url).pathname;
console.log(`Loading verification key from ${verificationKeyPath}...`);
const verificationKey = bigIntParse(fs.readFileSync(verificationKeyPath, 'utf8'));

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

const {
    secret,
    alphaL,
    alphaR,
    alphaO,
    betaL,
    betaR,
    betaO
} = secretKey;

const {
    output,
    encryptedLmid,
    encryptedRmid,
    encryptedOmid,
    encryptedAlphaLmid,
    encryptedAlphaRmid,
    encryptedAlphaOmid,
    encryptedInterCombined,
    encryptedH
} = verificationKey;

const ff = new FiniteField(P)

function getEncryptedIO(arr){
    let result = 1n;
    result = ff.mul(result, ff.pow(arr[0],I));
    result = ff.mul(result, ff.pow(arr[arr.length-1],output));
    return result
}

// Verifying Values
const encryptedL = ff.mul(getEncryptedIO(encryptedLs),encryptedLmid);
const encryptedR = ff.mul(getEncryptedIO(encryptedRs),encryptedRmid);
const encryptedO = ff.mul(getEncryptedIO(encryptedOs),encryptedOmid);
const encryptedAlphaL = ff.mul(getEncryptedIO(encryptedAlphaLs),encryptedAlphaLmid);
const encryptedAlphaR = ff.mul(getEncryptedIO(encryptedAlphaRs),encryptedAlphaRmid);
const encryptedAlphaO = ff.mul(getEncryptedIO(encryptedAlphaOs),encryptedAlphaOmid);
const encryptedSumIO = ff.mul(getEncryptedIO(encryptedSubPolynomialSum),encryptedInterCombined);

//Computing values for test
const encryptedBetaLmid = ff.pow(encryptedLmid,betaL);
const encryptedBetaRmid = ff.pow(encryptedRmid,betaR);
const encryptedBetaOmid = ff.pow(encryptedOmid,betaO);

//Knowledge of Exponent-Linear Combination
console.assert(encryptedAlphaLmid == ff.pow(encryptedLmid, alphaL,"alphaL test failed"))
console.assert(encryptedAlphaRmid == ff.pow(encryptedRmid, alphaR,"alphaR test failed"))
console.assert(encryptedAlphaOmid == ff.pow(encryptedOmid, alphaO,"alphaO test failed"))

//Knowledge of Exponent-Same Combination
console.assert(encryptedInterCombined == ff.mul(ff.mul(encryptedBetaLmid,encryptedBetaRmid),encryptedBetaOmid),"encryptedSumIO test failed")


