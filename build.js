var async = require("async");
var exec = require("child_process").exec;
var fs = require("fs-extra");
var nwbuild = require("node-webkit-builder");
var path = require("path");
var stealTools = require("steal-tools");

var nwbuild_path = path.dirname( require.resolve("node-webkit-builder") );



// Build production bundle(s)
function buildJS(callback)
{
	stealTools.build(
	{
		main: "init",
		config: "src/config.js",
		bundlesPath: "./build/"
	},{
		bundleSteal: true
	})
	.catch(callback)
	.then( function(){ callback() });
}



// Wrap production bundle(s) with node-webkit
function buildNW(callback)
{
	nwbuild(
	{
		cacheDir: path.join(nwbuild_path,"cache"),	// same as its CLI
		files: "build/**/**",
		macIcns: "assets/logo.icns",
		platforms: ["osx","win","linux32"],
		version: process.argv[2] || "latest",
		//winIco: "assets/logo.ico"
	})
	.build()
	.catch(callback)
	.then( function(){ callback() });
}



// Create build/
function dir(callback)
{
	fs.removeSync("build/");
	fs.mkdirSync("build");
	
	callback();
}



// Copy HTML file to build/
function index(callback)
{
	fs.copySync("src/index-production.html", "build/index.html");
	
	callback();
}



// Copy package.json to build/
function packageJson(callback)
{
	var package    = fs.readJsonSync("package.json");
	var packageSrc = fs.readJsonSync("src/package.json");
	
	packageSrc.description = package.description;
	packageSrc.name        = package.name;
	packageSrc.version     = package.version;
	
	fs.writeJsonSync("build/package.json", packageSrc);
	
	callback();
}



// Install Node modules in build/
function npmInstall(callback)
{
	// TODO :: try again when --no-registry doesn't throw error
	//exec("npm install --production --no-registry", {cwd:"build"}, callback);
	exec("npm install --production --cache-min 99999", {cwd:"build/"}, callback);
}



// Task list
async.series([dir,packageJson,npmInstall,index,buildJS/*,buildNW*/], function(error)
{
	if (error) throw error;
});
