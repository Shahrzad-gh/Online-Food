//offline db
db.enablePersistence().catch((err) => {
  if (err.code === "failled-precondition") {
    //multi tabs open
    console.log("persistence failed");
  } else if (err.code === "unimplemented") {
    //lack of browser support
    console.log("persistence is not available");
  }
});
//realtime
db.collection("recipes").onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change._delegate.type === "added") {
      renderRecipe(change.doc.data(), change.doc.id);
    }
    if (change._delegate.type === "removed") {
      removeRecipe(change.doc.id);
    }
  });
});

//add new recipe
const form = document.querySelector("form");
form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const recipe = {
    title: form.title.value,
    ingredients: form.ingredients.value,
  };

  db.collection("recipes")
    .add(recipe)
    .catch((err) => console.log(err));

  form.title = "";
  form.ingredients = "";
});

//delete recipe

const recipeContainer = document.querySelector(".recipes");
recipeContainer.addEventListener("click", (evt) => {
  if (evt.target.tagName === "I") {
  }
  const id = evt.target.getAttribute("data-id");

  db.collection("recipes").doc(id).delete();
});
