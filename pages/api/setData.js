
const { firestore } = require('../../server/firebase')

const set = async (content, count) => {
    const collection = firestore.collection('Location-Set')
    console.log(count + 1)
    const ref = await collection.add({
        content: content,
        set: false,
        answers: []
    }).catch( error => console.log(error.code))
    
    return ref
}


export default async function handler(req, res) {
const content = require('../../server/sentences.json').map(sentence => sentence)

    for (var index = 0; index < content.length; index++) {
        await set(content[index], index)
    }

    res.status(200).json()
}
