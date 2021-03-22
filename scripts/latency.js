const fs = require('fs')

const calcLatency = (cloudLatency, queryType) => {
    fs.readFile('./logs/endtoend.log', (err, data) => {
        if (err) {
            console.log(err)
        } else {
            // Get last line and number from end-to-end latency-log
            data = `${data}`.trim().split('\n')
            let lastLine = data.pop()
            let e2e = lastLine.split(':')
            let header = `${e2e[1].split('ms')[1].trim()} || Customer.${queryType}()`
            let e2eLatency = parseFloat(e2e[1].split('ms')[0].trim())

            // Log formatted latency-string to console
            let newLog = `\n${header}\n - End-to-end latency: ${e2eLatency} ms\n - Cloud processing latency: ${cloudLatency} ms\n - Communication latency: ${(e2eLatency - cloudLatency)} ms`
            console.log('⏳ Latency', newLog, '\n')
        }
    })
}

module.exports = calcLatency