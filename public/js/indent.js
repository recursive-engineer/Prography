const TAB_STR = "    ";
document.addEventListener("keydown", (e) => {
  if (e.target.tagName !== "TEXTAREA" || e.keyCode !== 9) return false;
  e.preventDefault();
  const slct = { left: e.target.selectionStart, right: e.target.selectionEnd };
  const lineStart = e.target.value.substr(0, slct.left).split("\n").length - 1;
  const lineEnd = e.target.value.substr(0, slct.right).split("\n").length - 1;
  const lines = e.target.value.split("\n");
  for (const i in lines) {
    if (i < lineStart || i > lineEnd || lines[i] === "") continue;
    if (!e.shiftKey) {
      // 行頭にタブ挿入
      lines[i] = TAB_STR + lines[i];
      slct.left += i == lineStart ? TAB_STR.length : 0;
      slct.right += TAB_STR.length;
    } else if (lines[i].substr(0, TAB_STR.length) === TAB_STR) {
      // 行頭のタブ削除
      lines[i] = lines[i].substr(TAB_STR.length);
      slct.left -= i == lineStart ? TAB_STR.length : 0;
      slct.right -= TAB_STR.length;
    }
  }
  e.target.value = lines.join("\n");
  e.target.setSelectionRange(slct.left, slct.right);
  return false;
});
