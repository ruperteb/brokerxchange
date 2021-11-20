/* import { firebaseAdmin, dbAdmin } from "../../utils/firebaseAdmin" */

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

const admin = require('firebase-admin')

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: "brokerxchange-253e7",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
}, "adminApp")




//@ts-ignore
global.firebaseApp = firebaseApp


type Data = {
    response: string
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    const changeClaims = async () => {
        await admin.auth().setCustomUserClaims("hHXGoLUOSMgtstnrJBcQnWQzTMj1", {
            admin: false,
            other: true
        })

    }

    changeClaims()

    const checkCustomClaims = async () => {

        await admin.auth().getUser("hHXGoLUOSMgtstnrJBcQnWQzTMj1").then((userRecord: any) => {
            // The claims can be accessed on the user record.
            if (userRecord.customClaims) {
                console.log(userRecord.customClaims);
            }

        });
    }

    checkCustomClaims()

    console.log(req.body);

    res.status(200).json({ response: req.body })
}


