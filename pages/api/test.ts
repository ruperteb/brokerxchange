/* import { firebaseAdmin, dbAdmin } from "../../utils/firebaseAdmin" */

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

const admin = require('firebase-admin')

const firebaseApp =
//@ts-ignore
  global.firebaseApp ??
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "brokerxchange-253e7",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  }, "app2")

// store on global object so we can reuse it if we attempt
// to initialize the app again
//@ts-ignore
global.firebaseApp = firebaseApp

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    const changeClaims = async () => {
        await admin.auth().setCustomUserClaims("hHXGoLUOSMgtstnrJBcQnWQzTMj1", {
            admin: "cat",
        })
    
    }
    
    changeClaims()
    
    console.log("1")

  res.status(200).json({ name: 'John Doe' })
}


