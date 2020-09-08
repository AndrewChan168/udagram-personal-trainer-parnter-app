import 'source-map-support'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { ParticipationDoc, ParticipationStatus } from '../../../models/doc/ParticipationDoc'
import { queryParticipationsByPerson } from '../../../businessLogic/participation'

export const handler:APIGatewayProxyHandler = async(event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult>=>{
    console.log('Handling getParticiByPerson event', event)

    const personId = event.pathParameters.personId
    console.log(`personId: ${personId}`)

    const week = event.pathParameters.week
    console.log(`WeekNum: ${week}`)

    try{
        const participationDocs:ParticipationDoc[] = await queryParticipationsByPerson(personId,week)
        const participations = [...participationDocs].map((participation)=>{
            return {
                ...participation,
                particiStatus:ParticipationStatus[participation.particiStatus]
            }
        })
        console.log('get particiption successfully by personId: ', personId)
        return {
            statusCode: 200,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                participations
            })
        }
    }catch(err){
        console.log('error on getParticiByPerson event: ', err.message)
        return {
            statusCode: 500,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body:err.message
        }
    }
}