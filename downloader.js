const util = require('util');
const { spawn } = require('child_process');
const fs = require('fs');
const crypto = require('crypto');

async function safeExec(cmd, args, stdin = ''){
  let child = spawn(cmd, args);
  child.stdin.end(stdin);
  let stdout = '';
  for await (const data of child.stdout){
    stdout += data;
    console.log(data);
  }
  return stdout;
}

function findInfoFileName(files){
  let infoRegex = new RegExp('\.info\.json$');
  for (let i = 0; i < files.length; i++){
    if (infoRegex.test(files[i]))
      return files[i];
  }
}

let storagePath = __dirname+'/storage';
let purgatoryPath = __dirname + '/purgatory';
let queuePath = __dirname + '/queue';

async function main(link){
  let downId = require('crypto').createHash('sha1').update(link).digest('base64').replace('/', 's');
  let downPath = purgatoryPath + '/' + downId;
  await fs.promises.mkdir(downPath);
  let args = [
    '-o', downPath + '/%(title)s (%(resolution)s) %(id)s',
    //this tells it to get links from stdin
    '-a', '-',
    '--write-info-json',
    '--write-thumbnail'
  ];
  let out = await safeExec('youtube-dl', args, link);
  console.log(out);
  let files = await fs.promises.readdir(downPath);
  let infoJson = JSON.parse(await fs.promises.readFile(downPath+'/'+ findInfoFileName(files), 'utf8'));
  let newDirPath = storagePath + '/' + infoJson.id + ' ' + infoJson.format_id;
  await fs.promises.rename(downPath, newDirPath);
}

async function downloadVideo(link){
  await main(link);
  console.log('done downloading ' + link);
}

module.exports = { downloadVideo };