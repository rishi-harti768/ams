import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orpc } from "@/utils/orpc";

/**
 * Hook to fetch the current user's academic profile
 */
export function useProfile() {
	return useQuery(orpc.profile.profile.queryOptions({ input: {} }));
}

/**
 * Hook to create a new academic profile
 */
export function useCreateProfile() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.profile.profileCreate.mutationOptions({
			onSuccess: () => {
				toast.success("Profile created successfully");
				queryClient.invalidateQueries({ queryKey: orpc.profile.key() });
				queryClient.resetQueries({ queryKey: orpc.cgpa.key() });
			},
			onError: (error) => {
				toast.error(`Failed to create profile: ${error.message}`);
			},
		})
	);
}

/**
 * Hook to update an existing academic profile
 */
export function useUpdateProfile() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.profile.profileUpdate.mutationOptions({
			onSuccess: () => {
				toast.success("Profile updated successfully");
				queryClient.invalidateQueries({ queryKey: orpc.profile.key() });
				queryClient.resetQueries({ queryKey: orpc.cgpa.key() });
			},
			onError: (error) => {
				toast.error(`Failed to update profile: ${error.message}`);
			},
		})
	);
}
