import { firebaseAdmin, dbAdmin } from "../../utils/firebaseAdmin"

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'


type Data = {
    response: string
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    return new Promise((resolve , reject) => {
        
            firebaseAdmin.auth().setCustomUserClaims(req.body.uid, {
                admin: true,
                other: req.body.value
            })
    
        
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
    
}


