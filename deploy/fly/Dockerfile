# Minimal BusyBox HTTP server to host the static Cosmic Helix Renderer on Fly.io.
# ND-safe rationale: no dynamic runtimes, no build steps, just static files served calmly.
FROM alpine:3.19
WORKDIR /srv/cosmic
COPY index.html ./
COPY js ./js
COPY data ./data
COPY README_RENDERER.md ./README_RENDERER.md
ENV PORT=8080
EXPOSE 8080
CMD ["busybox", "httpd", "-f", "-p", "8080"]
