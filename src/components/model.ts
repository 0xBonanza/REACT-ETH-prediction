export interface Instance{
    commitment: number;
    startStamp: number;
    lockStamp: number;
    endStamp: number;
    settlement: boolean;
    winnersCount: number;
    instanceValue: number;
    closingPrice: number;
    creator: string
}