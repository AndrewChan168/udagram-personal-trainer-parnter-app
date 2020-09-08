export enum ParticipationStatus {
    WAVIED = 0,
    PENDING = 1,
    ACCEPTED = 2,
    APPROVED = 3,
    PAID = 4,
}

export type ParticipationStatusString = keyof typeof ParticipationStatus;

export interface ParticipationDoc {
    participationId: string,
    weekNum: string,
    sectionId: string,
    personId: string,
    personName: string,
    startDateTime: string,
    endDateTime: string,
    particiStatus: ParticipationStatus,
}