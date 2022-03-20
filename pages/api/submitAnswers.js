
const { firestore } = require('../../server/firebase')

const update = async (id, answers) => {
    const wr = await firestore.doc(`Location-Set/${id}`).update({ answers, set: true }).catch(error => { throw error })
    return wr
}


export default async function handler(req, res) {
    
    const { answers, id } = JSON.parse(req.body)
    if( !answers && !id ) {
        res.status(200).json()
    } else {
        try {
            const wr = await update(id, answers)
            res.status(200).json(true)
        } catch (error) {
            console.log(error)
            res.status(200).json()
        }
    }
    

    
}
