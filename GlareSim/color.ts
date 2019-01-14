module GlareSim {
    export class Color {
        public R: number;
        public G: number;
        public B: number;
        public A: number;

        constructor(R: number, G: number, B: number, A: number){
            this.R = R;
            this.G = G;
            this.B = B;            
            this.A = A;
        }

        public Perturb(magnitude: number) : Color {
            return new Color(
                this.Clamp(this.R + magnitude * Math.random()),
                this.Clamp(this.G + magnitude * Math.random()),
                this.Clamp(this.B + magnitude * Math.random()),
                this.A);
        }

        private Clamp(num: number) : number {
            return Math.min(Math.max(num, 0), 1);
        };
    }
}