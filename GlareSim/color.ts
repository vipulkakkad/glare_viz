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

        public ToRgbHexString() : string {
            return "#"
                + this.GetHex256StringFrom0to1Float(this.R)
                + this.GetHex256StringFrom0to1Float(this.G)
                + this.GetHex256StringFrom0to1Float(this.B);
        }

        private Clamp(num: number) : number {
            return Math.min(Math.max(num, 0), 1);
        }
        
        private GetHex256StringFrom0to1Float(f: number) : string {
            var hexString = Math.max(0, Math.floor((f * 256) - 0.000001)).toString(16);
            if (hexString.length % 2) {
              hexString = '0' + hexString;
            }

            return hexString;
        }
    }
}