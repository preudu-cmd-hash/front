import { createIcons, Trash2, LogOut } from "lucide";

enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  user: User;
}

const API_URL = import.meta.env.VITE_API_URL;

const getAuthData = () => {
  const token = localStorage.getItem("@token");
  const userStorage = localStorage.getItem("@user");
  const user = userStorage ? JSON.parse(userStorage) : null;
  return { token, user };
};

const navArea = document.getElementById("NAValha")!;
const postContainter = document.getElementById("post-container")!;

const setupHeader = () => {
  const { token, user } = getAuthData();
  if (token && user) {
    navArea.innerHTML = /*html*/ `
    <div class="flex items-center gap-4">
      <span class="mr-4 text-blue-300"> Olá, <strong> ${user.name}</strong></span>
      <button id="btnLogout" class="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all"><i data-Lucide="log-out" class="w-5 h-5"></i></button>
    </div>`;

    const logOutBtn = document.getElementById("btnLogout");
    if (logOutBtn) {
      logOutBtn.addEventListener("click", handleLogout);
    }
  } else {
    navArea.innerHTML = /*html*/ `<a href="/login.html" class="bg-black hover:bg-gray-400 text-blue-100 px-4 py-2 rounded">Login</a>`;
  }
};

const handleLogout = () => {
  localStorage.removeItem("@token");
  localStorage.removeItem("@user");

  setupHeader();
  fetchPosts();
};

const fetchPosts = async () => {
  try {
    const response = await fetch(`${API_URL}/api/posts`);
    const posts = (await response.json()) as Post[];

    renderPosts(posts);
  } catch (error) {
    postContainter.innerHTML = /*html*/ `<p class="text-red-300">Erro ao carregar o post</p>`;
  }
};

const renderNewPostButton = () => {
  const { user } = getAuthData();
  const newPostContainer = document.getElementById("btn-container");

  if (!newPostContainer) return;

  if (user) {
    newPostContainer.innerHTML = /*html*/ `
    <a class="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded" href="novoPost.html">Novo post</a>
    `;
  } else {
    newPostContainer.innerHTML = "";
  }
};

const renderPosts = (posts: Post[]) => {
  const { user } = getAuthData();

  postContainter.innerHTML = "";

  posts.forEach((post) => {
    const card = document.createElement("div");
    card.className =
      "bg-gray-600 p-4 rounded shadow flex justify-between items-center";

    const isOwner = user && user.id === post.user.id;
    const isAdmin = user && user.role === UserRole.ADMIN;
    const canDelete = isOwner || isAdmin;

    card.innerHTML = /*html*/ `
    <div>
    <h3 class="font-bold text-lg">${post.title}</h3>
    <p class="text-blue-300">${post.content}</p>
    <span class="text-sm text-blue-400">${post.user.firstName}</span>
    </div>
    <div id="btn-container-${post.id}"></div>
    `;

    if (canDelete) {
      const btn = document.createElement("button");
      btn.className =
        "group p-2 rounded-lg hover:bg-red-100 hover:text-red-600";
      btn.innerHTML = /*html*/ `
      <i data-lucide="trash-2" class="w-5 h-5"></i>
      `;
      btn.addEventListener("click", () => deletePost(post.id));
      card.querySelector(`#btn-container-${post.id}`)?.appendChild(btn);
    }

    postContainter.appendChild(card);
    createIcons({
      icons: {
        Trash2,
        LogOut,
      },
    });
  });
};

const deletePost = async (id: number) => {
  const { token } = getAuthData();

  if (!confirm("Realmente deseja apagar esse post?")) return;

  try {
    const response = await fetch(`${API_URL}/api/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      fetchPosts();
    } else {
      const error = await response.json();
      alert(`Erro: ${error.message || "Sem permissão para deletar."}`);
    }
  } catch (error) {
    alert("Erro de conexão com o servidor.");
  }
};

setupHeader();
renderNewPostButton();
fetchPosts();
