function main() {
  const userData = validateUser()
  RenderUserData(userData)

  document.getElementById("btn-dashboard-main-new-post").addEventListener("click", ToggleAddPostPopup)
  document.getElementById("add-post-cancel").addEventListener("click", ToggleAddPostPopup)
  document.getElementById("logout-link").addEventListener("click", () => { localStorage.removeItem("user_auth_token") })
  document.getElementById("add-post-submit").addEventListener("click", UploadPost)

}



async function validateUser() {
  if (!localStorage.getItem("user_auth_token")) return window.location = "../"

  const token = localStorage.getItem("user_auth_token")
  const user_id = window.location.href.split("/").pop()

  const response = await fetch("/api/users/me", {
    method: "post",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "user_auth_token": token })
  })

  const userData = await response.json()
  if (userData.error) return alert(userData.error)

  if (userData._id != user_id) return window.location = "/"
  return userData
}

async function ToggleAddPostPopup() {
  const popup = document.getElementById("dashboard-add-post-popup")
  if (!(popup.style.left == "7.5%") || popup.style.left == "-200%") {
    popup.style.left = "7.5%"
    await setTimeout(() => { popup.style.opacity = "100%" }, 150)
    return
  }
  popup.style.opacity = "0%"
  await setTimeout(() => { popup.style.left = "-200%" }, 150)
}


function GetFieldsFromPopup() {
  console.log("in function")
  const titleBox = document.getElementById("add-post-title")
  const tagsBox = document.getElementById("add-post-tags")

  const title = titleBox.value.trim()
  const tags = tagsBox.value.split(" ")

  if (title.length < 12 || !title) {
    UserAlert("Please enter a title longer than 12 characters")
    return
  }

  if (!tagsBox.value) return { title }
  return { title, tags }
}

async function UploadPost() {
  let { title, tags } = GetFieldsFromPopup()
  if (!tags) tags = []


  const token = localStorage.getItem("user_auth_token")
  const fileForm = GetFilesFromPopup()
  if (!fileForm) return UserAlert("Please add some files")

  const reqBody = {
    user_auth_token: token,
    post: { title: title, tags: tags }
  }


  const response = await fetch("/api/posts/upload", {
    method: "post",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reqBody)
  })

  const responseJson = await response.json()
  if (responseJson.error) return UserAlert(responseJson.error)

  const uploadResponse = await fetch("/api/posts/uploadfiles/" + responseJson._id, {
    method: "post",
    mode: "cors",
    body: fileForm
  })
  console.log(await uploadResponse.json())
  window.location.reload()
}

function GetFilesFromPopup() {
  const filebox = document.getElementById("add-post-file")
  if (filebox.files.length < 1) return null
  let form = new FormData()

  for (let i in filebox.files) {
    console.log(filebox.files[i].size)
    if (filebox.files[i].size < 5000000)
      form.append("File" + i, filebox.files[i])
  }
  form.append("user_auth_token", localStorage.getItem("user_auth_token"))
  return form
}

async function RenderUserData(userData) {
  const { email, first_name, last_name, _id: id, posts } = await userData
  console.log({ email, first_name, last_name, id, posts })
  document.getElementById("dashboard-greeting").innerText = `Good morning ${first_name}.`

  for (let i = 0; i < posts.length; i++) AddPostById(posts[i])
}

async function AddPostById(post_id) {
  const response = await fetch("/api/posts/" + post_id)
  const post = await response.json();
  if (post.error) return UserAlert(post.error)
  document.getElementById("post-grid").appendChild(CreatePostElement(post))
}

function CreatePostElement(post) {
  console.log(post)
  const postElement = document.createElement("div")
  postElement.className = "post"
  const title = document.createElement("h3")
  title.innerText = post.title

  const tagContainer = document.createElement("div")
  tagContainer.className = "tag-container"

  for (let i = 0; i < post.tags.length; i++) {
    tagContainer.innerHTML += `<p>${post.tags[i]}</p>`
  }

  postElement.appendChild(title)
  postElement.appendChild(tagContainer)

  for (let i = 0; i < post.files.length; i++)
    postElement.innerHTML += `<h4><a target = "_blank" href ="/api/posts/files/${post._id}/${post.files[i]}">${post.files[i]}</a></h4>`

  const DeleteButton = document.createElement("button")
  DeleteButton.innerText = "Delete"

  // Delete button function
  DeleteButton.addEventListener("click", async () => {
    const response = await fetch("/api/posts/" + post._id, {
      method: "delete",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "user_auth_token": localStorage.getItem("user_auth_token") })
    })
    const responseJson = await response.json()
    if (responseJson.error) {
      UserAlert(responseJson.error)
      return
    }
    UserAlert(responseJson.message)
    window.location.reload()
  })

  postElement.appendChild(DeleteButton)
  return postElement
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

function CreatePost() {
}

main()