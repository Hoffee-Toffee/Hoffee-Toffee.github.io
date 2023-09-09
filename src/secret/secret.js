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

async function check(text = String()) {
  const ref = db.collection('secrets').doc(text.toLowerCase())

  // Check spacing
  if (text.startsWith(' ') || text.endsWith(' ') || text.includes('  '))
    return null

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

const generateKey = async () => {
  return window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  )
}

const toKey = async (base64Key) => {
  const rawKey = toBuffer(base64Key)
  const key = await crypto.subtle.importKey(
    'jwk',
    rawKey,
    { name: 'AES-CBC', length: 256 },
    false,
    ['decrypt']
  )
  return key
}

const toBuffer = async (base64) => {
  const binaryString = atob(base64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

const encode = (data) => {
  const encoder = new TextEncoder()
  return encoder.encode(data)
}

const generateIv = () => {
  return window.crypto.getRandomValues(new Uint8Array(12))
}

const encrypt = async (data, key) => {
  const encoded = encode(data)
  const iv = generateIv()
  const cipher = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encoded
  )
  return {
    cipher,
    iv,
  }
}

const pack = (buffer) => {
  return window.btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)))
}

const unpack = (packed) => {
  const string = window.atob(packed)
  const buffer = new ArrayBuffer(string.length)
  const bufferView = new Uint8Array(buffer)
  for (let i = 0; i < string.length; i++) {
    bufferView[i] = string.charCodeAt(i)
  }
  return buffer
}

const decode = (bytestream) => {
  const decoder = new TextDecoder()
  return decoder.decode(bytestream)
}

const decrypt = async (cipher, key, iv) => {
  const encoded = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    cipher
  )
  return decode(encoded)
}

const app = async () => {
  // encrypt message
  const first = 'Hello, World!'
  const key = await generateKey()
  const { cipher, iv } = await encrypt(first, key)

  // pack and transmit
  await fetch('/secure-api', {
    method: 'POST',
    body: JSON.stringify({
      cipher: pack(cipher),
      iv: pack(iv),
    }),
  })

  // retrieve
  const response = await fetch('/secure-api').then((res) => res.json())

  // unpack and decrypt message
  const final = await decrypt(unpack(response.cipher), key, unpack(response.iv))
  console.log(final) // logs 'Hello, World!'
}
