const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');

async function safeExec(cmd){
  let {stdout, stderr} = await exec(cmd);
  return stdout;
}

function findInfoFileName(files){
  let infoRegex = new RegExp('\.info\.json$')
  for (let i = 0; i < files.length; i++){
    if (infoRegex.test(files[i]))
      return files[i];
  }
}

let storagePath = __dirname+'/storage'
let purgatoryPath = storagePath + '/purgatory';
async function main(){

  let format = purgatoryPath + '/%(title)s (%(resolution)s) %(id)s'
  let options = [
    '-o "' + format + '"',
    '-a test-urls.txt',
    '--write-info-json',
    '--write-thumbnail'
  ];
  let optionsStr = '';
  for (let i = 0; i < options.length; i++)
    optionsStr += options[i] + ' ';
  let out = await safeExec('youtube-dl ' + optionsStr);
  console.log(out);
  let files = await fs.promises.readdir(purgatoryPath);
  let infoFilePath = findInfoFileName(files);
  let infoJson = JSON.parse(await fs.promises.readFile(purgatoryPath + '/' + infoFilePath, 'utf8'));
  let newVidDir = storagePath + '/' + infoJson.id + ' ' + infoJson.format_id;
  await fs.promises.mkdir(newVidDir);
  for (i = 0; i < files.length; i++){
    await fs.promises.rename(purgatoryPath + '/' + files[i], newVidDir + '/' + files[i]);
    console.log('moved ' + files[i]);
  }
  
}

main();