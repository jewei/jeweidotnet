---
title: "Uppa: A Small Uptime Monitor at the Edge"
description: "A self-hosted uptime monitor and public status page built for Cloudflare Workers."
pubDate: "2026-08-20T00:00:00.000+08:00"
tags: ["open-source", "cloudflare"]
image: ../../assets/content/uppa-og-image.jpg
---

Uppa is a self-hosted uptime monitor and public status page built for Cloudflare Workers. It checks up to 40 HTTP/HTTPS endpoints once per minute and stores rolling history and incidents in D1.

The status page shows service availability, uptime, latency history, and recent incidents. Two consecutive failed checks confirm an outage, while a single successful check confirms recovery. Uppa can also send generic webhook notifications when status changes.

Administration stays out of the browser. A local Bun CLI is used to add, edit, enable, disable, reorder, and remove monitors, so there is no public admin interface or authentication system to maintain.

[View the live demo](https://edge-uptime.jewei-mak.workers.dev/) or [browse the source code](https://github.com/jewei/uppa).
