module GlareSim {
    export class GameParameters {
        constructor(jsonStr: string) {
            let jsonObj: any = JSON.parse(jsonStr);
            for (let prop in jsonObj) {
                this[prop] = jsonObj[prop];
            }
        }

        public gears: GearSpec[];
        public pegPositions: GamePegPosition[];
        public xMax: number;
        public yMax: number;
        public pegRadius: number;
        public boardHeight: number;
        public gearHeight: number;
    }

    export class GearSpec {
        Radius: number;
        ToothCount: number;
        ToothAmplitude: number;
    }

    export class GamePegPosition {
        x: number;
        y: number;
    }
}