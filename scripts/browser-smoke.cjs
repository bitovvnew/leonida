// Set CHROME_BIN to a Chromium executable. This test uses a temporary profile.
const {spawn} = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const assert = require("node:assert/strict");
const {pathToFileURL} = require("node:url");
const {once} = require("node:events");
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "leonida-qa-"));
const chrome = spawn(process.env.CHROME_BIN || "chromium", [
  "--headless", "--disable-gpu", "--disable-extensions", "--no-first-run",
  "--remote-debugging-pipe", "--user-data-dir=" + profile, "about:blank"
], {stdio:["ignore","ignore","ignore","pipe","pipe"], windowsHide:true});
const waiting = new Map();
let sequence = 0, pending = "";
chrome.stdio[4].setEncoding("utf8");
chrome.stdio[4].on("data", chunk => {
  pending += chunk;
  let end;
  while ((end = pending.indexOf("\0")) >= 0) {
    const response = JSON.parse(pending.slice(0, end));
    pending = pending.slice(end + 1);
    waiting.get(response.id)?.(response);
  }
});
function command(method, params = {}, sessionId) {
  const id = ++sequence;
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(Error(method + " timed out")), 10000);
    waiting.set(id, response => {
      clearTimeout(timeout); waiting.delete(id);
      if (response.error) reject(Error(response.error.message)); else resolve(response.result);
    });
    chrome.stdio[3].write(JSON.stringify({id,method,params,sessionId}) + "\0");
  });
}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function test() {
  const {targetId} = await command("Target.createTarget",{url:"about:blank"});
  const {sessionId} = await command("Target.attachToTarget",{targetId,flatten:true});
  const run = (method,params) => command(method,params,sessionId);
  const evaluate = async expression => {
    const result = await run("Runtime.evaluate",{expression,returnByValue:true});
    if (result.exceptionDetails) throw Error(result.exceptionDetails.text);
    return result.result.value;
  };
  await run("Page.navigate",{url:pathToFileURL(path.resolve(__dirname,"../index.html")).href});
  for (let i=0;i<80;i++) {
    if (await evaluate("document.querySelector('.hero-art')?.naturalWidth > 0 && document.readyState === 'complete'")) break;
    await sleep(100);
  }
  assert(await evaluate("document.querySelector('.hero-art').naturalWidth > 0"));
  for (const width of [390,1440]) {
    await run("Emulation.setDeviceMetricsOverride",{width,height:900,deviceScaleFactor:1,mobile:false});
    assert(await evaluate("document.documentElement.scrollWidth <= innerWidth"));
  }
  await evaluate("document.querySelector('[data-launch]').click()");
  await sleep(350);
  assert(await evaluate("drive.open && parseInt(meters.value) > 0"));
  await evaluate("document.querySelector('#pause').click()");
  const paused = await evaluate("meters.value");
  await sleep(200);
  assert.equal(await evaluate("meters.value"),paused);
  await evaluate("document.querySelector('#close').click()");
  assert.equal(await evaluate("drive.open"),false);
  console.log("Desktop and mobile layout, offline art, drive, pause and close passed.");
}
test().catch(error => {console.error(error);process.exitCode=1;}).finally(async () => {
  const exited = chrome.exitCode === null && chrome.signalCode === null ? once(chrome,"exit") : null;
  chrome.kill();
  if (exited) await exited;
  try { fs.rmSync(profile,{recursive:true,force:true,maxRetries:5,retryDelay:150}); } catch {}
});
