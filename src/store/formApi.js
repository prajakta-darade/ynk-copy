import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const formApi = createApi({
  reducerPath: 'formApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://192.168.1.66:5000/api/form' }),
  endpoints: (builder) => ({
    submitForm: builder.mutation({
      query: (formData) => ({
        url: '/submit',
        method: 'POST',
        body: formData,
      }),
    }),
    getResponses: builder.query({
      query: ({ formId, language }) => ({
        url: '/responses',
        params: { formId, language },
      }),
    }),
  }),
});

export const { useSubmitFormMutation, useGetResponsesQuery } = formApi;