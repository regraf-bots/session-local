const { Regraf } = require('regraf')
const LocalSession = require('../lib/session') // require('@regraf/session-local')

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
