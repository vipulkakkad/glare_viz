module GlareSim {
    export type UiMeshMaker = (geometry: Geometry) => any;
    export type UiMeshVertexColorSetter = (mesh:any, vertexId: number, color: Color) => void;
    export type UiMeshPositionSetter = (mesh:any, x: number, y: number) => void;
    
    export class GameGear {
        private Mesh: any; // BABYLON.Mesh

        private SetVertexColor: UiMeshVertexColorSetter;
        private firstWindowVertexId: number;
        private lastWindowVertexId: number;

        private SetMeshPosition: UiMeshPositionSetter;

        constructor(
            gearIntrinsics: GearIntrinsics,
            uiMeshMaker: UiMeshMaker,
            uiVertexColorSetter: UiMeshVertexColorSetter,
            uiPositionSetter: UiMeshPositionSetter) {
                
            var gearMeshGen = new GlareSim.GearMeshGenerator(gearIntrinsics);

            this.firstWindowVertexId = gearMeshGen.FirstWindowVertex;
            this.lastWindowVertexId = gearMeshGen.LastWindowVertex
            var gearGeometry = gearMeshGen.GenerateGeometry();
            
            this.Mesh = uiMeshMaker(gearGeometry);

            this.SetVertexColor = uiVertexColorSetter;
            this.SetMeshPosition = uiPositionSetter;
        }

        public SetWindowColor(color: Color): void {
            for (var i = this.firstWindowVertexId; i <= this.lastWindowVertexId; i++) {
                this.SetVertexColor(this.Mesh, i, color);
            }
        }

        public SetPosition(x: number, y: number): void {
            this.SetMeshPosition(this.Mesh, x, y);
        }
    }
}