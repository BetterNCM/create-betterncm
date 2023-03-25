#!/usr/bin/env node
const util = require('util');
const exec = util.promisify(require('child_process').exec);
var prompt = require('prompt');
const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

async function init() {
    const cwd = process.cwd();

    const { PluginName, Author } = await prompt.get(['PluginName', 'Author',]);

    console.log("Cloning BetterNCM boilerplate...");
    await exec("git clone https://github.com/BetterNCM/boilerplate", { cwd });
    console.log("Installing dependencies...");
    await exec("cmd /c cd boilerplate & npm install yarn -g & yarn", { cwd });

    // replace boilerplate with plugin name
    const replaceFile = (filename, from, to) => {
        let str = readFileSync(join(cwd, filename)).toString("utf8");
        while (str.includes(from)) str = str.replace(from, to);
        writeFileSync(join(cwd, filename), str);
    }

    replaceFile("manifest.json","@betterncm/boilerplate", PluginName);
    replaceFile("manifest.json","MicroBlock", Author);

    // rename boilerplate
    await exec(`ren boilerplate ${PluginName}`, { cwd });

    try {
        await exec("cmd /c cd boilerplate & code .", { cwd });
    } catch (e) {
        console.log("VSCode not found, skipping...");
    }
}

init();