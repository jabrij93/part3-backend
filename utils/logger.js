const info = (...params) => {
  if (process.env.NODE_ENV === 'start:test') {
    console.log("## TEST MODE ##")
    console.log(...params)
    console.log("## TEST MODE ##")
} else {
  console.log(...params)
}
}

const error = (...params) => {
  if (process.env.NODE_ENV === 'start:test') { 
    console.log("## TEST MODE ##")
    console.error(...params)
    console.log("## TEST MODE ##")
  } else {
    console.error(...params)
    }
}

module.exports = {
    info, error
}