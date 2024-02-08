var ready = function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
};

// import getScrollSize from "../js/utils/getScrollSize.js";

ready(function () {
  console.log("JS works!");
  // Adding a custom property with a system scroll width
  // document.documentElement.style.setProperty("--css-scroll-size", `${getScrollSize()}px`);
});

// import $ from "jquery"; // Install as dependency before use
// $(function () {
//   console.log("jQuery works!");
// });
//# sourceMappingURL=bundle.js.map
