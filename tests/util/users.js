"use strict";
var Buffer = require('buffer/').Buffer
const { faker } = require('@faker-js/faker/locale/en_IND');
const fs = require('fs');
const Axios = require('axios')
const { csv } = require('csvtojson');
const path = require('path')
const assert = require("assert")
const fileExtension = require("./fileExtension")
const { waitFor } = require("taiko");
function getUserNameFromEncoding(encodedUser) {
    let user = new Buffer(encodedUser, 'base64');
    let decodedUser = user.toString('ascii');
    return decodedUser.split(":")[0]
}

function getPasswordFromEncoding(encodedUser) {
    let user = new Buffer(encodedUser, 'base64');
    let decodedUser = user.toString('ascii');
    return decodedUser.split(":")[1]
}

function randomName(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getGender(gender) {
    if (gender == 'M')
        return "Male"
    if (gender == 'F')
        return "Female"
    if (gender == 'O')
        return "Other"
    if (gender == 'U')
        return "Undisclosed"
}

function getRegID() {
    return "BAH-".concat(randomNumber(10000, 1000000));
}
function getRandomPatientGender() {
    var patientGender = gauge.dataStore.scenarioStore.get("patientGender")
    if (!patientGender) {
        patientGender = faker.name.sexType()
        patientGender = patientGender.charAt(0).toUpperCase() + patientGender.slice(1);
    }
    gauge.dataStore.scenarioStore.put("patientGender", patientGender);
    return patientGender;
}

async function downloadAndReturnImage() {
    var filepath = "logs/image" + faker.datatype.number({ min: 1, max: 100 }) + ".jpg"
    const response = await Axios({
        url: faker.image.avatar(),
        method: 'GET',
        responseType: 'stream'
    });
    response.data.pipe(fs.createWriteStream(filepath));
    filepath = path.resolve(filepath);
    await waitFor(() => fileExtension.exists(filepath))
    assert.ok(fileExtension.exists(filepath), "Patient image not downloaded.")
    return filepath;
}
async function randomZipCode() {
    let jsonfile = await csv().fromFile(path.resolve(__dirname, "../../data/registration/addresshierarchy.csv"));
    return jsonfile[faker.datatype.number({ min: 1, max: jsonfile.length })]["ZIP"]
}
module.exports = {
    getRegID: getRegID,
    randomName: randomName,
    getUserNameFromEncoding: getUserNameFromEncoding,
    getPasswordFromEncoding: getPasswordFromEncoding,
    getGender: getGender,
    getRandomPatientGender: getRandomPatientGender,
    randomNumber: randomNumber,
    downloadAndReturnImage: downloadAndReturnImage,
    randomZipCode: randomZipCode
}