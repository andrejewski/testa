function createSpy (calls, func, methodName) {
  return function _spy () {
    let value
    try {
      value = func.apply(this, arguments)
    } catch (error) {
      calls.push({
        methodName,
        context: this,
        args: [...arguments],
        arguments: arguments,
        didThrow: true,
        didReturn: false,
        threw: {
          error
        }
      })
      throw error
    }

    calls.push({
      methodName,
      context: this,
      args: [...arguments],
      arguments: arguments,
      didThrow: false,
      didReturn: true,
      returned: {
        value
      }
    })
    return value
  }
}

const hasOwnProperty = Object.prototype.hasOwnProperty

function createMock (object, implementations) {
  const calls = []
  const mock = Object.create(null)
  Object.keys(object).forEach(prop => {
    if (typeof object[prop] === 'function') {
      const func = (implementations && implementations[prop]) || (() => {})
      mock[prop] = createSpy(calls, func, prop)
    } else {
      const hasImplementation =
        implementations && hasOwnProperty.call(implementations, prop)
      mock[prop] = hasImplementation ? implementations[prop] : object[prop]
    }
  })

  return { calls, mock }
}

exports.createSpy = createSpy
exports.createMock = createMock
