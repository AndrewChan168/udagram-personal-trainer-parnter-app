import 'source-map-support'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { ParticipationDoc, ParticipationStatus } from '../../../models/doc/ParticipationDoc'
import { queryParticipation } from '../../../businessLogic/participation'

export const handler:APIGatewayProxyHandler = async(event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult>=>{
    console.log('Handling getParticipation event', event);

    const participationId = event.pathParameters.participationId;
    console.log(`participationId: ${participationId}`);

    try{
        const particip:ParticipationDoc = await queryParticipation(participationId)
        console.log('get participation successfully by participationId: ', participationId)
        return {
            statusCode: 200,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                ...particip,
                particiStatus:ParticipationStatus[particip.particiStatus]
            })
        }
    }catch(err){
        console.log('error on getPerson event: ', err.message)
        return {
            statusCode: 500,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body:err.message
        }
    }   
}