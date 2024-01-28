apt-get update && apt-get upgrade && apt-get install chromium
git clone https://github.com/nvm-sh/nvm.git .nvm
cd ~/.nvm
. ./nvm.sh
nvm install node
cd
git clone https://github.com/nidzammst/wa_bot/
cd wa_bot
npm install
npm run start
