import * as firebaseAdmin from 'firebase-admin';

if (!firebaseAdmin.apps.length) {
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/gm, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    }),
   /*  databaseURL: 'https://YOUR_PROJECT_ID.firebaseio.com', */
  });
}

const dbAdmin = firebaseAdmin.firestore()
const app = firebaseAdmin.app()



/* firebaseAdmin.auth().setCustomUserClaims("hHXGoLUOSMgtstnrJBcQnWQzTMj1", {
  admin: true,
}) */

export { firebaseAdmin, dbAdmin, app };