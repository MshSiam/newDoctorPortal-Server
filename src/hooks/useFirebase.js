import initializeFirebase from "../Pages/Login/Login/Firebase/firebase.init"
import { useState, useEffect } from "react"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  signOut,
  getIdToken
} from "firebase/auth"

// initialize firebase app
initializeFirebase()

const useFirebase = () => {
  const [user, setUser] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState("")
  const [admin, setAdmin] = useState(false)
  const [token, setToken] = useState("")

  const auth = getAuth()
  const googleProvider = new GoogleAuthProvider()

  const registerUser = (email, password, name, history) => {
    setIsLoading(true)
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setAuthError("")
        const newUser = { email, displayName: name }
        setUser(newUser)
        // save user to database
        saveUser(email, name, "POST")
        // send name to firebase after creation
        updateProfile(auth.currentUser, {
          displayName: name
        })
          .then(() => {})
          .catch((error) => {})
        history.replace("/")
      })
      .catch((error) => {
        setAuthError(error.message)
        console.log(error)
      })
      .finally(() => setIsLoading(false))
  }

  const loginUser = (email, password, location, history) => {
    setIsLoading(true)
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const destination = location?.state?.from || "/"
        history.replace(destination)
        setAuthError("")
      })
      .catch((error) => {
        setAuthError(error.message)
      })
      .finally(() => setIsLoading(false))
  }

  const signInWithGoogle = (location, history) => {
    setIsLoading(true)
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user
        setAuthError("")
        saveUser(user.email, user.displayName, "PUT")
      })
      .catch((error) => {
        setAuthError(error.message)
      })
      .finally(() => setIsLoading(false))
  }

  // observer user state
  useEffect(() => {
    const unsubscribed = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        getIdToken(user).then((idToken) => {
          setToken(idToken)
        })
      } else {
        setUser({})
      }
      setIsLoading(false)
    })
    return () => unsubscribed
  }, [])

  const logout = () => {
    setIsLoading(true)
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      })
      .finally(() => setIsLoading(false))
  }

  // admin searching
  useEffect(() => {
    fetch(`http://localhost:5000/users/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setAdmin(data.admin)
      })
  }, [user.email])

  // Save user to database
  const saveUser = (email, displayName, method) => {
    const user = { email, displayName }
    fetch(`http://localhost:5000/users`, {
      method: method,
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(user)
    })
  }

  return {
    user,
    admin,
    token,
    isLoading,
    authError,
    registerUser,
    loginUser,
    signInWithGoogle,
    logout
  }
}

export default useFirebase
