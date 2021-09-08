const util = require('util');
const { spawn } = require('child_process');
const fs = require('fs');
const crypto = require('crypto');

async function safeExec(cmd, args, stdin = ''){
  let child = spawn(cmd, args);
  child.stdin.end(stdin);
  let stdout = '';
  for await (const data of child.stdout)
    stdout += data;
  return stdout;
}

function findInfoFileName(files){
  let infoRegex = new RegExp('\.info\.json$');
  for (let i = 0; i < files.length; i++){
    if (infoRegex.test(files[i]))
      return files[i];
  }
}

let storagePath = __dirname+'/../storage';
let purgatoryPath = __dirname + '/../purgatory';

async function downloadVideo(link, format='best'){
  let downId = require('crypto').createHash('sha1').update(link).digest('base64').replace('/', 's');
  let downPath = purgatoryPath + '/' + downId;
  await fs.promises.mkdir(downPath);
  let args = [
    '-o', downPath + '/%(title)s (%(resolution)s) %(id)s',
    '--write-info-json',
    '--write-thumbnail',
    '-f', format,
    link
  ];
  let out = await safeExec('youtube-dl', args, link);
  let files = await fs.promises.readdir(downPath);
  let infoJson = JSON.parse(await fs.promises.readFile(downPath+'/'+ findInfoFileName(files), 'utf8'));
  let newDirPath = storagePath + '/' + infoJson.id + ' ' + infoJson.format_id;
  await fs.promises.rename(downPath, newDirPath);
  return newDirPath;
}

async function listFormats(link){
  let str = await safeExec('youtube-dl', ['-F', link]);
  let lines = str.split('\n');
  lines = lines.slice(3, lines.length-1);
  let lineProperties = []
  for (let i = 0; i < lines.length; i++){
    let valsReg = /^(\d\d\d?) *(\w*) *(\d*x\d*|\w* \w*) *(.*)$/g;
    vals = valsReg.exec(lines[i]);
    lineProperties.push({
      formatCode: vals[1],
      extention: vals[2],
      resolution: vals[3],
      notes: vals[4].split(', ')
    });
  }
  return lineProperties;
}

module.exports = { downloadVideo, listFormats };