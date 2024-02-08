const getScrollSize = function () {
  const outer = document.createElement("div");
  const inner = document.createElement("div");
  outer.style.overflow = "scroll";
  outer.classList.add("scrollbar");
  outer.appendChild(inner);
  document.body.appendChild(outer);
  const scrollbarSize = outer.offsetWidth - inner.offsetWidth;
  document.body.removeChild(outer);
  return scrollbarSize;
};

export default getScrollSize;
