while (true) do
  clear
  rm -r storage/*
  rm -r purgatory/*
  time node index.js
  tree
  read VAR
done