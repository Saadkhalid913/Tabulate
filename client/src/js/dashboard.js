function main() {
  validateUser()
}



async function validateUser() {
  if (!localStorage.getItem("user_auth_token")) return window.location = "../"

  const token = localStorage.getItem("user_auth_token")
  const user_id = window.location.href.split("/").pop()

  console.log(user_id);
  console.log(token);

  const response = await fetch("/api/users/me", {
    method: "post",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "user_auth_token": token })
  })

  const userData = await response.json()
  if (userData.error) return alert(userData.error)

  if (userData._id != user_id) return window.location = "/"

  console.log(userData);

}












// function CreatePost(){}

main()