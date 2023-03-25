const childProcess = require('child_process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function init(){
    console.log("Cloning BetterNCM boilerplate...");
    await exec("git clone https://github.com/BetterNCM/boilerplate");
    console.log("Installing dependencies...");
    await exec("cmd /c cd boilerplate & npm install yarn -g & yarn");
    try{
        await exec("cmd /c cd boilerplate & code .");
    }catch(e){
        console.log("VSCode not found, skipping...");
    }
}

init();