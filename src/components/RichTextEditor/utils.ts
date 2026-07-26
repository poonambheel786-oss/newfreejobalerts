/**
 * Helper to insert custom HTML element or content exactly at the current range/caret position.
 */
export function insertHTMLAtCursor(html: string) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  range.deleteContents();

  const el = document.createElement("div");
  el.innerHTML = html;
  
  const frag = document.createDocumentFragment();
  let node: Node | null;
  let lastNode: Node | null = null;
  
  while ((node = el.firstChild)) {
    lastNode = frag.appendChild(node);
  }
  
  range.insertNode(frag);
  
  // Move selection cursor immediately after the inserted element
  if (lastNode) {
    const nextRange = range.cloneRange();
    nextRange.setStartAfter(lastNode);
    nextRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(nextRange);
  }
}

/**
 * Native Table Generator Helper
 */
export function generateHTMLTable(rows: number, cols: number): string {
  let table = `<table class="w-full border-collapse border border-slate-200 text-sm my-4">`;
  table += `<tbody>`;
  for (let r = 0; r < rows; r++) {
    table += `<tr>`;
    for (let c = 0; c < cols; c++) {
      table += `<td class="border border-slate-200 p-2 min-w-[60px]" valign="top">&nbsp;</td>`;
    }
    table += `</tr>`;
  }
  table += `</tbody></table>`;
  return table;
}
