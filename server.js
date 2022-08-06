const { server } = require('./socket')
require('dotenv').config()
const port = process.env.PORT || 5000

server.listen(port, () => {
    console.log(port, '번으로 서버가 연결되었습니다.')
    console.log(`http://localhost:${port}`)
})
