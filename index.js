#!/usr/bin/env node
const util = require('util');
const exec = util.promisify(require('child_process').exec);
var prompt = require('prompt');
const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const getSlugName = (name) => {
	if (!name) return null;
	return name.replace(/[^a-zA-Z0-9 ]/g, '').replace(/ /g, '-');
};


async function init() {
    const cwd = process.cwd();

    const { PluginName, Author } = await prompt.get(['PluginName', 'Author',]);

    console.log("Cloning BetterNCM boilerplate...");
    await exec("git clone https://github.com/BetterNCM/boilerplate --recurse-submodules --remote-submodules", { cwd });


    // replace boilerplate with plugin name
    const replaceFile = (filename, from, to) => {
        let str = readFileSync(join(cwd, filename)).toString("utf8");
        while (str.includes(from)) str = str.replace(from, to);
        writeFileSync(join(cwd, filename), str);
    }

    replaceFile("boilerplate/manifest.json", "boilerplate", PluginName);
    replaceFile("boilerplate/manifest.json", "MicroBlock", Author);
    replaceFile("boilerplate/dist/manifest.json", "boilerplate", PluginName);
    replaceFile("boilerplate/dist/manifest.json", "MicroBlock", Author);
    replaceFile("boilerplate/package.json", "MicroBlock", Author);
    replaceFile("boilerplate/package.json", "@betterncm/boilerplate", PluginName);

    const slugname=getSlugName(PluginName)
    // rename boilerplate
    await exec(`ren boilerplate ${slugname}`, { cwd });

    console.log("Installing dependencies...");
    await exec(`cmd /c cd ${slugname} & npm install yarn -g & yarn`, { cwd });

    try {
        await exec(`cmd /c cd ${slugname} & code .`, { cwd });
    } catch (e) {
        console.log("VSCode not found, skipping...");
    }
}

init();