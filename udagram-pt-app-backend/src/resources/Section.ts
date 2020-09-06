import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { SectionDoc, SectionStatus } from '../models/doc/SectionDoc'

type SectionStatusString = keyof typeof SectionStatus;

class Section{
    constructor(
        private readonly docClient: DocumentClient,
        private readonly tableName: string,
        private readonly weekNumIndex:string,
        private readonly trainerIdIndex: string,
        private readonly creatorIdIndex:string,
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

    async getSectionsByTrainerIdInWeeksRange(trainerId:string, startWeek:string, endWeek:string): Promise<SectionDoc[]>{
        const result = await this.docClient.query({
            TableName: this.tableName,
            IndexName: this.trainerIdIndex,
            KeyConditionExpression: 'trainerId=:trainerId and weeknum>=:startWeek and weeknum<=:endWeek',
            ExpressionAttributeValues: {
                ':trainerId':trainerId,
                ':startWeek':startWeek,
                ':endWeek':endWeek,
            }
        }).promise()

        return result.Items as SectionDoc[]
    }

    async getSectionsByCreatorId(creatorId:string): Promise<SectionDoc[]>{
        const result = await this.docClient.query({
            TableName: this.tableName,
            IndexName: this.creatorIdIndex,
            KeyConditionExpression: 'creatorId=:creatorId',
            ExpressionAttributeValues: {
                ':creatorId':creatorId,
            }
        }).promise()

        return result.Items as SectionDoc[]
    }

    async getSectionsByCreatorIdInWeeksRange(creatorId:string, startWeek:string, endWeek:string): Promise<SectionDoc[]>{
        const result = await this.docClient.query({
            TableName: this.tableName,
            IndexName: this.creatorIdIndex,
            KeyConditionExpression: 'creatorId=:creatorId and weeknum>=:startWeek and weeknum<=:endWeek',
            ExpressionAttributeValues: {
                ':creatorId':creatorId,
                ':startWeek':startWeek,
                ':endWeek':endWeek,
            }
        }).promise()

        return result.Items as SectionDoc[]
    }

    async updateSectionStatus(sectionId:string, status:SectionStatusString){
        const statusNum = SectionStatus[status];
        await this.docClient.update({
            TableName: this.tableName,
            Key: {"sectionId":sectionId},
            UpdateExpression: "set status=:status",
            ExpressionAttributeValues: {
                ":status":statusNum
            },
            ReturnValues:"UPDATED_NEW"
        }).promise()
    }
}

export const section:Section = new Section(
    new AWS.DynamoDB.DocumentClient(),
    process.env.SECTIONS_TABLE,
    process.env.WEEK_NUM_INDEX,
    process.env.TRAINER_ID_INDEX,
    process.env.CREATOR_ID_INDEX,
)