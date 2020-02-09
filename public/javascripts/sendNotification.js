var form = document.getElementById("form");
form.addEventListener("submit", e => {
  e.preventDefault();
  var title = document.getElementById("title").value;
  var body = document.getElementById("body").value;

  if (!title) return alert("DEBE INGRESAR UN TÍTULO");
  if (!body) return alert("DEBE INGRESAR UNA DESCRIPTIÓN");

  var opt = confirm("¿DESEA ENVIAR LA NOTIFICACIÓN?");

  if (opt) {
    axios({
      method: "post",
      url: "/api/send",
      data: {
        title,
        body
      }
    })
      .then(() => alert("NOFICIACIÓN ENVIADA."))
      .catch(err => {
        alert("NO SE PUDO ENVIAR LA NOTIFICACIÓN.");
        console.log(err);
      });
  }
});
