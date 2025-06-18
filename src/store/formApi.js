import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const formApi = createApi({
  reducerPath: 'formApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/form' }),
  tagTypes: ['Responses'],
  endpoints: (builder) => ({
    submitForm: builder.mutation({
      query: (formData) => {
        const validLanguages = ['en', 'mr'];
        if (!validLanguages.includes(formData.get('language'))) {
          throw new Error('Invalid language. Must be one of: en, mr.');
        }
        return {
          url: '/submit',
          method: 'POST',
          body: formData,
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
        body: data,
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
  useUpdateResponseMutation 
} = formApi;