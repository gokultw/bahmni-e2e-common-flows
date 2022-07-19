const fs = require('fs');
const pdf = require('pdf-parse');

function getTextFromPDF(strFilePath) {
    let dataBuffer = fs.readFileSync(strFilePath);
    pdf(dataBuffer).then(function (data) {
        return data.text;
    });
}
module.exports = {
    getTextFromPDF: getTextFromPDF
};