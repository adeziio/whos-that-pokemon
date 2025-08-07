export type Region = 'Kanto' | 'Johto' | 'Hoenn';
export type RegionOrEmpty = Region | '';

export type CollectedData = {
    kanto: number[];
    johto: number[];
    hoenn: number[];
};
