module GlareSim {
    export class GearIntrinsics {
        constructor(gearSpec: GearSpec, height: number, notchAngles: number[]) {
            this.Radius = gearSpec.Radius;
            this.ToothAmplitude = gearSpec.ToothAmplitude;
            this.ToothCount = gearSpec.ToothCount;

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