const {
    click,
    button,
    text,
    press,
    write,
    waitFor,
    below,
    into,
    above,
    highlight,
    checkBox,
    toLeftOf,
    timeField,
    attach
} = require('taiko');
var assert = require("assert");
var fileExtension = require("../util/fileExtension");
var date = require("./util/date");
const taikoHelper = require("../util/taikoHelper");
const { link } = require('fs');

step("start patient serach", async function () {
    await click(button({ "aria-label": "Search Patient" }))
});

step("enter the patient name in lablite", async function () {
    var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
    await write(patientIdentifierValue, { "placeholder": "Search for a patient by name or identifier number" });
    await click(button("Search"))
});

step("Select the patient in lablite search result", async function () {
    var patientFirstName = gauge.dataStore.scenarioStore.get("patientFirstName");
    var patientMiddleName = gauge.dataStore.scenarioStore.get("patientMiddleName");
    var patientLastName = gauge.dataStore.scenarioStore.get("patientLastName");
    assert.ok(await text("Found 1 patient").exists())
    await click(`${patientFirstName} ${patientMiddleName} ${patientLastName}`)
});

step("Validate the lab tests <labTests> are available", async function (labTests) {
    var prescriptionFile = `./data/${labTests}.json`;
    var testDetail = JSON.parse(fileExtension.parseContent(prescriptionFile))

    assert.ok(await text(testDetail.test).exists())
});

step("Verify test prescribed is displayed on Pending Lab Orders table", async function () {
    var labTest = gauge.dataStore.scenarioStore.get("LabTest")
    await highlight(text(labTest, below("Pending Lab Orders"), below("Test"), above("Upload Report")))
    assert.ok(await text(labTest, below("Pending Lab Orders"), below("Test"), above("Upload Report")).exists())
});

step("Open upload report side panel", async function () {
    await click("Upload Report");
});

step("Select prescribed test in Pending Lab Orders table", async function () {
    var labTest = gauge.dataStore.scenarioStore.get("LabTest")
    await checkBox(below("Pending Lab Orders"), above("Upload Report"), toLeftOf(labTest)).check();
});

step("Select Lab Report in side panel", async function () {
    await attach(path.join("./data", `labReport1.jpg`), fileField(above("Report Date")), { waitForEvents: ['DOMContentLoaded'] });
});

step("Select today's date in Report Date Field", async function () {
    var reportDate = date.today();
    await write(reportDate, into(timeField(below("Report Date"))));
});

step("Select Doctor in side panel", async function () {
    var doctor = users.getUserNameFromEncoding(process.env.doctor);
    await dropDown(below("Requested by")).select(doctor);
});

step("Upload and verify the reports table", async function () {
    button("Save and Upload").click();
    await taikoHelper.repeatUntilNotFound($("//H3[text()='Report successfully uploaded']"));
    assert.ok(await text(labTest, below("Reports Table"), below("Test"), toLeftOf(link("labReport1.jpg"))).exists());
});

step("Verify the uploaded report", async function() {
	click(link("labReport1.jpg"));
    assert.ok(await $("//h3[text()='1kbhsg.jpeg']//..//..//img").isVisible());
    button("close").click();
});