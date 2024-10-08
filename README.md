# [Regraf](https://github.com/regraf-bots/regraf) Session local

[![NPM Version](https://img.shields.io/npm/v/@regraf/session-local.svg?style=flat-square)](https://www.npmjs.com/package/@regraf/session-local)
[![Nodejs](https://img.shields.io/node/v/@regraf/session-local.svg?style=flat-square)](https://www.npmjs.com/package/@regraf/session-local)
[![NPM downloads/month](https://img.shields.io/npm/dm/@regraf/session-local.svg?style=flat-square)](https://www.npmjs.com/package/@regraf/session-local)

> Middleware for locally stored sessions & database

### ⚡️ Features

- Any type of storage: `Memory`, `FileSync`, `FileAsync`, ... (implement your own)
- Any format you want: `JSON`, `BSON`, `YAML`, `XML`, ... (implement your own)
- Shipped together with power of `lodash`
- Supports basic DB-like operations (thanks to [lodash-id](https://github.com/typicode/lodash-id)):

  `getById`, `insert`, `upsert`, `updateById`, `updateWhere`, `replaceById`, `removeById`, `removeWhere`, `createId`,

## 🚀 Installation

```bash
$ npm install -S @regraf/session-local
```

> 💡 TIP: We recommend [`pnpm` package manager](https://pnpm.io/): `npm i -g pnpm` and then `pnpm i -S @regraf/session-local`.  
> It's in-place replacement for `npm`, [faster and better](https://pnpm.io/benchmarks) than `npm`/`yarn`, and [saves your disk space](https://pnpm.io/motivation#saving-disk-space-and-boosting-installation-speed).
---
### 📚 [Documentation & API](https://github.com/regraf-bots/session-local)
---
## 👀 Quick-start example

```js
const { Regraf } = require('regraf')
const LocalSession = require('@regraf/session-local')

const bot = new Regraf(process.env.BOT_TOKEN) // Your Bot token here

bot.use((new LocalSession({ database: 'example_db.json' })).middleware())

bot.on('text', (ctx, next) => {
  ctx.session.counter = ctx.session.counter || 0
  ctx.session.counter++
  ctx.replyWithMarkdownV2(`Counter updated, new value: \`${ctx.session.counter}\``)
  return next()
})

bot.command('/stats', (ctx) => {
  ctx.replyWithMarkdownV2(`Database has \`${ctx.session.counter}\` messages from @${ctx.from.username || ctx.from.id}`)
})

bot.command('/remove', (ctx) => {
  ctx.replyWithMarkdownV2(`Removing session from database: \`${JSON.stringify(ctx.session)}\``)
  // Setting session to null, undefined or empty object/array will trigger removing it from database
  ctx.session = null
})

bot.launch()
```

## 📄 Full example

```js
const { Regraf } = require('regraf')
const LocalSession = require('@regraf/session-local')

const bot = new Regraf(process.env.BOT_TOKEN) // Your Bot token here

const localSession = new LocalSession({
  // Database name/path, where sessions will be located (default: 'sessions.json')
  database: 'example_db.json',
  // Name of session property object in Regraf Context (default: 'session')
  property: 'session',
  // Type of lowdb storage (default: 'storageFileSync')
  storage: LocalSession.storageFileAsync,
  // Format of storage/database (default: JSON.stringify / JSON.parse)
  format: {
    serialize: (obj) => JSON.stringify(obj, null, 2), // null & 2 for pretty-formatted JSON
    deserialize: (str) => JSON.parse(str),
  },
  // We will use `messages` array in our database to store user messages using exported lowdb instance from LocalSession via Regraf Context
  state: { messages: [] }
})

// Wait for database async initialization finished (storageFileAsync or your own asynchronous storage adapter)
localSession.DB.then(DB => {
  // Database now initialized, so now you can retrieve anything you want from it
  console.log('Current LocalSession DB:', DB.value())
  // console.log(DB.get('sessions').getById('1:1').value())
})

// Regraf will use `@regraf/session-local` configured above middleware
bot.use(localSession.middleware())

bot.on('text', (ctx, next) => {
  ctx.session.counter = ctx.session.counter || 0
  ctx.session.counter++
  ctx.replyWithMarkdownV2(`Counter updated, new value: \`${ctx.session.counter}\``)
  // Writing message to Array `messages` into database which already has sessions Array
  ctx.sessionDB.get('messages').push([ctx.message]).write()
  // `property`+'DB' is a name of ctx property which contains lowdb instance, default = `sessionDB`

  return next()
})

bot.command('/stats', (ctx) => {
  ctx.replyWithMarkdownV2(`Session has \`${ctx.session.counter}\` messages from @${ctx.from.username || ctx.from.id}`)
})

bot.command('/remove', (ctx) => {
  ctx.replyWithMarkdownV2(`Removing session from lowdb database: \`${JSON.stringify(ctx.session)}\``)
  // Setting session to null, undefined or empty object/array will trigger removing it from database
  ctx.session = null
})

bot.launch()
```

#### Another examples located in `/examples` folder (PRs welcome)
Also, you may read comments in  [/lib/session.js](https://github.com/regraf-bots/session-local/blob/master/lib/session.js)
