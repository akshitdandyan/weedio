import {randomUUID} from 'crypto';
import {existsSync,mkdirSync} from 'fs';
import { VIDEO_FEATURES } from '../@config/constants';

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

export function handleFeatureReply(command: string) {
    let replyMessage = "";
    let needReply = false;
    switch (command) {
      case VIDEO_FEATURES.reduceSize:
        replyMessage = "Okay, send the video whose size is to be reduced 🎦";
        break;
      case VIDEO_FEATURES.trimVideo:
        replyMessage =
          "Okay, please type the start and end duration in seconds.\nFor example, if you want to trim a video from 2s to 6s, type 2 6";
        needReply = true;
        break;
      default:
        replyMessage = "Woops! Please choose only from given options.";
        break;
    }
    return {
      needReply,
      replyMessage,
    };
}

export function isFeature(reply:string){
    for (var prop in VIDEO_FEATURES) {
        if(VIDEO_FEATURES[prop] === reply){
            return true;
        }
    }
    return false;
}

export function isOption(reply:string){
    try {
        // 1. durations for video trim feature
        const splitted = reply.split(' ');
        if(splitted.length < 2){
            return {
                success: false,
                message:"🙄Umm, that's not enough to proceed with. Please write both start and end duration in following format: \n\n 5 10"
            }
        }
        const startTime = splitted[0];
        const endTime = splitted[splitted.length-1];
        if(startTime >= endTime){
            return {
                success:false,
                message:"Sorry, we cannot produce videos in duration with minus seconds😟"
            }
        }
        return {
            success: true,
            message:"⏱️Processing your video...",
            startTime,endTime
        }
    } catch (error) {
        return {
            success:false,
            message:"Agh!! Something went wrong😟 Please take a snapshot and email it to us so that we can fix it."
        }
    }

}