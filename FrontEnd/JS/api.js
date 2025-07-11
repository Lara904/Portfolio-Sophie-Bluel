export async function fetchWorks() {
  const res = await fetch("http://localhost:5678/api/works");
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch("http://localhost:5678/api/categories");
  return res.json();
}