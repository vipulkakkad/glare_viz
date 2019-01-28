module GlareSim {
    export class GearIntrinsics {
        constructor(gearSpec: GearSpec, height: number, windowRadius: number, notchAngles: number[]) {
            this.Radius = gearSpec.Radius;
            this.ToothAmplitude = gearSpec.ToothAmplitude;
            this.ToothCount = gearSpec.ToothCount;

            this.Height = height;
            this.WindowRadius = windowRadius;
            this.NotchAngles = notchAngles;
        }

        Radius: number;
        ToothAmplitude: number;
        ToothCount: number;
        Height: number;
        WindowRadius: number;
        NotchAngles: number[];
    }
}