import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

export interface Resume {
  id: number;
  fileName: string;
  fileType: string;
  fileUrl: string;
  uploadedAt: string;
}

async function fetchMyResumes(): Promise<Resume[]> {
  const { data } = await axiosInstance.get<{ data: Resume[] }>('/api/resumes/mine');
  return data.data;
}

export function useMyResumes() {
  return useQuery({
    queryKey: ['my-resumes'],
    queryFn: fetchMyResumes,
  });
}

export function useUploadResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await axiosInstance.post<{ data: Resume }>('/api/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-resumes'] });
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axiosInstance.delete(`/api/resumes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-resumes'] });
    },
  });
}
