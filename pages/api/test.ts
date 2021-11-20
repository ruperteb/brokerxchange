import { firebaseAdmin, dbAdmin } from "../../utils/firebaseAdmin"

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

/* const admin = require('firebase-admin')

const firebaseApp =

 
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: "brokerxchange-253e7",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  }, "app2") */





type Data = {
  response: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

     const changeClaims = async () => {
        await firebaseAdmin.auth().setCustomUserClaims("hHXGoLUOSMgtstnrJBcQnWQzTMj1", {
            admin: false,
        })
    
    } 
    
     changeClaims() 

     firebaseAdmin.auth().getUser("hHXGoLUOSMgtstnrJBcQnWQzTMj1").then((userRecord) => {
        // The claims can be accessed on the user record.
        if(userRecord.customClaims) {
            console.log(userRecord.customClaims);
        }
        
      });
    
     console.log(req.body);

  res.status(200).json({ response: req.body })
}


