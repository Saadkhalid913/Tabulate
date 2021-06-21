function main() {
  const signupbutton = document.getElementById("btn-signup-submit").addEventListener("click", submitSignup)
}

async function UserAlert(alert, color, duration = 2000) {
  const RED = "#EF233C"
  const GREEN = "#00A878"
  const alertDiv = document.getElementById("user-alert")
  alertDiv.style.backgroundColor = (!color) ? RED : GREEN;
  alertDiv.innerText = alert
  alertDiv.style.transform = "translate(0%, 0%)"

  await setTimeout(() => { alertDiv.style.transform = "translate(0%, -100%)" }, duration)
}

async function submitSignup() {
  const first_name = document.getElementById("inp-first-name").value
  const last_name = document.getElementById("inp-last-name").value
  const email = document.getElementById("inp-email").value
  const password = document.getElementById("inp-password").value

  if (!validateInput(email, password, first_name, last_name)) return

  const submission = { first_name, last_name, email, password }

  const response = await fetch("/api/users/signup", {
    method: "post",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submission)
  })

  const JsonResponse = await response.json();
  if (JsonResponse.error) return InvalidSignupHandler(JsonResponse.error)

  console.log(JsonResponse)
  UserAlert("Signed up successfully", true)
  clearInput()
}

function validateInput(email, password, first_name, last_name) {
  const emailValidationPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (!email.match(emailValidationPattern)) {
    UserAlert("Please enter a valid email")
    return false
  }
  if (!password.length > 8) {
    UserAlert("Please enter a valid email")
    return false
  }

  if (!first_name) {
    UserAlert("Please enter your first name")
    return
  }
  if (!last_name) {
    UserAlert("Please enter your last name")
    return
  }

  return true
}

function InvalidSignupHandler(err) {
  clearInput(all = true)
  UserAlert(err)
}

function clearInput(all = false) {
  if (all) {
    document.getElementById("inp-first-name").value = ""
    document.getElementById("inp-last-name").value = ""
    document.getElementById("inp-email").value = ""
  }

  document.getElementById("inp-password").value = ""
}

main()