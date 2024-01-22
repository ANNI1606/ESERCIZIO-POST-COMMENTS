function getResponse(response) {
  return response.json();
}

function getResult(posts) {
  localStorage.setItem("posts", JSON.stringify(posts));
}

window.onload = function () {
  const posts = !!localStorage.getItem("posts")
    ? JSON.parse(localStorage.getItem("posts"))
    : null;

  fetch("https://jsonplaceholder.typicode.com/posts")
    .then(getResponse)
    .then((data) => {
      console.log("Data from API:", data);
      getResult(data);
      renderPosts(posts);
    })
    .catch((error) => console.error("Error fetching data:", error));

  function renderPosts(posts) {
    for (let i = 0; i < posts.length; i++) {
      //Creazione di un nuovo elemento per ogni post nell'array con un ID
      const post = posts[i];
      const newNode = document.createElement("div");
      newNode.setAttribute("id", `post-item-${post.id}`);
      newNode.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.body}</p>
                <div>
                <input type="text" id="comment-input-${post.id}" placeholder="Inserisci un commento">
                <button id="button-comment-${post.id}" onclick="addComment(${post.id})">Commenta</button>
               </div>
                <button id='button-delete-${post.id}' onclick="deletePost(${post.id})">Elimina Post</button>`;
      document.getElementById("post-list").appendChild(newNode);
    }

    window.addComment = function (postId) {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;
      const commentInput = document.getElementById(`comment-input-${post.id}`);
      const commentText = commentInput.value.trim();

      if (commentText !== "") {
        // Aggiungi il commento al post
        post.comments = post.comments || [];
        post.comments.push(commentText);

        // Aggiorna il local storage
        const updatePosts = [...posts];
        updatePosts[postId] = post;
        localStorage.setItem("posts", JSON.stringify(updatePosts));

        // Visualizza il commento
        const commentNode = document.createElement("div");
        commentNode.innerHTML = `<p><strong>Commento:</strong> ${commentText}</p>`;
        document
          .getElementById(`post-item-${post.id}`)
          .appendChild(commentNode);
        commentInput.value = "";
      }
    };

    window.deletePost = function (postId) {
      //TROVARE L'INDICE DI UN POST NELL'ARRAY IN BASE ALL'ID E POI RIMUOVERLO

      const indexToRemove = posts.findIndex((p) => p.id !== postId);
      if (indexToRemove !== -1) {
        posts.splice(indexToRemove, 1);
      }
      localStorage.setItem("posts", JSON.stringify(posts));

      document.getElementById(`post-item-${postId}`).remove();
    };
  }
};
