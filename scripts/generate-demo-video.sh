#!/bin/sh
# Original schematic interface animation; no third-party media or footage.
set -eu
ffmpeg -y -f lavfi -i 'color=c=0x183d32:s=960x360:r=24:d=4' -vf "drawbox=x=210:y=40:w=540:h=280:color=0xd5dfc9:t=fill,drawbox=x=230:y=60:w=500:h=35:color=0x90a68e:t=fill,drawbox=x=230:y=115:w=190:h=185:color=0xb5c5a8:t=fill,drawbox=x=440:y=115:w=290:h=50:color=0x6a896d:t=fill,drawbox=x=440:y=185:w=290:h=20:color=0xb5c5a8:t=fill,drawbox=x=440:y=225:w=210:h=20:color=0xb5c5a8:t=fill,drawbox=x=440:y=265:w=150:h=35:color=0xc4a572:t=fill,crop=640:360:x='160+100*sin(t*PI/2)':y=0" -an -c:v libx264 -crf 23 -g 6 -keyint_min 6 -pix_fmt yuv420p -movflags +faststart apps/docs/public/examples/workspace.mp4
ffmpeg -y -i apps/docs/public/examples/workspace.mp4 -frames:v 1 apps/docs/public/examples/workspace-poster.jpg
