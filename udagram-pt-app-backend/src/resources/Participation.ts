import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { ParticipationDoc, ParticipationStatus } from '../models/doc/ParticipationDoc'

type ParticipationStatusString = keyof typeof ParticipationStatus;

class Participation{
    constructor(
        private readonly docClient: DocumentClient,
        private readonly tableName: string,
        private readonly sectionIdIndex: string,
        private readonly personIdIndex: string,
        private readonly weekNumIndex:string,
    ){}

    async createParticipation(participation:ParticipationDoc){
        await this.docClient.put({
            TableName: this.tableName,
            Item:participation
        }).promise()
    }

    async getParticipationByParticipationId(participationId:string):Promise<ParticipationDoc>{
        const result = await this.docClient.get({
            TableName: this.tableName,
            Key: {
                participationId: participationId
            }
        }).promise()

        return result.Item as ParticipationDoc
    }

    async getParticipationsBySectionId(sectionId:string):Promise<ParticipationDoc[]>{
        const result = await this.docClient.query({
            TableName: this.tableName,
            IndexName: this.sectionIdIndex,
            KeyConditionExpression: 'sectionId=:sectionId',
            ExpressionAttributeValues: {
                ':sectionId':sectionId
            }
        }).promise()

        return result.Items as ParticipationDoc[]
    }

    async getParticipationsByPersonId(personId:string):Promise<ParticipationDoc[]>{
        const result = await this.docClient.query({
            TableName: this.tableName,
            IndexName: this.personIdIndex,
            KeyConditionExpression: 'personId=:personId',
            ExpressionAttributeValues: {
                ':personId':personId,
            }
        }).promise()

        return result.Items as ParticipationDoc[]
    }

    async getParticipationsByPersonIdInWeeksRange(personId:string, startWeek:string, endWeek:string):Promise<ParticipationDoc[]>{
        const result = await this.docClient.query({
            TableName: this.tableName,
            IndexName: this.weekNumIndex,
            KeyConditionExpression: 'personId=:personId and weeknum>=:startWeek and weeknum<=:endWeek',
            ExpressionAttributeValues: {
                ':personId':personId,
                ':startWeek':startWeek,
                ':endWeek':endWeek,
            }
        }).promise()

        return result.Items as ParticipationDoc[]
    }

    async getParticipationsInWeeksRange(startWeek:string, endWeek:string):Promise<ParticipationDoc[]>{
        const result = await this.docClient.query({
            TableName: this.tableName,
            IndexName: this.weekNumIndex,
            KeyConditionExpression: 'weeknum>=:startWeek and weeknum<=:endWeek',
            ExpressionAttributeValues: {
                ':startWeek':startWeek,
                ':endWeek':endWeek,
            }
        }).promise()

        return result.Items as ParticipationDoc[]
    }

    async updateParticipationStatus(participationId:string, status:ParticipationStatusString){
        const statusNum = ParticipationStatus[status];
        await this.docClient.update({
            TableName: this.tableName,
            Key: {"participationId":participationId},
            UpdateExpression: "set status=:status",
            ExpressionAttributeValues: {
                ":status":statusNum
            },
            ReturnValues:"UPDATED_NEW"
        }).promise()
    }
}

export const participation:Participation = new Participation(
    new AWS.DynamoDB.DocumentClient(),
    process.env.PERSONS_TABLE,
    process.env.SECTION_ID_INDEX,
    process.env.PERSON_ID_INDEX,
    process.env.WEEK_NUM_INDEX,
)