export enum SectionStatus {
    WAVIED = 0,
    PENDING = 1,
    APPROVED = 2,
    ENDED = 3,
}

export interface SectionDoc {
    sectionId: string,
    week: string,
    trainerId: string,
    trainerName: string,
    creatorId: string,
    creatorName: string,
    startDateTime: string,
    endDateTime: string,
    place: string,
    status: SectionStatus
}