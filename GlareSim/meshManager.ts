module GlareSim {
    export class MeshManager {
        Meshes: any[];
        nextMeshId: number;

        constructor() {
            this.Meshes = [];
            this.nextMeshId = 0;
        }

        ClaimAndGetMeshId() : number {
            return this.nextMeshId++;
        }

        SetMeshForMeshId(meshId: number, mesh: any) {            
            this.Meshes[meshId] = mesh;
        }
    }
}