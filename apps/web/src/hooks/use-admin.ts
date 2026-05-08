import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

export function useAdminSemesters() {
	return useQuery(orpc.admin.semesterList.queryOptions({ input: {} }));
}

export function useAdminCreateSemester() {
	const queryClient = useQueryClient();
	return useMutation(
		orpc.admin.semesterCreate.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.admin.semesterList.queryKey({}),
				});
			},
		})
	);
}

export function useAdminUpdateSemester() {
	const queryClient = useQueryClient();
	return useMutation(
		orpc.admin.semesterUpdate.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.admin.semesterList.queryKey({}),
				});
			},
		})
	);
}

export function useAdminDeleteSemester() {
	const queryClient = useQueryClient();
	return useMutation(
		orpc.admin.semesterDelete.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.admin.semesterList.queryKey({}),
				});
			},
		})
	);
}

export function useAdminSetActiveSemesters() {
	const queryClient = useQueryClient();
	return useMutation(
		orpc.admin.semesterSetActive.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.admin.semesterList.queryKey({}),
				});
			},
		})
	);
}

export function useAdminCreateSubject() {
	const queryClient = useQueryClient();
	return useMutation(
		orpc.admin.subjectCreate.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.admin.semesterList.queryKey({}),
				});
			},
		})
	);
}

export function useAdminUpdateSubject() {
	const queryClient = useQueryClient();
	return useMutation(
		orpc.admin.subjectUpdate.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.admin.semesterList.queryKey({}),
				});
			},
		})
	);
}

export function useAdminDeleteSubject() {
	const queryClient = useQueryClient();
	return useMutation(
		orpc.admin.subjectDelete.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.admin.semesterList.queryKey({}),
				});
			},
		})
	);
}
