import FiniteField from "./finitefield.js";

class Polynomial {
    /**
     * @param {BigInt[]} coeffs - Coefficients from lowest degree to highest [a0, a1, ..., an]
     * @param {FiniteField} ff - The finite field instance
     */
    constructor(coeffs, ff) {
        this.ff = ff;
        while (coeffs.length > 0 && coeffs[coeffs.length - 1] === 0n) {
            coeffs.pop();
        }
        this.coeffs = coeffs.length > 0 ? coeffs : [0n];
    }

    get degree() {
        return this.coeffs.length - 1;
    }

    eval(x) {
        let result = 0n;
        let xi = 1n; // x^i
        for (let i = 0; i < this.coeffs.length; i++) {
            result = this.ff.add(result, this.ff.mul(this.coeffs[i], xi));
            xi = this.ff.mul(xi, x);
        }
        return result;
    }

    add(other) {
        const maxLen = Math.max(this.coeffs.length, other.coeffs.length);
        const newCoeffs = new Array(maxLen).fill(0n);

        for (let i = 0; i < maxLen; i++) {
            const a = i < this.coeffs.length ? this.coeffs[i] : 0n;
            const b = i < other.coeffs.length ? other.coeffs[i] : 0n;
            newCoeffs[i] = this.ff.add(a, b);
        }

        return new Polynomial(newCoeffs, this.ff);
    }

    sub(other) {
        const maxLen = Math.max(this.coeffs.length, other.coeffs.length);
        const newCoeffs = new Array(maxLen).fill(0n);

        for (let i = 0; i < maxLen; i++) {
            const a = i < this.coeffs.length ? this.coeffs[i] : 0n;
            const b = i < other.coeffs.length ? other.coeffs[i] : 0n;
            newCoeffs[i] = this.ff.sub(a, b);
        }

        return new Polynomial(newCoeffs, this.ff);
    }

    mul(other) {
        const newLen = this.coeffs.length + other.coeffs.length - 1;
        const newCoeffs = new Array(newLen).fill(0n);

        for (let i = 0; i < this.coeffs.length; i++) {
            for (let j = 0; j < other.coeffs.length; j++) {
                const term = this.ff.mul(this.coeffs[i], other.coeffs[j]);
                newCoeffs[i + j] = this.ff.add(newCoeffs[i + j], term);
            }
        }

        return new Polynomial(newCoeffs, this.ff);
    }

    div(divisor) {
        if (divisor.degree < 0 || (divisor.coeffs.length === 1 && divisor.coeffs[0] === 0n)) {
            throw new Error("Division by zero polynomial");
        }

        let quotient = new Polynomial([0n], this.ff);
        let remainder = new Polynomial([...this.coeffs], this.ff);

        const degD = divisor.degree;
        const invLeadD = this.ff.mulInv(divisor.coeffs[degD]); // inverse of leading coeff of divisor

        while (remainder.degree >= degD && !(remainder.degree === 0 && remainder.coeffs[0] === 0n)) {
            const degR = remainder.degree;
            const leadR = remainder.coeffs[degR];

            const diffDeg = degR - degD;
            const scale = this.ff.mul(leadR, invLeadD);

            // Create monomial: scale * x^diffDeg
            const monomialCoeffs = new Array(diffDeg + 1).fill(0n);
            monomialCoeffs[diffDeg] = scale;
            const monomial = new Polynomial(monomialCoeffs, this.ff);

            quotient = quotient.add(monomial);
            remainder = remainder.sub(monomial.mul(divisor));
        }

        return { quotient, remainder };
    }

    toString() {
        if (this.degree === 0 && this.coeffs[0] === 0n) return "0";
        return this.coeffs.map((c, i) => `${c}x^${i}`).reverse().join(" + ");
    }

    /**
     * Lagrange Interpolation
     * @param {BigInt[][]} points - Array of [x, y] points
     * @param {FiniteField} ff 
     */
    static lagrange(points, ff) {
        let result = new Polynomial([0n], ff);

        for (let i = 0; i < points.length; i++) {
            const [xi, yi] = points[i];

            // Numerator: product of (x - xj) for j != i
            let numerator = new Polynomial([1n], ff);
            let denominatorVal = 1n;

            for (let j = 0; j < points.length; j++) {
                if (i === j) continue;
                const [xj, yj] = points[j];

                // (x - xj)
                const termPoly = new Polynomial([ff.sub(0n, xj), 1n], ff);
                numerator = numerator.mul(termPoly);

                // (xi - xj)
                denominatorVal = ff.mul(denominatorVal, ff.sub(xi, xj));
            }

            // term = yi * numerator / denominator
            const scalar = ff.div(yi, denominatorVal);
            const term = new Polynomial([scalar], ff).mul(numerator); // scalar mult

            result = result.add(term);
        }

        return result;
    }
}

export default Polynomial;
