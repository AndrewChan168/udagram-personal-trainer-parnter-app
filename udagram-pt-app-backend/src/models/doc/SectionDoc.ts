export enum SectionStatus {
    WAVIED = 0,
    PENDING = 1,
    APPROVED = 2,
    ENDED = 3,
}

export interface SectionDoc {
    sectionId: string,
    weekNum: string,
    trainerId: string,
    trainerName: string,
    createrId: string,
    createrName: string,
    startDateTime: string,
    endDateTime: string,
    place: string,
    status: SectionStatus
}