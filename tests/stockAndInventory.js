const { goto, below, write, textBox, into, click, toLeftOf, checkBox, reload, text, waitFor, highlight, screenshot } = require('taiko');

step("enter odoo username", async function () {
    await write(process.env.odooUsername, into(textBox(below("Email"))));
});

step("enter odoo password", async function () {
    await write(process.env.odooPassword, into(textBox(below("Password"))));
});

step("Log in to odoo", async function () {
    await click("Log in", { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
});

step("Click Sales", async function () {
    await click("Sales", { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
});

step("View Quotations below direct sales", async function () {
    await click("Quotations", below("Direct Sales"));
});

step("select Customer", async function () {
    var patientIdentifierValue = gauge.dataStore.scenarioStore.get("patientIdentifier");
    var maxRetry = 5
    while (maxRetry > 0) {
        await waitFor(1000);
        if (await text(patientIdentifierValue).exists(500, 1000)) {
            maxRetry = 0
            await click(patientIdentifierValue);
        }
        else {
            maxRetry = maxRetry - 1;
            console.log(" Waiting for 5 seconds and reload the Quotations page. Remaining attempts " + maxRetry)
            await waitFor(4000);
            await reload({ waitForNavigation: true });
        }
    }
});

step("Confirm sale", async function () {
    await waitFor(async () => (await text("Confirm Sale").exists()))
    await click("Confirm Sale");
});

step("Goto Odoo", async function () {
    await goto(process.env.odooURL, { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
});

step("Click Quotations", async function () {
    await click("Quotations", { waitForNavigation: true, navigationTimeout: process.env.actionTimeout })
});