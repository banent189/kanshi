const fs = require('fs');
let c = fs.readFileSync('d:/桌面/简纸NEW/todo.html', 'utf-8');

// Remove nested <div class="cfg-row"> inside crendInput
// The problematic section in the JS source code (inside template literal) looks like:
// '<div class="cfg-row"><input class="cfg-input" id="crendCnt"...'
// and '<div class="cfg-row"><input class="cfg-input" id="crendD"...'
// which are nested inside crendInput that already has class="cfg-row"
// Also fix closing tags

// Strategy: find the literal string patterns in the file and fix them
// In the file, the text literally is:
//   '<div class="cfg-row"><input class="cfg-input" id="crendCnt"

// Step 1: Remove nested cfg-row for crendCnt - replace the literal string
c = c.replace(
  "'<div class=\"cfg-row\"><input class=\"cfg-input\" id=\"crendCnt\"",
  "'<input class=\"cfg-input\" id=\"crendCnt\""
);

// Step 2: Fix the span closing - was "</span></div>" now should be "</span>"
c = c.replace(
  "<span style=\"font-size:10px;color:#A1A1AA\">次</span></div>'",
  "<span style=\"font-size:10px;color:#A1A1AA;margin-left:4px\">次</span>'"
);

// Step 3: Remove nested cfg-row for crendD
c = c.replace(
  "'<div class=\"cfg-row\"><input class=\"cfg-input\" id=\"crendD\"",
  "'<input class=\"cfg-input\" id=\"crendD\""
);

// Step 4: Fix extra closing divs — should be '</div>' not '</div></div>'
// After crend content: we had '</div></div>' (closing crendInput AND an extra outer div)
// Should be just '</div>' (closing crendInput)
c = c.replace(
  "style=\"width:auto\" /></div></div></div>'",
  "style=\"width:auto\" /></div>'"
);

// Step 5: Change crendInput from class="cfg-row" to inline-flex
c = c.replace(
  'class="cfg-row">\'+\n    \'<div id="crendInput"',
  'style="display:flex;align-items:center;gap:6px;margin-top:4px">\'+\n    \'<div id="crendInput"'
);
// The original has crendInput with class="cfg-row", need to fix that too
c = c.replace(
  '<div id="crendInput" style="display:',
  '<div id="crendInput2" style="display:'
);
// Actually, let me find the exact line and fix it
// The file has: '<div id="crendInput" style="display:'+(curEnd==='after'||curEnd==='on'?'block':'none')+'" class="cfg-row">'
// We need to remove class="cfg-row" and change display to flex

c = c.replace(
  "style=\"display:'+(curEnd==='after'||curEnd==='on'?'block':'none')+'\" class=\"cfg-row\"",
  "style=\"display:'+(curEnd==='after'||curEnd==='on'?'flex':'none')+'\""
);

fs.writeFileSync('d:/桌面/简纸NEW/todo.html', c, 'utf-8');
console.log('Fix applied');
