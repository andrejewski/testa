# Testu
> Spy and mock test utilities

```sh
npm install testu
```

[![npm](https://img.shields.io/npm/v/testu.svg)](https://www.npmjs.com/package/testu)
[![Build Status](https://travis-ci.org/andrejewski/testu.svg?branch=master)](https://travis-ci.org/andrejewski/testu)
[![Greenkeeper badge](https://badges.greenkeeper.io/andrejewski/testu.svg)](https://greenkeeper.io/)

Testu provides function spies and object mocks.
The value prop is a small API with minimal magic.

## Examples

```js
import assert from 'assert'
import { createSpy, createMock } from 'testu'

const calls = []
const testFn = createSpy(calls, () => 4)

const value = testFn()

assert(value === 4)
assert(calls.length === 1)
assert(calls[0].returned.value === 4)

const object = {
  method: () => 1
}
const { calls: mockCalls, mock } = createMock(object, { method: () => 4 })
const value = mock.method()

assert(value === 4)
assert(mockCalls.length === 1)
assert(mockCalls[0].returned.value === 4)
```

## Documentation

- [`createSpy(calls, func, methodName)`](#createspy)
- [`createMock(object, implementations)`](#createmock)
- [`Call`](#call)

### `createSpy`
> `createSpy(calls: Array<Call>, func: Function[, methodName: String]): Function`

Create a spy which will call `func` with its context (`this`) and arguments.
Each function call will append a `Call` to the `calls` array.
The optional `methodName` can be used to label a set of calls from a particular function.

### `createMock`
> `createMock(object[, implementations]): { calls: Array<Call>, mock }`

Create a mock object with the properties of `object`.
If `implementations` exist for a particular property, the `mock` will use that.
Unimplemented methods will return undefined.
Unimplemented non-methods will be copied over to the `mock`.
Methods are spied automatically and recorded in `calls`.

### `Call`

Objects representing function calls.

```ts
interface Call {
  methodName: string?,
  context: any,
  args: Array<any>,
  arguments: Arguments,
  didThrow: boolean,
  threw?: {
    error: any
  }
  didReturn: boolean,
  returned?: {
    value: any
  }
}
```

## Name origin

Testing for Gangsters, and [Chuck Testu](https://www.youtube.com/user/ojaivalleytaxidermy)