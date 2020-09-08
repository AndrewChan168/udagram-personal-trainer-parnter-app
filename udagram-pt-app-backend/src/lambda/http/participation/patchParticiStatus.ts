import 'source-map-support'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { updateParticipationStatus,queryParticipation } from '../../../businessLogic/participation'
import { ParticipationDoc,ParticipationStatus } from '../../../models/doc/ParticipationDoc'

export const handler:APIGatewayProxyHandler = async(event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult>=>{
    console.log('Handling patchParticipation event', event)

    const participationId = event.pathParameters.participationId
    console.log(`participationId: ${participationId}`)

    const parseBody = JSON.parse(event.body)
    console.log('parsed http body:', parseBody)

    try{
        await updateParticipationStatus(participationId, parseBody.statusNum)
        console.log('patch participation status successfully')
        const participation:ParticipationDoc = await queryParticipation(participationId)
        console.log(`participation: `, participation)
        return {
            statusCode: 200,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                ...participation,
                particiStatus:ParticipationStatus[participation.particiStatus]
            })
        }
    }catch(err){
        console.log('error on patchParticiStatus event: ', err.message)
        return {
            statusCode: 500,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body:err.message
        }
    }
}