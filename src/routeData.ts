import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

// Starlight labels the "top of page" ToC entry "Overview" on every page; use the page title instead.
export const onRequest = defineRouteMiddleware((context) => {
  const { toc, entry } = context.locals.starlightRoute;
  if (toc?.items[0]) toc.items[0].text = entry.data.title;
});
