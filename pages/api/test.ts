import { firebaseAdmin, dbAdmin } from "../../utils/firebaseAdmin"

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

/*
const admin = require('firebase-admin')
if (!admin.apps.length) {
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: "brokerxchange-253e7",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
})
} */



type Data = {
    response: string
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    return new Promise((resolve , reject) => {
        
            firebaseAdmin.auth().setCustomUserClaims(req.body.uid, {
                admin: "123",
                other: req.body.value
            })
    
        
    
      
             // set of operations
         .then(() => {
                res.status(200).json({response: "success"})
                res.end()
                resolve("success")
            })
            .catch((e) => {
                res.status(405).json(e)
                res.end()
                resolve("error")
            })
    })
    

    

    /* const checkCustomClaims = async () => {

        await firebaseAdmin.auth().getUser("hHXGoLUOSMgtstnrJBcQnWQzTMj1").then((userRecord: any) => {
    
            if (userRecord.customClaims) {
                console.log(userRecord.customClaims);
            }

        });
    }

    checkCustomClaims() */

    /* console.log(req.body);

    res.status(200).json({ response: req.body }) */
}


