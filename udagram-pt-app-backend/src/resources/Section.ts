import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { SectionDoc, SectionStatusString } from '../models/doc/SectionDoc'

class Section{
    constructor(
        private readonly docClient: DocumentClient,
        private readonly tableName: string,
        private readonly weekNumIndex:string,
        private readonly trainerIdIndex: string,
        private readonly createrIdIndex:string,
    ){}

    async createSection(section:SectionDoc){
        await this.docClient.put({
            TableName: this.tableName,
            Item:section
        }).promise()
    }

    async getSectionBySectionId(sectionId:string):Promise<SectionDoc>{
        const result = await this.docClient.get({
            TableName: this.tableName,
            Key: {
                sectionId: sectionId
            }
        }).promise()

        return result.Item as SectionDoc
    }

    async getSectionsInWeeksRange(startWeek:string, endWeek:string):Promise<SectionDoc[]>{
        const result = await this.docClient.query({
            TableName: this.tableName,
            IndexName: this.weekNumIndex,
            KeyConditionExpression: 'weeknum>=:startWeek and weeknum<=:endWeek',
            ExpressionAttributeValues: {
                ':startWeek':startWeek,
                ':endWeek':endWeek,
            }
        }).promise()

        return result.Items as SectionDoc[]
    }

    async getSectionsByTrainerId(trainerId:string): Promise<SectionDoc[]>{
        const result = await this.docClient.query({
            TableName: this.tableName,
            IndexName: this.trainerIdIndex,
            KeyConditionExpression: 'trainerId=:trainerId',
            ExpressionAttributeValues: {
                ':trainerId':trainerId,
            }
        }).promise()

        return result.Items as SectionDoc[]
    }

    async getSectionsByTrainerIdInWeeksRange(trainerId:string, weekNum:string): Promise<SectionDoc[]>{
        const result = await this.docClient.query({
            TableName: this.tableName,
            IndexName: this.trainerIdIndex,
            KeyConditionExpression: 'trainerId=:trainerId and weekNum=:weekNum',
            ExpressionAttributeValues: {
                ':trainerId':trainerId,
                ':weekNum':weekNum,
            }
        }).promise()

        return result.Items as SectionDoc[]
    }

    async getSectionsByCreaterId(createrId:string): Promise<SectionDoc[]>{
        const result = await this.docClient.query({
            TableName: this.tableName,
            IndexName: this.createrIdIndex,
            KeyConditionExpression: 'createrId=:createrId',
            ExpressionAttributeValues: {
                ':createrId':createrId,
            }
        }).promise()

        return result.Items as SectionDoc[]
    }

    async getSectionsByCreaterIdInWeeksRange(createrId:string, weekNum:string): Promise<SectionDoc[]>{
        const result = await this.docClient.query({
            TableName: this.tableName,
            IndexName: this.createrIdIndex,
            KeyConditionExpression: 'createrId=:createrId and weekNum=:weekNum',
            ExpressionAttributeValues: {
                ':createrId':createrId,
                ':weekNum':weekNum,
            }
        }).promise()

        return result.Items as SectionDoc[]
    }

    async updateSectionStatus(sectionId:string, statusNum:SectionStatusString){
        console.log(`section.updateSectionStatus(sectionId:${sectionId}, statusNum:${statusNum})`)
        await this.docClient.update({
            TableName: this.tableName,
            Key: {"sectionId":sectionId},
            UpdateExpression: "set secStatus=:secStatus",
            ExpressionAttributeValues: {
                ":secStatus":statusNum
            },
            ReturnValues:"ALL_NEW"
        }).promise()
    }
}

export const section:Section = new Section(
    new AWS.DynamoDB.DocumentClient(),
    process.env.SECTIONS_TABLE,
    process.env.WEEK_NUM_INDEX,
    process.env.TRAINER_ID_INDEX,
    process.env.CREATER_ID_INDEX,
)