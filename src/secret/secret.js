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
  var secret = document.getElementById('secret')

  secret.addEventListener('keydown', async (e) => {
    console.log(e)
    var char = e.key.toUpperCase()
    if (!new RegExp(/^[A-Z0-9 ]+$/).test(char)) {
      e.preventDefault()
    } else if (char == 'ENTER') {
      secret.readOnly = true

      var result = await check(secret.value.toUpperCase())

      console.log(result)

      secret.parentElement.parentElement.classList.add(
        result ? 'green' : 'shake'
      )
      var test = setTimeout(() => {
        if (result) {
          window.location.href = result
        } else {
          secret.parentElement.parentElement.classList.remove('shake')
          secret.value = null
          secret.readOnly = false
        }
      }, 1000)
    }
  })
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
