/*
SARK implementation for a hardcoded circuit y=x^5 as done in one of best paper I have ever read: https://ebuchman.github.io/pdf/snarks.pdf. I will try to keep this project as modular and reader friendly as possible. (I can't promise though)


Computation to be done: y = x^5

Circuit:
  C₁   C₁        C₁        C₁        C₁
    \ /         /         /         /
    (x)        /         /         /
     |        /         /         /
     C₂      /         /         /
      \     /         /         /
       \   /         /         /
        (x)         /         /
         |         /         /
         C₃       /         /
          \      /         /
           \    /         /
            (x)          /
             |          /
             C₄        /
              \       /
               \     /
                (x)
                 |
                 C₅
                 

Where each gate multiplies the previous result by x:
- C₁: x (input)
- C₂: x * x = x²
- C₃: x² * x = x³
- C₄: x³ * x = x⁴
- C₅: x⁴ * x = x⁵ = y
*/

//Input Value
let C1 = 100;
