const API_URL = import.meta.env.VITE_API_URL;

const getAuthData = () => {
  const token = localStorage.getItem("@token");
  const userStorage = localStorage.getItem("@user");
  const user = userStorage ? JSON.parse(userStorage) : null;
  return { token, user };
};

const form = document.getElementById("new-postForm") as HTMLFormElement;

form.addEventListener("submit", async (e: Event) => {
  e.preventDefault();

  const { user, token } = getAuthData();
  const title = (document.getElementById("title") as HTMLInputElement).value;
  const content = (document.getElementById("content") as HTMLInputElement)
    .value;

  try {
    if (!token || !user) {
      alert("Usuário não autenticado");
      return;
    }

    const response = await fetch(`${API_URL}/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        content,
      }),
    });

    if (response.ok) {
      alert("Post criado com sucesso, redirecionando para a página inicial");
      window.location.href = "index.html";
    } else {
      const data = await response.json();
      alert(`Erro: ${data.message || "Verifique os dados"}`);
    }
  } catch (error) {
    console.error(error);
    alert("Erro ao conectar com o servidor");
  }
});
