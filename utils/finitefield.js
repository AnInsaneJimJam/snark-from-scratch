class FiniteField {
    constructor(p) {
        this.p = BigInt(p);
    }

    wrap(x) {
        let res = BigInt(x) % this.p;
        return res >= 0n ? res : res + this.p;
    }

    add(x, y) {
        return this.wrap(BigInt(x) + BigInt(y));
    }

    sub(x, y) {
        return this.wrap(this.wrap(BigInt(x)) + this.subInv(BigInt(y)));
    }

    mul(x, y) {
        return this.wrap(BigInt(x) * BigInt(y));
    }

    div(x, y) {
        return this.mul(x, this.mulInv(y));
    }

    mulInv(x) {
        return this.pow(x, this.p - 2n);
    }

    subInv(x) {
        return this.p - this.wrap(BigInt(x));
    }

    pow(base, expo) {
        base = BigInt(base);
        expo = BigInt(expo);
        let res = 1n;
        base = this.wrap(base);
        while (expo > 0n) {
            if (expo % 2n === 1n) res = this.mul(res, base);
            base = this.mul(base, base);
            expo /= 2n;
        }
        return res;
    }

    eq(x, y) {
        return this.wrap(x) === this.wrap(y);
    }
}

export default FiniteField;