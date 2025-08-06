export type Difficulty = 'Gen1' | 'Gen2' | 'Gen3';
export type DifficultyOrEmpty = Difficulty | '';

export type CollectedData = {
    gen1: number[];
    gen2: number[];
    gen3: number[];
};
