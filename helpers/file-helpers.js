const fs = require('fs')
const { ImgurClient } = require('imgur')
const client = new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID })

// 把檔案上傳到imgur並回傳路徑
const imgurFileHandler = async file => {
  if (!file) return null
  try {
    const img = await client.upload({
      image: fs.createReadStream(file.path),
      type: 'stream'
    })
    return img ? img.data.link : null
  } catch (err) {
    console.error(err)
    throw err
  }
}
module.exports = {
  imgurFileHandler
}
