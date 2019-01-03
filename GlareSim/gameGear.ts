module GlareSim {
    export type UiMeshMaker = (geometry: Geometry) => any;
    export type UiMeshVertexColorSetter = (mesh:any, vertexId: number, color: Color) => void;
    export type UiMeshPositionSetter = (mesh:any, x: number, y: number) => void;
    
    export class GameGear {
        private Mesh: any; // BABYLON.Mesh

        private SetVertexColor: UiMeshVertexColorSetter;
        private firstCircleVertexId: number;
        private lastCircleVertexId: number;

        private SetMeshPosition: UiMeshPositionSetter;

        constructor(
            gearIntrinsics: GearIntrinsics,
            uiMeshMaker: UiMeshMaker,
            uiVertexColorSetter: UiMeshVertexColorSetter,
            uiPositionSetter: UiMeshPositionSetter) {
                
            var gearMeshGen = new GlareSim.GearMeshGenerator(gearIntrinsics);

            this.firstCircleVertexId = gearMeshGen.FirstCircleVertex;
            this.lastCircleVertexId = gearMeshGen.LastCircleVertex
            var gearGeometry = gearMeshGen.GenerateGeometry();
            
            this.Mesh = uiMeshMaker(gearGeometry);

            this.SetVertexColor = uiVertexColorSetter;
            this.SetMeshPosition = uiPositionSetter;
        }

        public SetCircleColor(color: Color): void {
            for (var i = this.firstCircleVertexId; i <= this.lastCircleVertexId; i++) {
                this.SetVertexColor(this.Mesh, i, color);
            }
        }

        public SetPosition(x: number, y: number): void {
            this.SetMeshPosition(this.Mesh, x, y);
        }
    }
}