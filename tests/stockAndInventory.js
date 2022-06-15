const { goto, below, write, textBox, into, click, toLeftOf, checkBox, reload, text, waitFor, highlight, screenshot } = require('taiko');

step("enter odoo username", async function () {
    try {
        if (await textBox(below("Email")).exists()) {
            await write(process.env.odooUsername, into(textBox(below("Email"))));
        }
    }
    catch (e) {
        gauge.message(`Email field not available, user is already logged in or page not loaded properly`)
    }
});

step("enter odoo password", async function () {
    try {
        if (await textBox(below("Password")).exists()) {
            await write(process.env.odooPassword, into(textBox(below("Password"))));
        }
    }
    catch (e) {
        gauge.message(`Password field not available, user is already logged in or page not loaded properly`)
    }
});

step("Log in to odoo", async function () {
    try {
        if (await textBox(below("Password")).exists()) {
            await click("Log in",
                { waitForNavigation: true, navigationTimeout: process.env.actionTimeout }
            );
        }
    }
    catch (e) {
        gauge.message(`Login button not available, user is already logged in or page not loaded properly`)
    }
});

step("Click Sales", async function () {
    await click("Sales");
});

step("View Quotations below direct sales", async function () {
    await click("Quotations", below("Direct Sales"));
});

step("select Customer", async function () {
    var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
    await click(patientIdentifierValue);
});

step("Confirm sale", async function () {
    await waitFor(async () => (await text("Confirm Sale").exists()))
    await click("Confirm Sale");
});

step("Goto Odoo", async function () {
    await reload()
    await goto(process.env.odooURL, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
});

step("Click Quotations", async function () {
    await click("Quotations")
});