module GlareSim {
    export type UiMeshMaker = (geometry: Geometry) => any;
    export type UiMeshVertexColorSetter = (mesh:any, vertexId: number, color: Color) => void;
    export type UiMeshXYPositionSetter = (mesh:any, x: number, y: number) => void;
    export type UiMeshZRotationSetter = (mesh:any, theta: number) => void;
    export type UiGearMeshMetadataSetter = (mesh:any, gameGear: GameGear) => void;
    
    export class GameGear {
        private Mesh: any; // BABYLON.Mesh

        private SetVertexColor: UiMeshVertexColorSetter;
        private firstGearVertexId: number;
        private lastGearVertexId: number;

        private currentAxisAngle: number;
        private axisAngleIncrement: number;
        private currentPegSpec: PegSpec;

        private defaultPegSpec: PegSpec;

        private SetMeshPosition: UiMeshXYPositionSetter;
        private SetMeshRotation: UiMeshZRotationSetter;

        public Type: string = "GameGear";
        public CurrentPeg: GamePeg;
        public Radius: number;

        constructor(
            gearIntrinsics: HollowGearIntrinsics,
            defaultPegSpec: PegSpec,
            uiMeshMaker: UiMeshMaker,
            uiVertexColorSetter: UiMeshVertexColorSetter,
            uiPositionSetter: UiMeshXYPositionSetter,
            uiRotationSetter: UiMeshZRotationSetter,
            uiMeshMetadataSetter: UiGearMeshMetadataSetter) {
                
            var gearMeshGen = new HollowGearMeshGenerator(gearIntrinsics, new Color(0.2, 0.7, 1, 1));

            this.firstGearVertexId = gearMeshGen.FirstGearVertex;
            this.lastGearVertexId = gearMeshGen.LastGearVertex

            var gearGeometry = gearMeshGen.GenerateGeometry();           
            this.Mesh = uiMeshMaker(gearGeometry);

            this.SetVertexColor = uiVertexColorSetter;
            this.SetMeshPosition = uiPositionSetter;
            this.SetMeshRotation = uiRotationSetter;

            uiMeshMetadataSetter(this.Mesh, this);

            // deep copy default position
            this.defaultPegSpec = new PegSpec();
            this.defaultPegSpec.x = defaultPegSpec.x;
            this.defaultPegSpec.y = defaultPegSpec.y;
            this.defaultPegSpec.axisAngle = 0;
            this.SetToPegPosition(this.defaultPegSpec);

            this.currentAxisAngle = 0;
            this.SetMeshRotation(this.Mesh, this.currentAxisAngle);
            this.axisAngleIncrement = (2 * Math.PI) / gearIntrinsics.ToothCount;
            
            this.Radius = gearIntrinsics.OuterRadius;

            this.CurrentPeg = null;
        }

        public SetGearColor(color: Color): void {
            this.SetVertexRangeColor(this.firstGearVertexId, this.lastGearVertexId, color, 0.3);
        }

        public RemoveFromBoard(): void {
            if (this.CurrentPeg != null) {
                this.CurrentPeg.CurrentGear = null;
                this.CurrentPeg = null;
                this.SetToPegPosition(this.defaultPegSpec);
            }
        }

        public PlaceAtPeg(peg: GamePeg): void {
            if (this.CurrentPeg != null) {
                this.CurrentPeg.CurrentGear = null;
            }
            this.CurrentPeg = peg;
            this.CurrentPeg.CurrentGear = this;
            this.SetToPegPosition(peg.Spec);
        }

        public SpinOneClick(clockwise: boolean): void {
            this.SpinByAngle(this.axisAngleIncrement, clockwise);
        }

        public SpinByAngle(angle: number, clockwise: boolean): void {
            this.currentAxisAngle += (angle * (clockwise ? 1 : -1));
            this.SetMeshRotation(this.Mesh, this.currentAxisAngle);

            this.OnExtrinsicsUpdate();
        }

        public MoveDefaultPositionHorizontally(leftwards: boolean, setGearPosition: boolean): void {
            this.defaultPegSpec.x += leftwards ? -1 : 1;
            if (setGearPosition) {
                this.SetToPegPosition(this.defaultPegSpec);
            }
        }

        private SetToPegPosition(pegSpec: PegSpec): void {
            this.SetMeshPosition(this.Mesh, pegSpec.x, pegSpec.y);
            this.currentPegSpec = pegSpec;

            this.OnExtrinsicsUpdate();
        }

        private OnExtrinsicsUpdate() {
            // TODO check for game solved?
        }

        private SetVertexRangeColor(start: number, end: number, color: Color, colorPerturbation: number = 0): void {
            for (var i = start; i <= end; i++) {
                if (i >= 0) {
                    this.SetVertexColor(this.Mesh, i, color.Perturb(colorPerturbation));
                }
            }
        }        
    }
}