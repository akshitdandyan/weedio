import axios from 'axios';
import fs from 'fs';

async function getSampleVideo() {
    const res = await axios.get(
        "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        {
            responseType: "arraybuffer",
        }
    );

    console.log('--------------------------');
    console.log(res.data);
    console.log('--------------------------');

    // res.data.pipe(fs.createWriteStream("video.mp4"));
    fs.writeFileSync('video.mp4', res.data)

    console.log("✅ Sample video added")
}

export default getSampleVideo;