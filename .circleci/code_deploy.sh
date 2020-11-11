# git pull
# stop the existing process
# start a new process.
cd ~/ASW/paint-splat-advanced-software-engineering/
git pull
pm2 stop paint_splat
pm2 start ~/ASW/paint-splat-advanced-software-engineering/paint-splat/bin/www --name paint_splat