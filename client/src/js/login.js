

function main() {
  const submitbutton = document.getElementById("btn-login-submit")
  submitbutton.addEventListener("click", SubmitLogin)
}

async function SubmitLogin() {
  const emailValidationPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  const email = document.getElementById("inp-email").value
  const password = document.getElementById("inp-password").value
  if (!email.match(emailValidationPattern)) return InvalidLoginHandler()

  const login = { email: email, password: password }

  const response = await fetch("/api/users/login", {
    method: "post",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(login)
  })

  const JsonResponse = await response.json()
  if (JsonResponse.error) return InvalidResponseHandler(JsonResponse.error)

  localStorage.setItem("user_auth_token", JsonResponse["auth-token"])


  fetch("/dashboard", {
    method: "post",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "user_auth_token": localStorage.getItem("user_auth_token") })
  }).then(r => window.location = r.url).catch(err => console.log(err))
}

function InvalidLoginHandler() {
  const emailbox = document.getElementById("inp-email")
  const pwbox = document.getElementById("inp-password")
  emailbox.value = ""
  pwbox.value = ""
}

function InvalidResponseHandler(err) {
  alert(err);
}

main()