// Canonical-host redirect for www.stepsmedical.com.au.
//
// Both stepsmedical.com.au and www.stepsmedical.com.au are attached to this
// Worker as Custom Domains (see wrangler.jsonc). Static-asset _redirects
// files can only match relative paths, not hostnames, so this small script
// handles the host/scheme canonicalization instead, then hands everything
// else to the static assets (env.ASSETS) exactly as before.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isApex = url.hostname === "stepsmedical.com.au";
    const isInsecure = url.protocol === "http:";

    if (isApex || isInsecure) {
      url.hostname = "www.stepsmedical.com.au";
      url.protocol = "https:";
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
