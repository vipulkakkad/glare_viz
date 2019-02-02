module GlareSim {
    export class GearIntrinsics {
        constructor(
            radius: number,
            toothAmplitude: number,
            toothCount: number,
            height: number, 
            notchAngles: number[]) {
            this.Radius = radius;
            this.ToothAmplitude = toothAmplitude;
            this.ToothCount = toothCount;

            this.Height = height;
            this.NotchAngles = notchAngles;
        }

        Radius: number;
        ToothAmplitude: number;
        ToothCount: number;
        Height: number;
        NotchAngles: number[];
    }
}