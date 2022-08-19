/* globals gauge*/
"use strict";
const {
    $,
    click,
    button,
    toRightOf,
    text,
    toLeftOf,
    within,
    write,
    into,
    textBox,
    press,
    waitFor,
    scrollTo,
    highlight,
    link
} = require('taiko');
const taikoHelper = require("../util/taikoHelper")
var fileExtension = require("../util/fileExtension")
var assert = require('assert');

step("Click Start IPD Visit", async function () {
    await scrollTo("Start OPD Visit")
    await click(button(toRightOf('Start OPD Visit'), within($(".submit-btn-container"))));
    await click('Start IPD visit', { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
    await taikoHelper.repeatUntilNotFound($("#overlay"))
});

step("Click Start OPD Visit", async function () {
    await scrollTo(`Start ${process.env.default_visit_type} visit`)
    await click(`Start ${process.env.default_visit_type} visit`, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
    await taikoHelper.repeatUntilNotFound($("#overlay"))
});

step("Select the newly created patient with network idle", async function () {
    var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
    await write(patientIdentifierValue, into(textBox({ "placeholder": "Search Name/Patient Identifier  ..." })))
    await click('Search', { waitForNavigation: true, waitForEvents: ['networkIdle'], navigationTimeout: process.env.mergeTimeout });
});

step("Select the newly created patient for IP", async function () {
    var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
    await write(patientIdentifierValue)
    await press("Enter", { waitForNavigation: true, navigationTimeout: process.env.mergeTimeout });
});

step("Select the newly created patient for IP Admission", async function () {
    var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
    await write(patientIdentifierValue)
    await press("Enter", { waitForNavigation: true, navigationTimeout: process.env.mergeTimeout });
});

step("Select the newly created patient for IP Discharge", async function () {
    var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
    await write(patientIdentifierValue)
    await click("Search", { waitForNavigation: true, navigationTimeout: process.env.mergeTimeout });
});

step("Search the newly created patient", async function () {
    var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
    await write(patientIdentifierValue, into(textBox({ "placeholder": "Search Name/Patient Identifier  ..." })))
    await click('Search', { waitForNavigation: true, navigationTimeout: process.env.mergeTimeout });
});

step("verify name with id", async function () {
    var firstName = gauge.dataStore.scenarioStore.get("patientFirstName")
    var lastName = gauge.dataStore.scenarioStore.get("patientLastName")
    var middleName = gauge.dataStore.scenarioStore.get("patientMiddleName")
    var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");

    assert.ok(await (await text(`${firstName} ${lastName} (${patientIdentifierValue})`, toLeftOf("Female"))).exists())
});

step("verify OPD", async function () {
    //    await highlight("23 Feb 22",toLeftOf("OPD"));
});

step("Verify medical prescription in patient clinical dashboard", async function () {
    await taikoHelper.repeatUntilNotFound($(".dashboard-section-loader"))
    var prescriptionFile = gauge.dataStore.scenarioStore.get("prescriptions")
    var medicalPrescriptions = JSON.parse(fileExtension.parseContent(prescriptionFile))
    assert.ok(await (await text(medicalPrescriptions.drug_name)).exists())
    assert.ok(await (await text(`${medicalPrescriptions.dose} ${medicalPrescriptions.units}, ${medicalPrescriptions.frequency}`)).exists())
    assert.ok(await (await text(`${medicalPrescriptions.duration} Day(s)`)).exists())
});

step("Verify vitals", async function () {
    var vitalFormValues = gauge.dataStore.scenarioStore.get("vitalFormValues")
    for (var vitalFormValue of vitalFormValues.ObservationFormDetails) {
        if (vitalFormValue.type == 'Group') {
            for (var vitalFormGroup of vitalFormValue.value) {
                assert.ok(await text(vitalFormGroup.value, within($("#Vitals")), toRightOf(vitalFormGroup.label.split(" ")[0])).exists())
            }
        }
        else {
            assert.ok(await text(vitalFormValue.value, within($("#Vitals")), toRightOf(vitalFormValue.label.split(" ")[0])).exists())
        }
    };
});

step("Verify diagnosis and condition in patient clinical dashboard", async function () {
    var diagnosisFile = gauge.dataStore.scenarioStore.get("diagnosisFile")
    var medicalDiagnosis = JSON.parse(fileExtension.parseContent(diagnosisFile))
    assert.ok(await text(medicalDiagnosis.diagnosis.diagnosisName, toLeftOf(medicalDiagnosis.diagnosis.certainty, toLeftOf(medicalDiagnosis.diagnosis.order)), within($("//section[@id='Diagnosis']"))).exists())
});

step("Verify history & examination in patient clinical dashboard", async function () {
    var historyAndExaminationDetails = gauge.dataStore.scenarioStore.get("historyAndExaminationDetails")
    assert.ok(await text(`${historyAndExaminationDetails.Chief_Complaints[0].Chief_Complaint} since ${historyAndExaminationDetails.Chief_Complaints[0].for} ${historyAndExaminationDetails.Chief_Complaints[0].for_frequency}`, toRightOf("Chief Complaint"), within($("#History-and-Examinations"))).exists())
    assert.ok(await text(`${historyAndExaminationDetails.Chief_complaint_notes}`, within($("#History-and-Examinations")), toRightOf("Chief Complaint Notes")).exists())
    assert.ok(await text(`${historyAndExaminationDetails.History_Notes}`, within($("#History-and-Examinations")), toRightOf("History Notes")).exists())
    assert.ok(await text(`${historyAndExaminationDetails.Examination_notes}`, within($("#History-and-Examinations")), toRightOf("Examination Notes")).exists())
    assert.ok(await text(`${historyAndExaminationDetails.Smoking_History}`, within($("#History-and-Examinations")), toRightOf("Smoking History")).exists())
});

step("Verify consultation notes in patient clinical dashboard", async function () {
    var consultationNote = gauge.dataStore.scenarioStore.get("consultationNotes")
    await click(link(toLeftOf(text("OPD"), within($("#Visits")))))
    assert.ok(await text(consultationNote, within($("#observation-section")), toRightOf("consultation note")).exists())
});

step("Validate the lab tests are available in patient clinical dashboard", async function () {
    var labTest =gauge.dataStore.scenarioStore.get("LabTest")
    assert.ok(await text(labTest,within($("//section[@id='Lab-Results']"))).exists())
});