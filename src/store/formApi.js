import { createApi } from '@reduxjs/toolkit/query/react';
import axios from 'axios';

// Custom axiosBaseQuery to handle UTF-8 and credentials
const axiosBaseQuery = ({ baseUrl } = { baseUrl: '' }) => async ({ url, method, data, params }) => {
  console.log(`API Request: ${method} ${baseUrl}${url}`, { params, data: data instanceof FormData ? Object.fromEntries(data) : data });
  try {
    const result = await axios({
      url: baseUrl + url,
      method,
      data,
      params,
      headers: { 'Content-Type': data instanceof FormData ? 'multipart/form-data; charset=UTF-8' : 'application/json; charset=UTF-8' },
      withCredentials: true,
      responseType: 'json',
    });
    console.log(`API Response: ${method} ${baseUrl}${url}`, result.data);
    return { data: result.data };
  } catch (axiosError) {
    console.error(`API Error: ${method} ${baseUrl}${url}`, axiosError.response?.data || axiosError.message);
    return {
      error: {
        status: axiosError.response?.status,
        data: axiosError.response?.data || axiosError.message,
      },
    };
  }
};

export const formApi = createApi({
  reducerPath: 'formApi',
  baseQuery: axiosBaseQuery({
    baseUrl: 'http://localhost:5000/api/form',
  }),
  tagTypes: ['Responses'],
  endpoints: (builder) => ({
    submitForm: builder.mutation({
      query: (formData) => {
        const language = formData.get('language');
        const validLanguages = ['en', 'mr'];
        if (!validLanguages.includes(language)) {
          throw new Error('Invalid language. Must be one of: en, mr.');
        }
        return {
          url: '/submit',
          method: 'POST',
          data: formData,
        };
      },
      invalidatesTags: ['Responses'],
    }),
    getResponses: builder.query({
      query: ({ formId, language }) => {
        const validLanguages = ['en', 'mr'];
        if (language && !validLanguages.includes(language)) {
          throw new Error('Invalid language. Must be one of: en, mr.');
        }
        return {
          url: '/responses',
          params: { formId, language },
        };
      },
      providesTags: ['Responses'],
    }),
    deleteResponse: builder.mutation({
      query: (id) => ({
        url: `/response/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Responses'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Responses'],
    }),
    updateResponse: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/response/${id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: ['Responses'],
    }),
  }),
});

export const {
  useSubmitFormMutation,
  useGetResponsesQuery,
  useDeleteResponseMutation,
  useDeleteUserMutation,
  useUpdateResponseMutation,
} = formApi;