const { Telegraf } = require('telegraf');
const fs = require('fs');
const bot = new Telegraf(fs.readFileSync(__dirname + '/include/token.txt', 'utf8'));
const downloader = require('./include/downloader.js')

bot.command('start', ctx=>{
  ctx.reply('Hello! Send me a link to a video from the internet and I\'ll do my best to download it for you.');
});

async function formatMsg(ctx){
  let formats = await downloader.listFormats(ctx.message.text);
  msg = 'Please pick one of the following formats:\n';
  for (let i = 0; i < formats.length; i++){
    let f = formats[i];
    msg += f.formatCode + ':  ' + f.resolution + '  .' + f.extention + '\n' + f.notes.join(' ') + '\n\n';
  }
  ctx.reply(msg);
  await fs.promises.writeFile(__dirname + '/user-data/' + ctx.from.id, ctx.message.text, {flag:'w'});
}

async function getMediaFromDir(dirPath){
  let files = await fs.promises.readdir(dirPath);
  let videoRegex = new RegExp('mp4|webm|mkv|mp3|m4a');
  for (f of files){
    if(videoRegex.test(f))
      return f;
  }
}

async function downloadMsg(ctx){
  ctx.reply('ok gimme a sec here...');
  let link = await fs.promises.readFile(__dirname + '/user-data/' + ctx.from.id, 'utf8');
  let vidDirPath = await downloader.downloadVideo(link, ctx.message.text);
  await ctx.reply('done :)');
  let vidPath = vidDirPath+'/'+await getMediaFromDir(vidDirPath);
  //oops! bigger than 50megs
  ctx.replyWithVideo({
    source: fs.createReadStream(vidPath)
  });
}

bot.on('message', async ctx=>{
  let numRegex = /^\d*$/;
  let text = ctx.message.text;
  if (numRegex.test(text))
    downloadMsg(ctx);
  else if (text)
    formatMsg(ctx);
    
});


bot.launch();
