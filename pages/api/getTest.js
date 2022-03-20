// Next.js API route support: https://nextjs.org/docs/api-routes/introduction


const { firestore } = require('../../server/firebase')

const randomInt = ( m, n) => {
  return Math.random() * (m - n) + n
}

const getTest = async () => {
    const collection = firestore.collection('Location-Set')
    const limit = [10 , 15]
    const index = Math.round(Math.random())
    const query = collection.where('set', '==', false).limit(limit[index])
    const docsSnap = await query.get().catch( error => {throw error})
    const random = Math.floor(randomInt(1, docsSnap.size)) - 1
    return {
      count: docsSnap.size,
      doc: docsSnap.size > 0 ? docsSnap.docs[random].data() : null,
      id: docsSnap.size > 0 ? docsSnap.docs[random].id : null
    }
}


export default async function handler(req, res) {

  try {
    const test = await getTest()
    res.status(200).json(test)
  } catch(error) {
    console.log(error)
    res.status(200).json()
  }

  
}
