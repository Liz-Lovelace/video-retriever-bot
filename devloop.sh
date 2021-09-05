while (true) do
  clear
  rm storage/*
  rm storage/**
  node index.js
  echo '  storage:'
  ls -lh storage
  echo '  purgatory:'
  ls -lh storage/purgatory
  #mpv storage/*
  read VAR
done