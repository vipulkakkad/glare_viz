module GlareSim {
    export class GameParameters {
        constructor(jsonStr: string) {
            let jsonObj: any = JSON.parse(jsonStr);
            for (let prop in jsonObj) {
                this[prop] = jsonObj[prop];
            }
        }

        public pegs: PegSpec[];
        public xMax: number;
        public yMax: number;
        public pegRadius: number;
        public boardHeight: number;
        public gearHeight: number;
        public startingPegIndex: number;
        public toothAmplitude: number;

        public gearIntrinsics: HollowGearIntrinsics[];
    }

    export class PegSpec {
        x: number;
        y: number;
        axisAngle: number;
        expectedGearRadius: number;
        isPositiveChirality: boolean;
    }
}