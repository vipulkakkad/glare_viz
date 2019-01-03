module GlareSim {
    export class Vertex {
        public x: number;
        public y: number;
        public z: number;

        public Color: Color;

        constructor(X: number, Y: number, Z: number, color :Color){
            this.x = X;
            this.y = Y;
            this.z = Z;

            this.Color = color;
        }
    }
}