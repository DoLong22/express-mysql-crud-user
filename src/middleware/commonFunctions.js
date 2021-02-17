import { logger } from '../helpers/logger';

const fs = require('fs');
const path = require('path');
const config = require('config');

const directory = config.get('video_processing.videos_folder');
const extensions = config.get('video_processing.video_extensions');
const extArray = extensions.split(',');

export function validExtension(file, validExtentions = extArray) {
    return validExtentions.includes(path.extname(file));
}

export function scanFile(folder, wantedExtention = extArray) {
    try {
        const fileList = [];
        fs.statSync(folder);
        const files = fs.readdirSync(folder);
        files.forEach((file) => {
            // logger.debug('file: ', file);
            const ext = validExtension(file, wantedExtention);
            if (ext) {
                const fileExt = path.extname(file);
                const name = path.basename(file, fileExt);
                fileList.push({
                    name,
                    fileName: `${name}.mp4`,
                });
            }
        });
        return fileList;
    } catch (err) {
        if (err.code === 'ENOENT') {
            logger.error(`error in scanFile: file or directory does not exist ${folder}`);
        } else {
            logger.error(`error in scanFile pFolder: ${err.message}`);
        }
        throw err;
    }
}

export function getFolderList() {
    const folders = [];
    folders.push({
        directory,
        path: '',
    });
    return folders;
}
