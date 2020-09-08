import 'source-map-support'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { updateSectionStatus, querySection } from '../../../businessLogic/section'
import { SectionDoc,SectionStatus } from '../../../models/doc/SectionDoc'

export const handler:APIGatewayProxyHandler = async(event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult>=>{
    console.log('Handling patchSection event', event);

    const sectionId = event.pathParameters.sectionId;
    console.log(`sectionId: ${sectionId}`);

    const parseBody = JSON.parse(event.body)
    console.log('parsed http body:', parseBody)

    try{
        await updateSectionStatus(sectionId, parseBody.statusNum)
        console.log('patch section status successfully')
        const section:SectionDoc = await querySection(sectionId)
        console.log(`section: `, section)
        return {
            statusCode: 200,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                ...section,
                secStatus:SectionStatus[section.secStatus]
            })
        }
    }catch(err){
        console.log('error on patchSectionStatus event: ', err.message)
        return {
            statusCode: 500,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body:err.message
        }
    }
}