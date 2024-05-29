Blocks © 2024 by Nullvariable is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/4.0/

# Installing
* Download the latest release.
* Add to your NPWD:
```

  "apps": [
    ...
    "npwd_app_blocks"
  ],
```
* Add to your server.cfg and ensure it starts before NPWD

# Building
I use bun, but npm pnpm or whatever the latest hotness is should work too
```
cd src
bun install
bun run build
```
