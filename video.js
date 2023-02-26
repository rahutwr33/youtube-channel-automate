const path = require('path');
const colors = require('colors');
// const startAndListen = require('./listen');
const { FFCreatorCenter, FFScene, FFText, FFImage, FFCreator } = require('ffcreator');
const Data = require('./data.json');
const { getDesriptionScale } = require('./util');
var fs = require('fs');


const createVideo = async (newstitle, imagePath) => {
    const bg1 = path.join(__dirname, './img/373051/oxytocin-spray_650x400_51459749079.jpg');
    const outputDir = path.join(__dirname, '/media/');
    const cacheDir = path.join(__dirname, './cache/');
    const font = path.join(__dirname, './assets/font/times.ttf');
    const audio = path.join(__dirname, './assets/audio/music.mp3');
    const channelLogo = path.join(__dirname, './assets/channels4_profil.jpeg');
    const title = newstitle.title;
    let summry = newstitle.summry;
    summry = String(summry).trim().replace(/['\"]+/g, '')
    const videoImage = imagePath || ''
   const thanksScale ={
    x : 30,
    y : 220,
    color: "#ffffff"
   }
    const creator = new FFCreator({
        cacheDir, // cache directory
        outputDir, // output directory
        width: 306, // width of the video
        height: 560, // video height
        audio,
        audioLoop: true, // Music loop
        fps: 24, // fps
        threads: 4, // Multi-threaded (fake) parallel rendering
        defaultOutputOptions: null, // ffmpeg output option configuration
    });
    
    const titleScene = new FFScene();

    titleScene.setBgColor('#28d3e4');
    titleScene.setDuration(3);
    const titleLen = title.length
    const getTitleScale = getDesriptionScale(titleLen);
    const titleText = new FFText({ text: title, font: font, fontSize: 20, x: getTitleScale.x, y: getTitleScale.y, color: '#ffffff'});
    titleText.setWrap(250);
    titleScene.addChild(titleText);
    titleScene.setTransition('zoomIn', 1);
    creator.addChild(titleScene);

    if(videoImage){
        const imageScan = new FFScene();
        imageScan.setBgColor('#28d3e4');
        imageScan.setDuration(3);
        const img = new FFImage({ path: videoImage });
        img.setXY(150, 200); // set position
        img.setWH(200, 200); // set width and height
        img.addAnimate({
            from: { y: 150 / 2 + 720 },
            to: { y: 150 / 2 + 100 },
            time: 2,
            delay: 1,
            ease: 'Cubic.InOut',
          });
        img.addEffect(['rollIn', 'zoomIn', 'fadeInUp'], 1, 1);
        imageScan.addChild(img)
        imageScan.setTransition('zoomIn', 1);
        creator.addChild(imageScan);
    }

    const summryScene = new FFScene();
    summryScene.setBgColor('#28d3e4');
    summryScene.setDuration(10);
    const summuryLen = summry.length
    const getSummuryScale = getDesriptionScale(summuryLen);
    const summryText = new FFText({ text: summry, font: font, fontSize: 20, x: getSummuryScale.x, y: getSummuryScale.y, color: '#ffffff'});
    summryText.setWrap(260);
    summryScene.addChild(summryText);
    summryScene.setTransition('zoomIn', 0.5);
    creator.addChild(summryScene);

    const thanksScene = new FFScene();
    const img = new FFImage({ path: channelLogo });
    img.setXY(140, 150); // set position
    img.setWH(50, 50); // set width and height
    thanksScene.addChild(img);
    const thankstext = "Thanks for watching short News. Please subscribe for regular updates. also provide the feedback and love in the comments section. Thank You"
    thanksScene.setBgColor('#FFA500');
    thanksScene.setDuration(2);
    const thanksText = new FFText({ text: thankstext, font: font, fontSize: 20, 
        x: thanksScale.x, y: thanksScale.y, color: thanksScale.color});
    thanksText.setWrap(250);
    thanksScene.addChild(thanksText);
    thanksScene.setTransition('zoomIn', 0.5);

    creator.addChild(thanksScene);
    creator.start();
    creator.on('start', () => {
        console.log(`FFCreator start`);
    });

    creator.on('error', e => {
        console.log(`FFCreator error: ${e.error}`);
    });

    creator.on('progress', e => {
        console.log(colors.yellow(`FFCreator progress: ${(e.percent * 100) >> 0}%`));
    });

    creator.on('complete', e => {
        console.log(
            colors.magenta(`FFCreator completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `),
        );

        console.log(colors.green(`\n --- You can press the s key or the w key to restart! --- \n`));
    });

    return creator;
}



const CreateVideos = async () =>{
    const finalTask = []
    for (let index = 0; index < Data.newstitle.length; index++) {
        const taskId = FFCreatorCenter.addTask(async () => {
            return await createVideo(Data.newstitle[index], Data.foldersData[index].folderName)
         });
        FFCreatorCenter.onTaskComplete(taskId, result => {
            const obj = {
                title:Data.newstitle[index].title,
                description:Data.newstitle[index].summry,
                videoFilePath: result.file,
                thumbFilePath:Data.foldersData[index].folderName,
                tag:Data.newstitle[index].tag || []
            }
            finalTask.push(obj);
            if(finalTask.length === Data.newstitle.length){
                var jsonContent = JSON.stringify(finalTask);
                fs.writeFile('videos.json', jsonContent, 'utf8', (err) => {
                    if (err) {
                        console.log("An error occured while writing JSON Object to File.");
                        return console.log(err);
                    }
                    console.log("JSON file has been saved.");
                    process.exit(0)
                })
            }
        });
        
        FFCreatorCenter.onTaskError(taskId, error => {
            console.error(error);
        })
    }
}

CreateVideos()
