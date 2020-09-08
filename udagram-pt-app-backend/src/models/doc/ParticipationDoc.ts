export enum ParticipationStatus {
    WAVIED = 0,
    PENDING = 1,
    ACCEPTED = 2,
    APPROVED = 3,
    PAID = 4,
}

export interface ParticipationDoc {
    participationId: string,
    weekNum: string,
    personId: string,
    personName: string,
    startDateTime: string,
    endDateTime: string,
    status: ParticipationStatus,
}