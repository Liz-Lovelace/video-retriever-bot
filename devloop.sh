while (true) do
  clear
  rm -r storage/*
  rm -r purgatory/*
  node bot.js | bat
  tree purgatory
  tree storage
  read VAR
done