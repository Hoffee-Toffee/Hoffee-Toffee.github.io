// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBr-FeYR-6PIlK5JXVs5K50C9mtTpp-DEo",
  authDomain: "datacord-db.firebaseapp.com",
  projectId: "datacord-db",
  storageBucket: "datacord-db.appspot.com",
  messagingSenderId: "590361883150",
  appId: "1:590361883150:web:cf62a24d59b3b71173825f",
  measurementId: "G-X5FM6KYXKM"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()
const auth = firebase.auth()

db.collection('data')
  .doc('sneezeData')
  .onSnapshot(async () => {
    const doc = await db.collection('data').doc('sneezeData').get()
    const sneezeData = JSON.parse(doc.data().data)

    let start = false

    if (window['sneezeData'] == undefined) start = true

    window['sneezeData'] = sneezeData

    if (start) setInterval(sneezeCalc, 800)
  })

function count2Level(count) {
  if (count < 1) return 1
  if (count < 3) return 2
  if (count < 6) return 3
  if (count < 10) return 4
  if (count < 15) return 5
  if (count < 21) return 6
  if (count < 30) return 7
  return 8
}

async function sneezeCalc() {
  const { count, updated } = window['sneezeData']

  // setup?
  if (window.page !== window.prevPage || window.prevPage == undefined) {
    await setup()
    window.prevPage = window.page
  }

  // count
  set('count', count.toLocaleString())

  // started
  const started = new Date('December 31, 2022 11:59 PM GMT+1300 (New Zealand Daylight Time')
  set('start', formatFullDate(started))

  // updated
  const updatedDate = new Date(updated);
  set('updated', formatFullDate(updatedDate))

  // now
  const now = new Date()
  set('now', formatFullDate(now))

  // Ms since count start
  const msAgo = new Date() - started

  // daily
  // Divide count by difference in ms of current and start, (ms / (1000*60*60*24)) to get as days
  const daily = count / (msAgo / (1000 * 60 * 60 * 24))
  set('daily', daily.toLocaleString())

  // interval
  const intervalRaw = msAgo / count
  const interval = formatRelativeDate(intervalRaw, 0)
  set('interval', interval)

  // thousand
  const thousandMS = nextMilestone(1, count)
  set('thousandMS', thousandMS.toLocaleString())

  const thousand = thousandMS / (count / msAgo) - msAgo + updatedDate.getTime()
  set('thousand', formatRelativeDate(thousand, updatedDate))

  // tenThousand
  const tenThousandMS = nextMilestone(2, count)
  set("tenThousandMS", tenThousandMS.toLocaleString())

  const tenThousand = tenThousandMS / (count / msAgo) - msAgo + updatedDate.getTime()
  set('tenThousand', formatRelativeDate(tenThousand, updatedDate))

  // hunThousand
  const hunThousandMS = nextMilestone(3, count)
  set("hunThousandMS", hunThousandMS.toLocaleString())

  const hunThousand = hunThousandMS / (count / msAgo) - msAgo + updatedDate.getTime()
  set('hunThousand', formatRelativeDate(hunThousand, updatedDate))
}

function set(id, value) {
  let el = document.getElementById(id)
  if (el.innerText !== value) el.innerText = value
}

function formatFullDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  })
}

function formatRelativeDate(estimate, start) {
  let currentDate = (start !== undefined) ? new Date(start) : new Date()
  let estimateDate = new Date(estimate);
  let timeDiff = estimateDate - currentDate;

  let seconds = Math.floor(timeDiff / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  let years = Math.floor(days / 365);

  if (years >= 10) { // Just show the estimated year if a decade or so in the future
    return estimateDate.getFullYear().toString();
  } else if (years >= 2) { // Just show the estimated month and year if a couple of years or so in the future
    return estimateDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  } else if (days >= 7) { // Just show the month and day if a week or so in the future (plus the year to avoid confusion)
    return estimateDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } else if (days >= 1) { // Just show the days and hours remaining if over a day in the future
    hours %= 24
    return `${days} ${days === 1 ? 'day' : 'days'}${hours > 0 ? ` and ${hours} ${hours === 1 ? 'hour' : 'hours'}` : ''}`;
  } else if (hours >= 1) { // Just show the hours and minutes remaining if an hour or so in the future
    minutes %= 60
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}${minutes > 0 ? ` and ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}` : ''}`;
  } else if (minutes >= 1) { // Just show the minutes and seconds remaining if a minute or so in the future
    seconds %= 60;
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}${seconds > 0 ? ` and ${seconds} ${seconds === 1 ? 'second' : 'seconds'}` : ''}`;
  } else { // Finally, all remaining estimates must be seconds away (negatives will go here, but none should be generated by this program)
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
  }
}

function nextMilestone(level, count) {
  let milestone = 100 * Math.pow(10, level)
  let round = Math.ceil(count / milestone) * milestone

  return round == count ? count + milestone : round
}

function calendarChange(event) {
  window.page = new Date(event.target.title)
}

async function setup() {
  // Get first and last entry to get the bounds
  let firstEntry = Object.keys(sneezeData.calendar)[0]
  let lastEntry = Object.keys(sneezeData.calendar)[Object.keys(sneezeData.calendar).length - 1]

  // Get / Set which page to be on
  let monthStart = window.page

  if (!monthStart) {
    let today = new Date()
    monthStart = new Date(today.toDateString().split(" ").filter((_, i) => i % 2).join(" "))

    window.page = monthStart
  }

  let yearStart = new Date(monthStart.getFullYear().toString())

  let yearOffset = yearStart.getDay()
  let monthOffset = monthStart.getDay()

  const yearSquares = document.querySelector('.yearly .squares');
  const monthSquares = document.querySelector('.monthly .squares');

  // Clear squares
  yearSquares.innerHTML = ""
  monthSquares.innerHTML = ""

  // Set names check if buttons should be toggled
  const yearlySwitch = document.querySelector('.yearly .switch');
  const monthlySwitch = document.querySelector('.monthly .switch');

  yearlySwitch.children[0].title = `${yearStart.getFullYear() - 1}`
  yearlySwitch.children[1].innerHTML = yearStart.getFullYear()
  yearlySwitch.children[2].title = `${yearStart.getFullYear() + 1}`

  // Loop over the switch anchors, giving them an onclick function
  document.querySelectorAll('.switch a').forEach(tag => tag.addEventListener('click', calendarChange))

  monthStart.setMonth(monthStart.getMonth() - 1)

  monthlySwitch.children[0].title = `${monthStart.toDateString().split(" ").filter((_, i) => i % 2).join(" ")}`

  monthStart.setMonth(monthStart.getMonth() + 1)

  monthlySwitch.children[1].innerHTML = `${monthStart.toDateString().split(" ").filter((_, i) => i % 2).join(" ")}`

  monthStart.setMonth(monthStart.getMonth() + 1)

  monthlySwitch.children[2].title = `${monthStart.toDateString().split(" ").filter((_, i) => i % 2).join(" ")}`

  monthStart.setMonth(monthStart.getMonth() - 1)

  // Yearly
  for (var i = 1; i < 372; i++) {
    let level = 0
    let count = 0

    // Get the date for this block
    let thisDate = new Date(yearStart)
    thisDate.setMonth(0, i - yearOffset)
    let thisData = undefined
    let classes = []

    if (thisDate.getFullYear() == yearStart.getFullYear()) { // If in the year
      // Set to '4' if sneeze count for that date
      thisData = sneezeData.calendar[thisDate.toLocaleDateString('en-NZ')]
      count = thisData ? thisData.count : 0
      level = count2Level(count)
      if (!thisData || thisData.confirmed == false) classes.push('unconfirmed')
    }

    yearSquares.insertAdjacentHTML('beforeend', `<li class="${classes.join(" ")}" date="${thisDate.toDateString()}" record="${(thisData) ? `${count} sneeze${count == 1 ? "" : "s"}` : "No record"}" extra="${(thisData && thisData.count > 0 && !thisData.confirmed) ? "(Unconfirmed)" : ""}"data-level="${level}"></li>`);
  }

  // Monthly
  for (var i = 1; i < 42; i++) {
    let level = 0
    let count = 0

    // Get the date for this block
    let thisDate = new Date(monthStart)
    thisDate.setDate(i - monthOffset)
    let thisData = undefined
    let classes = []

    if (thisDate.getMonth() == monthStart.getMonth()) { // If in the month
      // Set to '4' if sneeze count for that date
      thisData = sneezeData.calendar[thisDate.toLocaleDateString('en-NZ')]
      count = thisData ? thisData.count : 0
      level = count2Level(count)
      if (!thisData || thisData.confirmed == false) classes.push('unconfirmed')
    }

    let title = (thisData) ? `${count} sneeze${count == 1 ? "" : "s"}${thisData.confirmed ? '' : ' (unconfirmed)'}` : "No record"

    monthSquares.insertAdjacentHTML('beforeend', `<li class="${classes.join(" ")}" title="${thisDate.toDateString()} - ${title}" data-level="${level}"></li>`);
  }
}