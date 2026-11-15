import katex from 'katex';

/**
 * Renders math to KaTeX HTML at build time.
 *
 * Sätteri parses `$..$` and `$$..$$` natively (`features.math`) and emits the
 * same markup remark-math did — `<code class="language-math math-inline">` and
 * `<pre><code class="language-math math-display">`. Its hast plugins are
 * visitors rather than unified plugins, so rehype-katex cannot be used here;
 * this does the same job in ~30 lines and ships zero client-side JS.
 */
export function satteriKatex(options = {}) {
  return {
    name: 'satteri-katex',
    element: {
      filter: ['code'],
      visit(node, ctx) {
        const raw = node.properties?.className;
        const classes = Array.isArray(raw) ? raw : typeof raw === 'string' ? raw.split(/\s+/) : [];
        if (!classes.includes('language-math')) return;

        const displayMode = classes.includes('math-display');
        let html;
        try {
          html = katex.renderToString(ctx.textContent(node), {
            throwOnError: false,
            ...options,
            displayMode,
          });
        } catch (error) {
          ctx.report({ message: `KaTeX: ${error.message}`, node, severity: 'warning' });
          return;
        }

        // Display math sits inside a <pre>; replace the wrapper, not the <code>.
        const parent = displayMode ? ctx.parent(node) : undefined;
        const target =
          parent && parent.type === 'element' && parent.tagName === 'pre' ? parent : node;
        ctx.replaceNode(target, { type: 'raw', value: html });
      },
    },
  };
}
