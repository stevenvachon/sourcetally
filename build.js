var exec = require("child_process").exec;
var fs = require("fs-extra");
var nwbuild = require("node-webkit-builder");
var path = require("path");
var Promise = global.Promise || require("promise");
var stealTools = require("steal-tools");
var trash = require("trash");
var waterfall = require("promise-waterfall");

var nwbuild_path = path.dirname( require.resolve("node-webkit-builder") );



// Build production bundle(s)
function buildJS()
{
	return stealTools.build(
	{
		main: "init",
		config: "src/config.js",
		bundlesPath: "./build/web/"
	},{
		bundleSteal: true,
		quiet: true
	});
}



// Wrap production bundle(s) with node-webkit
function buildNW()
{
	return new Promise( function(resolve, reject)
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
		
		new nwbuild(config).build()
		.then( function()
		{
			// TODO :: split move and rmdir into separate then()'s
			var annoyingPath = "build/"+config.appName;
			var files = fs.readdirSync(annoyingPath);
			
			// Move build/[appName]/[platform]/ to build/[platform]
			var count = 0;
			files.forEach( function(file)
			{
				// No synchronous version (as of fs-extra v0.12)
				fs.move( annoyingPath+"/"+file, "build/"+file, function(error)
				{
					if (error) reject(error);
					else if (++count >= files.length)
					{
						fs.rmdirSync(annoyingPath);
						resolve();
					}
				});
			});
		});
	});
}



// Create build/
function dir()
{
	return new Promise( function(resolve, reject)
	{
		// Moving to trash is faster than full deletion and can be restored
		trash(["build/"], function(error)
		{
			if (error)
			{
				reject(error);
			}
			else
			{
				fs.mkdirsSync("build/web/");
				resolve();
			}
		});
	});
}



// Copy HTML file to build/
function index()
{
	return new Promise( function(resolve, reject)
	{
		fs.copySync("src/index-production.html", "build/web/index.html");
		resolve();
	});
}



// Copy package.json to build/
function packageJson()
{
	return new Promise( function(resolve, reject)
	{
		var package    = fs.readJsonSync("package.json");
		var packageSrc = fs.readJsonSync("src/package.json");
		
		packageSrc.description = package.description;
		packageSrc.name        = package.name;
		packageSrc.version     = package.version;
		
		fs.writeJsonSync("build/web/package.json", packageSrc);
		
		resolve();
	});
}



// Install Node modules in build/
function npmInstall()
{
	return new Promise( function(resolve, reject)
	{
		var dir = "build/web/";
		
		// TODO :: try again when --no-registry doesn't throw error
		//exec("npm install --production --no-registry", {cwd:dir}, function(error)
		exec("npm install --production --cache-min 99999", {cwd:dir}, function(error)
		{
			if (error)
			{
				reject(error);
			}
			else
			{
				exec("npm dedupe", {cwd:dir}, function(error)
				{
					if (error) reject(error);
					else resolve();
				});
			}
		});
	});
}



// Build queue
waterfall([dir,packageJson,npmInstall,index,buildJS,buildNW])
.catch( function(error){ throw error })
.then( function(res){ console.log("Done!") });
