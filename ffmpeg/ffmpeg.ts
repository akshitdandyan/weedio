import axios from 'axios';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

async function saveVideo() {
    const res = await axios.get(
        "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        {
            responseType: "stream",
        }
    );

    res.data.pipe(fs.createWriteStream("video.mp4"));
}


export async function getSS(){
    try {
        const process =  ffmpeg('./video.mp4').takeScreenshots({
            count: 1,
            timemarks: [ '4' ] // number of seconds
          }, './ss.png');
        console.log('\nDone with processing...')
    } catch (error) {
        console.log("[getSS] error:", error)
    }
}

export async function addSubtitles(){
    try {
        const process = ffmpeg("./video.mp4").outputOptions(
            '-vf subtitles=subtitles.srt'
        )
        .on('error', function(err) {
            console.log('Error: ' + err.message);
        })
        .save('test.mp4');
    } catch (error) {
        console.log("[addSubtitles] error:", error)
    }
}

export async function addText(){
    const process = ffmpeg('./video.mp4')
    .videoFilters([{
        filter:"drawtext",
        options:{
            fontfile:'font.ttf',
            text: 'FROM WEEDIO',
            fontsize: 50,
            fontcolor: 'white',
            x: '(main_w/2-text_w/2)',
            y: 100,
            shadowcolor: 'black',
            shadowx: 2,
            shadowy: 2,
            enable:"between(t,2,4)"
        }
    }])    .on('end', function () {
        console.log('file has been converted succesfully');
    })
    .on('error', function (err) {
        console.log('an error happened: ' + err.message);
    })
    // save to file
    .save('./withText.mp4');
}