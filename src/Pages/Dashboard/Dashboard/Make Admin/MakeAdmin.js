import { Alert, Button, TextField } from "@mui/material"
import React, { useState } from "react"
import useAuth from "../../../../hooks/useAuth"

const MakeAdmin = () => {
  const [email, setEmail] = useState("")
  const [success, setSuccess] = useState(false)
  const { token } = useAuth()

  const handleSubmit = (e) => {
    const user = { email }
    fetch("http://localhost:5000/users/admin", {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json"
      },
      body: JSON.stringify(user)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.modifiedCount) {
          console.log(data)
          setSuccess()
        }
      })
    e.preventDefault()
  }

  const handleOnBlur = (e) => {
    setEmail(e.target.value)
  }

  return (
    <div>
      <h1>MAke An Admin</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          sx={{ width: "90%", margin: 2 }}
          id="standard-basic"
          label="email"
          type="email"
          variant="standard"
          onBlur={handleOnBlur}
        />
        <br />
        {success && <Alert severity="success">Made Admin Successfully</Alert>}
        <Button type="submit" variant="contained">
          Make Admin
        </Button>
      </form>
    </div>
  )
}

export default MakeAdmin
