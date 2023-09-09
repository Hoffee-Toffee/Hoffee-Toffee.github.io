// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCo60qhROgtrR78dRQb3KfqRi2iCcvPOJE',
  authDomain: 'portfolio-storage-db.firebaseapp.com',
  projectId: 'portfolio-storage-db',
  storageBucket: 'portfolio-storage-db.appspot.com',
  messagingSenderId: '87319847877',
  appId: '1:87319847877:web:4df2873ab307916251a1ac',
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()

window.onload = () => {
  var input = document.getElementsByTagName('input')[0]

  input.addEventListener('keydown', async (e) => {
    console.log(e)
    var char = e.key.toUpperCase()
    if (!new RegExp(/^[A-Z0-9 ]+$/).test(char)) {
      e.preventDefault()
      var current = document.getElementsByClassName('caret')[0]
      current.classList.add('shake')

      var test = setTimeout(() => {
        current.classList.remove('shake')
      }, 1000)
    }
    if (input.value.length == input.selectionStart && e.key == 'ArrowRight') {
      input.value += ' '
    }
  })

  input.addEventListener('keyup', async (e) => {
    if (e.key.startsWith('Arrow')) inputFunc(e)
  })

  input.addEventListener('input', (e) => inputFunc(e))
  input.addEventListener('paste', (e) => e.preventDefault())
  input.addEventListener('cut', (e) => e.preventDefault())
  input.addEventListener('mousemove', (e) => e.preventDefault())
  input.addEventListener('select', (e) => e.preventDefault())
  inputFunc()

  var spans = document.getElementsByTagName('header')[0].children[0].children
  Array.from(spans).forEach((span, i) => {
    span.addEventListener('click', (e) => {
      console.log('Running')
      input.focus()
      input.selectionStart = i - 1
      input.selectionEnd = i - 1
      inputFunc()
    })
  })
}

async function inputFunc(e) {
  console.log('e')
  var input = document.getElementsByTagName('input')[0]
  var spans = document.getElementsByTagName('header')[0].children[0].children

  Array.from(spans).forEach((span, i) => {
    span.innerHTML = input.value[i - 1] || ''
    span.classList = input.selectionStart == i - 1 ? 'caret' : ''
  })

  if (input.value.length == 7) {
    input.readOnly = true

    var result = await check(input.value.toUpperCase())

    console.log(result)

    input.parentElement.parentElement.classList.add(result ? 'green' : 'shake')
    var test = setTimeout(() => {
      if (result) {
        window.location.href = result
      }

      input.parentElement.parentElement.classList.remove(
        result ? 'green' : 'shake'
      )
      input.value = null
      input.readOnly = false

      inputFunc()
    }, 1000)
  }
}

async function check(text) {
  const ref = db.collection('secrets').doc(text.toLowerCase())

  try {
    const docSnapshot = await ref.get()

    if (docSnapshot.exists) {
      return new Promise((resolve) => {
        ref.onSnapshot((doc) => {
          const result = doc.data().location
          console.log(result)
          resolve(result)
        })
      })
    }
  } catch (err) {
    console.error(err)
    return null
  }

  return null
}
