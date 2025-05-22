import axios from 'axios';
import { ProductResponse } from '../types';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';

export const trackProduct = async (url: string): Promise<ProductResponse> => {
  const response = await axios.post(`${API_URL}/products`, { url });
  return response.data;
};

export const getProductData = async (productId: string): Promise<ProductResponse> => {
  const response = await axios.get(`${API_URL}/products/${productId}`);
  return response.data;
};

export const getAllProducts = async (): Promise<ProductResponse[]> => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};