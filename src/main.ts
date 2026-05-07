const API_URL = import.meta.env.VITE_API_URL;

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  user: User;
}

const token = localStorage.getItem("@token");
const userStorage = JSON.parse(localStorage.getItem("@user"));
const user = userStorage ?? null;

const navArea = document.getElementById("NAValha")!;
const postContainter = document.getElementById("post-container")!;

const setupHeader = () => {
  if (token && user) {
    navArea.innerHTML = /*html*/ `<span class="mr-4 text-blue-300"> Olá, <strong> ${user.name}</strong></span> <button id="btnLogout" class="text-red-300 hover:text-red-500 hover:underline font-bold">Sair</button>`;
  } else {
    navArea.innerHTML = /*html*/ `<a href="/login.html" class="bg-black hover:bg-gray-400 text-blue-100 px4 py-2 rounded">Login</a>`;
  }
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

const renderPosts = (posts: Post[]) => {
  postContainter.innerHTML = "";

  posts.forEach((post) => {
    const card = document.createElement("div");
    card.className =
      "bg-gray-600 p-4 rounded shadow flex justify-between items-center";

    const isOwner = user && user.id === post.user.id;
    const isAdmin = user && user.role === UserRole.ADMIN;
    const canDelete = isOwner || isOwner;
    const deleteBtn = canDelete ? /*html*/ `
    <button onClick=${deletePost(post.id)} class="group p-2 rounded-lg hover:bg-red-100 hover:test-400"><i data-lucide="trash-2" class="w-5 h-5"></i></button>
    `

    card.innerHTML = /*html*/ `
    <div>
        <h3 class="font-bold text-lg">${post.title}</h3>
        <p class="text-blue-300">${post.content}</p>
        <span class="text-sm text-blue-400">${post.user.firstName}</span>
    </div>
    `;
    postContainter.appendChild(card);
  });
};

setupHeader();
fetchPosts();
