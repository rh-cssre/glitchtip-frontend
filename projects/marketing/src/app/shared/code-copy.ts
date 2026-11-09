/**
 * Injects a copy-to-clipboard button into each code block under `host`. Used by
 * the blog and documentation pages after their markdown renders. The button
 * carries the global .doc-copy class and shows the content_copy / check icon.
 * Idempotent: blocks that already have a button are skipped.
 */
export function addCodeCopyButtons(host: HTMLElement): void {
  const blocks = host.querySelectorAll<HTMLElement>(".markdown-container pre");
  blocks.forEach((pre) => {
    if (pre.querySelector(".doc-copy")) {
      return;
    }
    // Read the code before appending the button, so the button's own label can
    // never leak into the copied text.
    const code = (pre.querySelector("code") ?? pre).textContent ?? "";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "doc-copy";
    button.textContent = "content_copy";
    button.setAttribute("aria-label", "Copy code");
    button.addEventListener("click", () => {
      void navigator.clipboard?.writeText(code)?.then(() => {
        button.textContent = "check";
        button.classList.add("is-copied");
        button.setAttribute("aria-label", "Copied");
        setTimeout(() => {
          button.textContent = "content_copy";
          button.classList.remove("is-copied");
          button.setAttribute("aria-label", "Copy code");
        }, 1500);
      });
    });
    pre.appendChild(button);
  });
}
