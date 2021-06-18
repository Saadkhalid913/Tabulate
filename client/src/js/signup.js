function main() {
  const signupbutton = document.getElementById("btn-signup-submit").addEventListener("click", submitSignup)
}

async function submitSignup() {
  const first_name = document.getElementById("inp-first-name").value
  const last_name = document.getElementById("inp-last-name").value
  const email = document.getElementById("inp-email").value
  const password = document.getElementById("inp-password").value

  if (!validateInput(email, password)) return
  const submission = { first_name, last_name, email, password }
  console.log(submission)
  const response = await fetch("/api/users/signup", {
    method: "post",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submission)
  })

  const JsonResponse = await response.json();
  console.log(JsonResponse)
  if (JsonResponse.error) return InvalidSignupHandler(JsonResponse.error)

  clearInput()
}

function validateInput(email, password) {
  const emailValidationPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (!email.match(emailValidationPattern)) return false
  return true
}

function InvalidSignupHandler(err) {
  clearInput(all = true)
  alert(err);
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