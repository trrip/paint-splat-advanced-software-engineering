# git pull
# stop the existing process
# start a new process.

git pull --rebase
pm2 stop paint-splat
pm2 start ~/ASW/paint-splat-advanced-software-engineering/paint-splat/bin/www