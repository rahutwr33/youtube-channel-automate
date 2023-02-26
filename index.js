const axios = require("axios")
const cheerio = require('cheerio');
const canvas = require('./downloadImage');
var fs = require('fs');
const path = require("path");

const main = async () =>{
    try {
        const folderName = path.join(__dirname+'/data.json')
        const news = await axios.get('https://www.ndtv.com/world-news#pfrom=home-ndtv_mainnavgation');
        const node = String(news.data)
        const $ = cheerio.load(node)
        const worldNewsLinksSet = new Set();
        $('a').each( (index, value) => {
            let link = $(value).attr('href');
            if(String(link).includes('https://www.ndtv.com/world-news/') && !(String(link).includes('page-'))){
                worldNewsLinksSet.add(link)
            }
         });
        const worldNewsLinks = [...worldNewsLinksSet];
        const data = worldNewsLinks.map(async v =>  {
            return await axios.get(v)
        })
        let newstitle = []
        await Promise.all(data).then((values) => {
            let data = values.map(v=> {
                return {data: v.data, url: v.config.url}
            });
            data = data.map(c=>{
                const dom = cheerio.load(c.data);
                let tag = dom("meta[name='keywords']").attr("content")
                tag = tag.split(',')
                dom('script,i, .externalVideo, .jiosaavn-widget, meta, #jiosaavn-widget').remove()
                let title = dom('.sp-ttl-wrp h1').contents().first().text()
                title = String(title).trim().replace(/['\"]+/g, '');
                const summry = dom('.sp-descp').contents().first().text()
                const description = dom('#ins_storybody').contents().text();
                const image = dom('#story_image_main').attr('src');
                const checkduplicate = newstitle.filter(v=> v.title == title);
                if(!checkduplicate.length){
                    newstitle.push({
                        url:String(c.url).trim(),
                        title,
                        summry,
                        description,
                        image,
                        tag
                    })
                }
            })            
        })
        const imageprocess = newstitle.map(async (v,i)=>{
            const d = await canvas.downLoadImage(v, i);
            return d
        })
        const foldersData = []
        Promise.all(imageprocess).then(src=>{
            foldersData.push(...src);
        }).then(()=>{
            const data = {
                newstitle,
                foldersData
            }
            var jsonContent = JSON.stringify(data);
            fs.writeFile('data.json', jsonContent, 'utf8', (err) => {
                if (err) {
                    console.log("An error occured while writing JSON Object to File.");
                    return console.log(err);
                }
                console.log("JSON file has been saved.");
            })
        })
    } catch (error) {
        console.log('error', error)
    }
}


main()