import test from 'ava'
import { createSpy, createMock } from '../src'

test('createSpy should record function calls', t => {
  const calls = []
  let i = 0
  const func = () => i++
  const spiedFunc = createSpy(calls, func, 'foo')

  const obj1 = {}
  const obj2 = {}

  spiedFunc(0)
  spiedFunc.call(obj1, 1, 2, 3)
  spiedFunc.apply(obj2, [4, 5, 6])

  t.is(calls.length, 3)
  t.true(calls.every(call => call.methodName === 'foo'))

  t.is(calls[0].context, global)
  t.is(calls[1].context, obj1)
  t.is(calls[2].context, obj2)

  t.deepEqual(calls[0].args, [0])
  t.deepEqual(calls[1].args, [1, 2, 3])
  t.deepEqual(calls[2].args, [4, 5, 6])

  calls.forEach((call, index) => {
    t.is(call.returned.value, index)
  })
})

test('createSpy should capture the returned value', t => {
  const calls = []
  const spy = createSpy(calls, () => 4)
  const returnValue = spy()

  t.is(returnValue, 4)
  t.is(calls[0].returned.value, 4)
})

test('createSpy should capture the thrown error', t => {
  const calls = []
  const error = new Error('test')
  const spy = createSpy(calls, () => {
    throw error
  })
  try {
    spy()
    t.fail()
  } catch (thrownError) {
    t.is(thrownError, error)
  }

  t.is(calls[0].threw.error, error)
})

test('createMock should spy on object methods', t => {
  const object = {
    method () {}
  }
  const { calls, mock } = createMock(object)
  mock.method()

  t.is(calls.length, 1)
})

test('createMock should copy non-function properties', t => {
  const object = {
    value: 4
  }
  const { mock } = createMock(object)

  t.is(mock.value, 4)
})

test('createMock should use provided implementations', t => {
  const object = {
    value: 1,
    method () {}
  }
  const implementations = {
    value: 6,
    method: () => 4
  }
  const { mock } = createMock(object, implementations)

  t.is(mock.value, 6)
  t.is(mock.method(), 4)
})
