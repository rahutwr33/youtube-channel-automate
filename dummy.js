const path = require('path');
const colors = require('colors');
const startAndListen = require('./listen');
const { FFCreatorCenter, FFScene, FFVideoAlbum, FFText, FFImage, FFCreator } = require('ffcreator');


const createVideo = async () => {
    const width = 576;
    const height = 1024;
    const bg1 = path.join(__dirname, './assets/imgs/bg/h03.jpg');
    const bg2 = path.join(__dirname, './assets/imgs/bg/h02.jpg');
    const logo1 = path.join(__dirname, './assets/imgs/logo/logo1.png');
    const logo2 = path.join(__dirname, './assets/imgs/logo/logo2.png');
    const dragon = path.join(__dirname, './assets/imgs/dragon.png');
    const video1 = path.join(__dirname, './assets/video/video1.mp4');
    const video2 = path.join(__dirname, './assets/video/video2.mp4');
    const outputDir = __dirname + '/video';
    const cacheDir = path.join(__dirname, './cache/');

    const creator = new FFCreator({
        cacheDir, // cache directory
        outputDir, // output directory
        // output, // output file name (can not be set in FFCreatorCenter)
        width: 650, // width of the video
        height: 400, // video height
        // cover: 'a.jpg', // Set cover
        audioLoop: true, // Music loop
        fps: 24, // fps
        threads: 4, // Multi-threaded (fake) parallel rendering
        debug: false, // enable test mode
        defaultOutputOptions: null, // ffmpeg output option configuration
    });
    const scene1 = new FFScene();
    const scene2 = new FFScene();
    scene1.setBgColor('#7e5fff');
    scene2.setBgColor('#2c3a47');

    const fbg1 = new FFImage({ path: bg1, x: width / 2, y: height / 2 });
    scene1.addChild(fbg1);

    // add new album
    const album = new FFVideoAlbum({
        list: [video1, video2],
        x: width / 2,
        y: height / 2,
        width: width * 0.7,
        height: 423 * 0.7,
        ss: '00:00:00',
        to: '00:00:06',
    });

    album.addEffect('fadeInUp', 1, 1);
    scene1.addChild(album);

    // add dragon image
    const fdragon = new FFImage({ path: dragon, x: 100, y: height / 2 + 100 });
    fdragon.setScale(0.7);
    fdragon.addEffect('fadeInUp', 1, 3);
    scene1.addChild(fdragon);

    // add logo
    const flogo1 = new FFImage({ path: logo2, x: width / 2, y: 50 });
    flogo1.setScale(0.5);
    scene1.addChild(flogo1);

    scene1.setDuration(12);
    scene1.setTransition('Windows4', 2);
    creator.addChild(scene1);

    // add scene2 background
    const fbg2 = new FFImage({ path: bg2, x: width / 2, y: height / 2 });
    scene2.addChild(fbg2);

    // add logo
    const flogo2 = new FFImage({ path: logo2, x: width / 2, y: height / 2 - 20 });
    flogo2.setScale(0.9);
    flogo2.addEffect('zoomIn', 1, 1.2);
    scene2.addChild(flogo2);

    scene2.setDuration(5);
    creator.addChild(scene2);

    creator.start();
    //creator.openLog();

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

createVideo()

module.exports = (src, newstitle) => startAndListen(() => FFCreatorCenter.addTask(createVideo));
