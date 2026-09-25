import { Fragment } from "react";

/** Render admin text, turning each newline into a <br />. */
export function withBreaks(text: string) {
  return text.split("\n").map((part, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {part}
    </Fragment>
  ));
}

/**
 * Heading built from admin fields: "[before] <em>[italic]</em>" with an
 * optional [after] on its own line. Newlines in `before` become line
 * breaks, so "Line one\nline two" and a trailing "\n" (italic on its
 * own line) both work.
 */
export function AccentTitle({
  before,
  italic,
  after,
  emClassName,
}: {
  before: string;
  italic: string;
  after?: string;
  emClassName: string;
}) {
  return (
    <>
      {withBreaks(before)}
      {before && italic && !before.endsWith("\n") ? " " : null}
      {italic && <em className={emClassName}>{italic}</em>}
      {after ? (
        <>
          <br />
          {withBreaks(after)}
        </>
      ) : null}
    </>
  );
}
