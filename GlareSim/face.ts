module GlareSim {
    export class Face {
        public A: number;
        public B: number;
        public C: number;
        public Color: Color;

        constructor(A: number, B: number, C: number, color: Color){
            this.A = A;
            this.B = B;
            this.C = C;

            this.Color = color;
        }
    }
}