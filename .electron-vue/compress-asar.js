const AdmZip = require('adm-zip')
const path = require('path')
const zip = new AdmZip()
const { build } = require("../package.json");

// add local file
let asarPath = null;
if (process.platform === "win32") {
    asarPath = path.join(__dirname, '../build/win-unpacked/resources/app.asar');
} else if (process.platform === "darwin") {
    asarPath = path.join(__dirname, `../build/mac/mac/${build.productName}.app/Contents/Resources/app.asar`);
} else {

}

zip.addLocalFile(asarPath)
// get everything as a buffer
zip.toBuffer()
// or write everything to disk
zip.writeZip(path.join(__dirname, '../dist/update.zip'))