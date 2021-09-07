const downloader = require('./downloader.js');

async function main(){
  //downloader.downloadVideo('https://www.youtube.com/watch?v=5FFdMSQxDro');
  //downloader.downloadVideo('https://www.youtube.com/watch?v=tPEE9ZwTmy0&ab_channel=MylotheCat');
  //takes a while???
  //downloader.downloadVideo('https://www.youtube.com/watch?v=weUkVjpocrk');
  //downloader.downloadVideo('https://www.youtube.com/watch?v=w3XjUAh2L3g');
  //downloader.downloadVideo('https://www.youtube.com/watch?v=6aQXvbjfAGE');
  //long
  //downloader.downloadVideo('https://www.youtube.com/watch?v=fZhRZIqJy-c&t=10s');
  console.log(await downloader.listFormats('https://www.youtube.com/watch?v=fZhRZIqJy-c&t=10s'));
  console.log('done:)')
}

main()