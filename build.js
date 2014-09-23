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
		bundlesPath: "./build/web/"
	},{
		bundleSteal: true
	})
	.catch(callback)
	.then( function(){ callback() });
}



// Wrap production bundle(s) with node-webkit
function buildNW(callback)
{
	var pkg = require("./build/web/package.json");
	
	var config =
	{
		appName: pkg.window.title,
		appVersion: pkg.version,
		buildDir: "build/",
		cacheDir: path.join(nwbuild_path,"cache"),	// same as its CLI
		files: "build/web/**/**",
		macIcns: "assets/logo.icns",
		platforms: ["osx","win","linux32"],
		version: process.argv[2] || "latest",
		//winIco: "assets/logo.ico"
	};
	
	nwbuild(config).build().catch(callback)
	.then( function()
	{
		var annoyingPath = "build/"+config.appName;
		var files = fs.readdirSync(annoyingPath);
		
		// Move build/[appName]/[platform]/ to build/[platform]
		var count = 0;
		files.forEach( function(file)
		{
			// No synchronous version (as of fs-extra v0.12)
			fs.move( annoyingPath+"/"+file, "build/"+file, function(error)
			{
				if (error) throw error;
				
				if (++count >= files.length)
				{
					fs.rmdirSync(annoyingPath);
					callback();
				}
			});
		});
	});
}



// Create build/
function dir(callback)
{
	fs.removeSync("build/");
	fs.mkdirsSync("build/web/");
	
	callback();
}



// Copy HTML file to build/
function index(callback)
{
	fs.copySync("src/index-production.html", "build/web/index.html");
	
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
	
	fs.writeJsonSync("build/web/package.json", packageSrc);
	
	callback();
}



// Install Node modules in build/
function npmInstall(callback)
{
	// TODO :: try again when --no-registry doesn't throw error
	//exec("npm install --production --no-registry", {cwd:"build"}, callback);
	exec("npm install --production --cache-min 99999", {cwd:"build/web/"}, callback);
}



// Task list
async.series([dir,packageJson,npmInstall,index,buildJS,buildNW], function(error)
{
	if (error) throw error;
});
