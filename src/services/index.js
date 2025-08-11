import instance from "./instance";

export async function getAllCategories() {
  try {
    const res = await instance.get("/categories");
    return res.data;
  } catch (error) {
    console.error("Kategoriya alınarkən xəta:", error);
    return [];
  }
}

export async function getAllProducts() {
  try {
    const res = await instance.get("/products");
    return res.data;
  } catch (error) {
    console.error("Məhsullar alınarkən xəta:", error);
    return {};
  }
}