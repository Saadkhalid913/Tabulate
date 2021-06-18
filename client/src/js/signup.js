function main() {
  const signupbutton = document.getElementById("btn-signup-submit").addEventListener("click", submitSignup)
}

function submitSignup() {
  const first_name = document.getElementById("inp-first-name").value
  const last_name = document.getElementById("inp-last-name").value
  const email = document.getElementById("inp-email").value
  const password = document.getElementById("inp-password").value

  if (!validateInput(email, password)) return
  console.log({ first_name, last_name, email, password })
  clearInput()
}

function validateInput(email, password) {
  const emailValidationPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (!email.match(emailValidationPattern)) return false
  return true
}

function clearInput() {
  // document.getElementById("inp-first-name").value = ""
  // document.getElementById("inp-last-name").value = ""
  // document.getElementById("inp-email").value = ""
  document.getElementById("inp-password").value = ""
}

main()