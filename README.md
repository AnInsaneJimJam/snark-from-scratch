# 🧙‍♂️ Snark From Scratch

Hi there! 👋 Welcome to **Snark From Scratch**.

This project is a raw, educational implementation of a **zk-SNARK** (Zero-Knowledge Succinct Non-Interactive Argument of Knowledge) protocol, built entirely from the ground up in JavaScript.

It's designed to help you *understand* the math and mechanics behind SNARKs by seeing them implemented without heavy cryptographic libraries. It simulates the core components of the protocol—Arithmetic Circuits, R1CS, QAPs, and Homomorphic Hiding.

> **⚠️ Educational Warning:** This is a toy implementation for learning purposes only. It uses "private verification" (checking encryption against secret values) rather than pairings, so it is **not secure** for real-world use. Do not use this in production!

---

## 🏗️ How It Works

The project simulates the workflow of a Quadratic Arithmetic Program (QAP) based SNARK:

1.  **The Circuit**: We define a computation (specifically $x^{18}$) as an arithmetic circuit.
2.  **Setup (Veronica)**: A trusted setup generates:
    -   **Proving Key**: Encrypted polynomials provided to the prover.
    -   **Secret Key**: Secret values ($\alpha, \beta, s$) used to check the proof (in a real SNARK, these would be toxic waste).
    -   **Verification Key**: Encrypted values allowing the verifier to check the proof.
3.  **Prover**: The prover executes the circuit with a private input, computes the witness, and generates a proof (encrypted polynomials) showing they know a valid assignment.
4.  **Verifier**: The verifier checks that the encrypted proof matches the required linear combinations and divisibility checks, ensuring the prover actually knows the witness.

## 🚀 Getting Started

### Prerequisites
-   Node.js installed.

### Installation
Clone the repository and install... actually, there are no dependencies! Everything is vanilla JS (using standard modules).

```bash
# Just make sure you are in the project root
cd snark-from-scratch
```

## 🧪 Running the Protocol

We have three main scripts in the `SARK` directory that represent the three parties in the protocol.

### 1. Trusted Setup 🛠️
First, run the setup to generate the keys. This will create `proving_key.json` and `secret_key.json`.
```bash
node SARK/veronicaSetup.js
```
*Veronica (our trusted setup) picks random secrets and encrypts the polynomials.*

### 2. The Prover ✍️
Now, acting as the prover, generate a proof for your computation. This reads the proving key and outputs `verification_key.json` (which acts as our proof + public inputs here).
```bash
node SARK/prover.js
```
*The prover calculates $5^{18}$ (or whatever is in parameters) and generates the encrypted proof.*

### 3. The Verifier 🕵️‍♀️
Finally, verify the proof.
```bash
node SARK/verify.js
```
*The verifier asserts that the cryptographic relationships hold true. If it runs without assertion errors, the proof is valid!*

---

## ⚙️ Configuration

You can tweak the circuit and inputs in `SARK/parameters.js`:

```javascript
export const P = 2147483647; // The Prime Field size
export const CIRCUIT = 18n;  // The exponent 'k' in x^k
export const I = 5n;         // The input 'x'
```

*Change `I` to prove a different input, or `CIRCUIT` to change the complexity of the calculation.*

## 📂 Project Structure

-   **`SARK/`**: The Core Protocol
    -   `veronicaSetup.js`: Generates the Trusted Setup.
    -   `prover.js`: Executes the circuit and creates the proof.
    -   `verify.js`: Checks the validity of the proof.
    -   `commonSetup.js`: Shared logic for polynomial setup.
-   **`utils/`**: The Math Engine
    -   `finitefield.js`: Implementation of finite field arithmetic ($GF(P)$).
    -   `polynomial.js`: Polynomial math (Evaluation, Interpolation, Division).
    -   `circuit.js`: Compiles the $x^k$ logic into a flat list of gates.

---

Happy Hacking! ✨
