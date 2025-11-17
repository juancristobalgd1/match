# match
**The match pattern in pure JavaScript**

```js
import { match, _ } from "match-pro";

match(user).case
  [{ role: "admin", perms: _ }]   -> "Dios"
  [{ name: $nombre }]             -> `Hola ${nombre}!`
  [_]                             -> "Invitado";
```

match/
├── package.json
├── README.md
├── LICENSE
├── src/
│   └── match.js          ← versión legible
├── dist/
│   └── match.min.js      ← versión minificada (780 bytes gzip)
├── match.d.ts
├── test/
│   └── match.test.js
└── benchmark/
    └── bench.js

  
