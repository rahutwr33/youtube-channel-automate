const download = require('image-downloader');
var fs = require('fs')
const downLoadImage = (src, index) => {
  return new Promise(async (resolve, reject) => {
    let img = src.image;
    const url = src.url
    const folderName = __dirname + '/img/' + String(url).trim().substring(url.length - 1, url.length - 7);
    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
      }
      const options = {
        url: img,
        dest: folderName,
      };
    const response = await download.image(options);
      resolve({index,success:true, folderName: response.filename, url});
    } catch (error) {
      resolve({index,success:false, folderName: '', url})
    }
  })
}

module.exports.downLoadImage = downLoadImage