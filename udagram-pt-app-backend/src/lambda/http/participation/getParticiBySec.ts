import 'source-map-support'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { ParticipationDoc, ParticipationStatus } from '../../../models/doc/ParticipationDoc'
import { queryParticipationsBySection } from '../../../businessLogic/participation'

export const handler:APIGatewayProxyHandler = async(event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult>=>{
    console.log('Handling getParticiBySec event', event);

    const sectionId = event.pathParameters.sectionId;
    console.log(`sectionId: ${sectionId}`);

    try{
        const participationDocs:ParticipationDoc[] = await queryParticipationsBySection(sectionId)
        const participations = [...participationDocs].map((participation)=>{
            return {
                ...participation,
                particiStatus:ParticipationStatus[participation.particiStatus]
            }
        })
        console.log('get participations successfully by sectionId: ', sectionId)
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
        console.log('error on getParticiBySec event: ', err.message)
        return {
            statusCode: 500,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body:err.message
        }
    }
}