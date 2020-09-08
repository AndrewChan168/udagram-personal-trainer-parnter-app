import * as uuid from 'uuid'

import * as errors from '../errors/errors'

import { SectionDoc,SectionStatus,SectionStatusString } from '../models/doc/SectionDoc'
import { section } from '../resources/Section'
import { CreateSectionJson } from '../models/http/createSectionJson'
import { queryPersonName,checkPersonValid } from '../businessLogic/person' 

export async function createSection(createSectionJson:CreateSectionJson):Promise<SectionDoc>{
    const sectionId = uuid.v4()
    let trainerName, createrName

   try{
       trainerName = await queryPersonName(createSectionJson.trainerId)
   }catch(err){
       if (err instanceof errors.NoSuchPersonError) {
           throw new errors.NoSuchPersonError(`No such person was found by trainerId: ${createSectionJson.trainerId}`)
       } else throw err
   }

   try{
        createrName = await queryPersonName(createSectionJson.createrId)
    }catch(err){
        if (err instanceof errors.NoSuchPersonError) {
            throw new errors.NoSuchPersonError(`No such person was found by createrId: ${createSectionJson.createrId}`)
        } else throw err
    }

    const sectionDoc = {
        sectionId,
        ...createSectionJson,
        secStatus: SectionStatus.PENDING,
        trainerName,
        createrName
    } as SectionDoc

    await section.createSection(sectionDoc)

    return sectionDoc
}

export async function querySection(sectionId:string):Promise<SectionDoc>{
    const sectionDoc = await section.getSectionBySectionId(sectionId)
    if (sectionDoc) return sectionDoc
    else throw new errors.NoSuchSectionError(`No such section was found by sectionId: ${sectionId}`)
}

export async function checkSectionValid(sectionId:string):Promise<boolean>{
    const sectionDoc = await section.getSectionBySectionId(sectionId)
    if (sectionDoc) return true
    else return false
}

export async function querySectionsByTrainerId(trainerId:string, week:string):Promise<SectionDoc[]>{
    if(await checkPersonValid(trainerId)) {
        return await(section.getSectionsByTrainerIdInWeeksRange(trainerId, week))
    }
    else throw new errors.NoSuchPersonError(`No such person was found by trainerId: ${trainerId}`)
}

export async function queryAllSectionsByTrainerId(trainerId:string):Promise<SectionDoc[]>{
    if(await checkPersonValid(trainerId)) {
        return await(section.getSectionsByTrainerId(trainerId))
    }
    else throw new errors.NoSuchPersonError(`No such person was found by trainerId: ${trainerId}`)
}

export async function querySectionsByCreaterId(createrId:string, week:string):Promise<SectionDoc[]>{
    if(await checkPersonValid(createrId)) {
        return await(section.getSectionsByCreaterIdInWeeksRange(createrId, week))
    }
    else throw new errors.NoSuchPersonError(`No such person was found by createrId: ${createrId}`)
}

export async function queryAllSectionsByCreaterId(createrId:string):Promise<SectionDoc[]>{
    const isSectionValid = await checkSectionValid(createrId)
    if(isSectionValid) {
        return await(section.getSectionsByCreaterId(createrId))
    }
    else throw new errors.NoSuchPersonError(`No such person was found by createrId: ${createrId}`)
}

export async function updateSectionStatus(sectionId:string, status:SectionStatusString){
    const isSectionValid = await checkSectionValid(sectionId)
    if(isSectionValid) {
        await section.updateSectionStatus(sectionId, status)
    }else throw new errors.NoSuchSectionError(`No such section was found by sectionId: ${sectionId}`)
}