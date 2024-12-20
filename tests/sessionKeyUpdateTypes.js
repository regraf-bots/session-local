/* eslint object-curly-spacing: ["error", "always"] */
const
  { Regraf } = require('regraf'),
  LocalSession = require('../lib/session'),
  should = require('should'),
  debug = require('debug')('regraf:session-local:test'),
  options = { storage: LocalSession.storageMemory }

describe('Regraf Session local : Session Key Update Types', () => {
  let bot = {}
  const localSession = new LocalSession(options)

  it('Should handle message', (done) => {
    bot = new Regraf()
    bot.botInfo = {}
    bot.on('text', (ctx) => {
      const sessionKey = localSession.getSessionKey(ctx)
      debug('Session key', sessionKey)
      sessionKey.should.be.equal('2:1')
      done()
    })
    bot.handleUpdate({ message: { chat: { id: 2 }, from: { id: 1 }, text: 'hey' } })
  })

  it('Should handle inline_query', (done) => {
    bot = new Regraf()
    bot.botInfo = {}
    bot.on('inline_query', (ctx) => {
      const sessionKey = localSession.getSessionKey(ctx)
      debug('Session key', sessionKey)
      should.exist(sessionKey)
      sessionKey.should.be.equal('1:1')
      done()
    })
    bot.handleUpdate({ inline_query: { from: { id: 1 }, query: '' } })
  })

  it('Should handle callback_query from chat', (done) => {
    bot = new Regraf()
    bot.botInfo = {}
    bot.action('c:b', (ctx) => {
      const sessionKey = localSession.getSessionKey(ctx)
      debug('Session key', sessionKey)
      should.exist(sessionKey)
      sessionKey.should.be.equal('2:1')
      done()
    })
    bot.handleUpdate({ callback_query: { from: { id: 1 }, message: { from: { id: 3 }, chat: { id: 2 }, text: 'hey' }, chat_instance: '-123', data: 'c:b' } })
  })

  it('Should handle callback_query from inline_query message', (done) => {
    bot = new Regraf()
    bot.botInfo = {}
    bot.action('c:b', (ctx) => {
      const sessionKey = localSession.getSessionKey(ctx)
      debug('Session key', sessionKey)
      should.exist(sessionKey)
      sessionKey.should.be.equal('-123:1')
      done()
    })
    bot.handleUpdate({ callback_query: { from: { id: 1 }, inline_message_id: 'BAA', chat_instance: '-123', data: 'c:b' } })
  })
})
