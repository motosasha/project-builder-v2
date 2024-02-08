// Remove the "no-js" class from the html, add the "js" class: from the style level we know whether JS works
document.documentElement.className = document.documentElement.className.replace("no-js", "js");

// touch/no-touch
"ontouchstart" in window ? cth("touch") : cth("no-touch");

// Browser
cth(getBrowser());

// OS
if (~navigator.appVersion.indexOf("Win")) cth("windows");
if (~navigator.appVersion.indexOf("Mac")) cth("osx");
if (~["iPhone", "iPod"].indexOf(navigator.platform)) cth("ios");
if (~["iPad"].indexOf(navigator.platform)) cth("ipados");
if (~navigator.appVersion.indexOf("Linux")) cth("linux");

// Adding 1vh (use: height: 100vh; height: calc(var(--vh, 1vh) * 100);) to fix 100vh on mobile phones
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty("--vh", `${vh}px`);
window.addEventListener("resize", () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
});

function cth(c) {
  document.documentElement.classList.add(c);
}

function getBrowser() {
  let userAgent = navigator.userAgent;
  let browser = "Unknown";

  // Detect Chrome
  if (/Chrome/.test(userAgent) && !/Chromium/.test(userAgent)) {
    browser = "chrome";
  }
  // Detect Chromium-based Edge
  else if (/Edg/.test(userAgent)) {
    browser = "edge";
  }
  // Detect Firefox
  else if (/Firefox/.test(userAgent)) {
    browser = "firefox";
  }
  // Detect Safari
  else if (/Safari/.test(userAgent)) {
    browser = "safari";
  }
  // Detect Internet Explorer
  else if (/Trident/.test(userAgent)) {
    browser = "ie";
  }
  return browser;
}
