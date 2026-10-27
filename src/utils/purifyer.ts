import DOMPurify from "dompurify";
export const onPurifyHtml = (html?: string | null) =>
  !html
    ? ""
    : DOMPurify.sanitize(html, {
        USE_PROFILES: { html: true },
        ADD_TAGS: ["style"],
        FORCE_BODY: true,
      });
