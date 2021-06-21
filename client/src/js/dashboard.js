function main() {
  const userData = validateUser()
  RenderUserData(userData)

  document.getElementById("btn-dashboard-main-new-post").addEventListener("click", ToggleAddPostPopup)
  document.getElementById("add-post-cancel").addEventListener("click", ToggleAddPostPopup)

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
  if (!(popup.style.left == "25%") || popup.style.left == "-200%") {
    popup.style.left = "25%"
    await setTimeout(() => { popup.style.opacity = "100%" }, 150)
    return
  }
  popup.style.opacity = "0%"
  await setTimeout(() => { popup.style.left = "-200%" }, 150)
}


function GetFieldsFromPopup() {
  const titleBox = document.getElementById("add-post-title")
  const tagsBox = document.getElementById("add-post-tags")

  const title = titleBox.value.trim()
  const tags = tagsBox.value.split(" ")

  if (title.length < 12) return alert("Please enter a title longer than 12 characters")

  if (!tagsBox.value) return { title }
  return { title, tags }
}

async function UploadPost() {
  let { title, tags } = GetFieldsFromPopup()
  if (!tags) tags = []

  const token = localStorage.getItem("user_auth_token")

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
  if (responseJson.error) return alert(responseJson.error)

  const fileForm = GetFilesFromPopup()
  if (!fileForm) return
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

  for (let i in filebox.files)
    form.append("File" + i, filebox.files[i])
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
  if (post.error) return alert(post.error)
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

  console.log(postElement)
  return postElement
}


function CreatePost() {

}

main()