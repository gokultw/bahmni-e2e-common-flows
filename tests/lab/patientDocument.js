"use strict"
const { fileField, click, attach, button, $, highlight, image, toLeftOf, below, text, waitFor, } = require('taiko');
const path = require('path');
const taikoHelper = require("../util/taikoHelper")
var assert = require("assert")

step("Add a report <labReport> to <module>", async function (labReport, module) {
	await attach(path.join("./data", `${labReport}.jpg`), fileField({ 'name': 'image-document-upload' }), { waitForEvents: ['DOMContentLoaded'] });
	await taikoHelper.repeatUntilNotFound($("#overlay"))
	await taikoHelper.repeatUntilEnabled(button('SAVE'))
});

step("Save the report", async function () {
	await highlight('SAVE')
	await click(button('SAVE'), { waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
	await taikoHelper.repeatUntilNotFound($("#overlay"))
	await click($("//select/../img"));
	assert.ok(await $("//div[@class='image-container']//img").exists());
	await waitFor(3000)
	await click(button({"class":"dialog-close-btn"}))
	await waitFor(async () => !(await $("//div[@class='image-container']//img").exists()))
});

step("validate patient document in patient dashboard", async function() {
	await click($("//a[@class='img-concept']"));
	assert.ok(await $("//img[@class='slide']").exists());
	await click(button({"class": "dialog-close-btn" }))
});
