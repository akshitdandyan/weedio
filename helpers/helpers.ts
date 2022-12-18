import {randomUUID} from 'crypto';
import {existsSync,mkdirSync} from 'fs';

export const mediaExtension = (filename:string) => {
    return filename.match(/\.[0-9a-z]+$/i)[0];
}

export const newMediaStoragePath = (filename:string) => {
    if(!existsSync('./client-media')){
        mkdirSync('./client-media');
    }
    return `./client-media/${filename}@uuid:${randomUUID()}${mediaExtension(filename)}`;
}

export const mediaOutputPath = (filename:string) => {
    if(!existsSync('./server-media')){
        mkdirSync('./server-media');
    }
    return `./server-media/${filename}`;
}

export const getBitrate=(bytes:number)=> {
    const diff = Math.floor(bytes / 1000000);
    if(diff < 5){
        return 128;
    }
    return Math.floor(
        diff * 28 * 1.1
    );
}