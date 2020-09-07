import 'source-map-support'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { ParticipationDoc } from '../../../models/doc/ParticipationDoc'
import { CreateParticipationJson } from '../../../models/http/createParticipationJson'
import { createParticipation } from '../../../businessLogic/participation'

export const handler:APIGatewayProxyHandler = async(event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult>=>{
    console.log('Handling postParticipation event', event);

    const parseBody = JSON.parse(event.body)
    console.log('parsed http body:', parseBody)

    const createParticipationJson = {
        week:parseBody.week,
        personId:parseBody.personId,
        startDateTime:parseBody.startDateTime,
        endDateTime:parseBody.endDateTime,
    } as CreateParticipationJson

    try{
        const participationDoc:ParticipationDoc = await createParticipation(createParticipationJson)
        console.log('post partiticipation successfully')
        return {
            statusCode: 200,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                ...participationDoc
            })
        }
    }catch(err){
        console.log('error on postPartiticipation event: ', err.message)
        return {
            statusCode: 500,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body:err.message
        }
    }
}