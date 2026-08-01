/**
 * Section — reusable semantic section wrapper with the project's standard white card style.
 *
 * Use when you need a block of content without a Card header, or when composing
 * custom layouts inside a page that still need the shared visual container.
 *
 * @param {React.ReactNode} children       - Section body content.
 * @param {string}          [className]    - Extra classes (e.g. custom padding or overflow).
 * @param {string}          [as='section'] - Root HTML element override (e.g. 'div', 'article').
 */
function Section({ children, className = '', as: Tag = 'section' }) {
  return (
    <Tag
      className={[
        'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  );
}

export default Section;
export { Section };
