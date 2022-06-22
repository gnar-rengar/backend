const mongoose = require('mongoose')
require('dotenv').config()
const connect = () => {
	const mongooseId = process.env.MONGO_ID
	const mongoosePw = process.env.MONGO_PWD
	mongoose
		.connect(
			`mongodb+srv://${mongooseId}:${mongoosePw}@duoplz.xgoaptf.mongodb.net/DuoPlz?retryWrites=true&w=majority`,
			{ ignoreUndefined: true }
		)
		.catch((err) => {
			if (err) throw err
		})
}
console.log('데이터베이스에 연결되었습니다.')

module.exports = connect
