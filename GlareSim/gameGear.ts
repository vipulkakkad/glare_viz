module GlareSim {
    export type UiMeshMaker = (geometry: Geometry) => any;
    export type UiMeshVertexColorSetter = (mesh:any, vertexId: number, color: Color) => void;
    export type UiMeshPositionSetter = (mesh:any, x: number, y: number) => void;
    export type UiGearMeshMetadataSetter = (mesh:any, gameGear: GameGear) => void;
    
    export class GameGear {
        private Mesh: any; // BABYLON.Mesh

        private SetVertexColor: UiMeshVertexColorSetter;
        private firstWindowVertexId: number;
        private lastWindowVertexId: number;
        private firstGearVertexId: number;
        private lastGearVertexId: number;

        private defaultPegSpec: PegSpec;

        private SetMeshPosition: UiMeshPositionSetter;

        public Type: string = "GameGear";

        constructor(
            gearIntrinsics: GearIntrinsics,
            defaultPegSpec: PegSpec,
            uiMeshMaker: UiMeshMaker,
            uiVertexColorSetter: UiMeshVertexColorSetter,
            uiPositionSetter: UiMeshPositionSetter,
            uiMeshMetadataSetter: UiGearMeshMetadataSetter) {
                
            var gearMeshGen = new GearMeshGenerator(gearIntrinsics, true);

            this.firstWindowVertexId = gearMeshGen.FirstWindowVertex;
            this.lastWindowVertexId = gearMeshGen.LastWindowVertex
            this.firstGearVertexId = gearMeshGen.FirstGearVertex;
            this.lastGearVertexId = gearMeshGen.LastGearVertex

            var gearGeometry = gearMeshGen.GenerateGeometry();           
            this.Mesh = uiMeshMaker(gearGeometry);

            this.SetVertexColor = uiVertexColorSetter;
            this.SetMeshPosition = uiPositionSetter;

            uiMeshMetadataSetter(this.Mesh, this);

            // deep copy default position
            this.defaultPegSpec = new PegSpec();
            this.defaultPegSpec.x = defaultPegSpec.x;
            this.defaultPegSpec.y = defaultPegSpec.y;
            this.defaultPegSpec.axisAngle = 0;

            this.SetToDefaultPosition();
        }

        public SetWindowColor(color: Color): void {
            this.SetVertexRangeColor(this.firstWindowVertexId, this.lastWindowVertexId, color);
        }

        public SetGearColor(color: Color): void {
            this.SetVertexRangeColor(this.firstGearVertexId, this.lastGearVertexId, color);
        }

        public SetToDefaultPosition(): void {
            this.SetToPegPosition(this.defaultPegSpec);
        }

        public SetToPegPosition(pegSpec: PegSpec): void {
            this.SetMeshPosition(this.Mesh, pegSpec.x, pegSpec.y);
        }

        private SetVertexRangeColor(start: number, end: number, color: Color): void {
            for (var i = start; i <= end; i++) {
                if (i >= 0) {
                    this.SetVertexColor(this.Mesh, i, color);
                }
            }
        }        
    }
}