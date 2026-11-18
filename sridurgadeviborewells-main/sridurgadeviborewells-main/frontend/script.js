async function callAPI() {
  try {
    let res = await fetch("https://sridurgadeviborewells.onrender.com/api/hello");
    let data = await res.json();
    document.getElementById("response").innerText = data.message;
  } catch (err) {
    console.error(err);
  }
}
function getStarted() {
  window.location.href = "login.html";
}


