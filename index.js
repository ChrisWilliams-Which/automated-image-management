// imports
const csv = require('async-csv');
const fs = require('fs');
const fsPromise = require('fs').promises;

// variables
const source = "./mseller/"; // source folder
const csvfile = "./mapping.csv"; // csv file

const processASIN = (row, matchedFiles) => {
    const target = "./asin/"; // target folder
    const targetColumn = 1;

    for (let b = 0; b < matchedFiles.length; b = b + 1) {
        let newfilename = target + matchedFiles[b].replace(row[0], row[targetColumn]);
        
        cedillaPos = newfilename.indexOf("~");

        if (cedillaPos >= 0) {
            newfilename = newfilename.substr(0, cedillaPos);
        }

        if (b === 0) {
            // if first image, add ".main"
            fs.copyFileSync(source + matchedFiles[b], newfilename + ".main");
        } else {
            // else, add ".PT0${loopcount}"
            fs.copyFileSync(source + matchedFiles[b], newfilename + ".PT0" + b);
        }
    }

    return true;
}

const processImages = async () => {

    // open and read CSV file
    const csvString = await fsPromise.readFile(csvfile, 'utf-8');

    // parse CSV into JSON
    const rows = await csv.parse(csvString);

    // find all images
    const files = fs.readdirSync(source);

    // loop through CSV file
    for (let a = 0; a < rows.length; a = a + 1) {
        // filter files that match the CSV row
        const matchedFiles = files.filter(file => {
            if (file.substr(0, rows[a][0].length) == rows[a][0]) {
                return true;
            } else {
                return false;
            }
        })

        if (matchedFiles.length > 0) {
            // process ASIN
            processASIN(rows[a],matchedFiles);

            // todo: process WHSmith
        }
    }
}

processImages();