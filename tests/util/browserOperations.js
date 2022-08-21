const {
    openBrowser,
    closeBrowser,
    screenshot,
    reload,
    setConfig,
    closeTab,
    $,
    video,
    waitFor
} = require('taiko');
const path = require('path');
const taikoHelper = require("../util/taikoHelper");
const console = require('console');
const fileExtension = require("../util/fileExtension")
const headless = process.env.headless_chrome.toLowerCase() === 'true';

beforeSuite(async () => {
    fileExtension.removeDir(process.env.video_file_path);
});

afterSuite(async () => {
});

// Return a screenshot file name
gauge.customScreenshotWriter = async function () {
    const screenshotFilePath = path.join(process.env['gauge_screenshots_dir'],
        `screenshot-${process.hrtime.bigint()}.png`);

    await screenshot({
        path: screenshotFilePath
    });
    return path.basename(screenshotFilePath);
};

step("reload the page", async function () {
    await reload({ waitForNavigation: true, navigationTimeout: process.env.actionTimeout });
});

step("close tab", async function () {
    await closeTab()
});

var videoDir
beforeScenario(async (context) => {
    await openBrowser({ headless: headless, args: ["--no-sandbox", "--disable-dev-shm-usage", '--use-fake-ui-for-media-stream', "--window-size=1440,900"] })
    await setConfig({ ignoreSSLErrors: true });
    let scenarioName = context.currentScenario.name;
    videoDir = process.env.video_file_path + '/' + scenarioName.replace(/ /g, "_")
    await video.startRecording(videoDir + '/video.mp4');
});

afterScenario(async (context) => {
    try {
        await video.stopRecording();
        if (!context.currentScenario.isFailed) {
            fileExtension.removeDir(videoDir);
            console.log("Video deleted for scenario - " + context.currentScenario.name)
        } else {
            if (fileExtension.exists(videoDir)) {
                console.log("Video successfully saved - " + videoDir+'/video.mp4')
            } else {
                console.log("Video not successfully saved for scenario - " + context.currentScenario.name)
            }
        }
    } catch (e) {
        console.log("Error Stopping Video - " + e.message)
    }
    try {
        await closeBrowser();
    }
    catch (e) {
        console.log("Error closing browser - " + e.message)
    }
});