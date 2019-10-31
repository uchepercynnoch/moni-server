const server = require('./server')
const Dinero = require('dinero.js')

const PORT = process.env.PORT || 5000

const bindServer = app => {
    app.listen(PORT, () => {
        console.log(
            `App is running at http://localhost:${PORT} in ${process.env.NODE_ENV} mode`
        )
    })
}

const registerGlobals = (app) => {
    /* Configure dinero globals */
    Dinero.globalFormat = '$0,0.00'
    Dinero.globalLocale = 'en-NG'

    return app
}

const exit = reason => {
    /* Log and gracefully terminate the app */
    console.log(reason)
    process.exit(1)
}

server()
    .then(registerGlobals)
    .then(bindServer)
    .catch(exit)
