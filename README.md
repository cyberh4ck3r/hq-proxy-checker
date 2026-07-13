# HQ Proxy Checker

[![License](https://img.shields.io/github/license/cyberh4ck3r/hq-proxy-checker)](/cyberh4ck3r/hq-proxy-checker/blob/main/LICENSE)

Fast HTTP/HTTPS proxy checker for HQ proxies. Paste proxies, get results, copy working ones.

## features

- 1 second timeout for HQ proxy validation
- HTTP & HTTPS support
- Live progress bar
- Working/dead stats
- Copy all working proxies with one click
- Dark minimal UI
- No backend required, runs 100% in the browser

## usage

1. open `index.html` in your browser
2. paste your proxies (one per line, format: `ip:port`)
3. select HTTP or HTTPS
4. click **Check**
5. copy working proxies when done

or use it online: **https://cyberh4ck3r.github.io/hq-proxy-checker/**

## note

this tool uses CORS proxies to validate HTTP/HTTPS connections from the browser. SOCKS proxies are not supported due to browser limitations.

## credits

made by ekv7

## license

[MIT](LICENSE)
