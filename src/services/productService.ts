import { api } from "@/lib/api";
import { Product, SearchResponse } from "@/types";

export const productService = {
  // Documentation says AI-Powered Smart Search: GET /products/search?q=query_string
  getAll: async (): Promise<any> => {
    return api.get("/products/search?q=");
  },

  getById: async (id: string): Promise<any> => {
    return api.get(`/products/${id}`);
  },

  search: async (query: string): Promise<any> => {
    return api.get(`/products/search?q=${query}`);
  },
};
