import { firebaseAdmin, dbAdmin } from "../../utils/firebaseAdmin"

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { DocumentData } from "firebase/firestore"


type Data = {
    buildingList: DocumentData
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    return new Promise((resolve, reject) => {
        var buildingList: DocumentData = []
        const buildingRefs = req.body.map((id: DocumentData) => {
            return dbAdmin.doc(`buildings/${id}`)
        })
        dbAdmin.getAll(...buildingRefs)
            .then((docs) => {
                docs.map((doc) => {
                    buildingList.push({ ...doc.data(), id: doc.id })
                })
            })
            .then(()=> {
                buildingList.map(()=> {

                })
            })
            .then(() => {
                res.status(200).json({ buildingList })
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


