import { toast } from "sonner";
import { orpc } from "@/utils/orpc";

/**
 * Hook to fetch the current user's academic profile
 */
export function useProfile() {
	return orpc.profile.profile.useQuery();
}

/**
 * Hook to create a new academic profile
 */
export function useCreateProfile() {
	const utils = orpc.useUtils();

	return orpc.profile.profileCreate.useMutation({
		onSuccess: () => {
			toast.success("Profile created successfully");
			utils.profile.invalidate();
		},
		onError: (error) => {
			toast.error(`Failed to create profile: ${error.message}`);
		},
	});
}

/**
 * Hook to update an existing academic profile
 */
export function useUpdateProfile() {
	const utils = orpc.useUtils();

	return orpc.profile.profileUpdate.useMutation({
		onSuccess: () => {
			toast.success("Profile updated successfully");
			utils.profile.invalidate();
		},
		onError: (error) => {
			toast.error(`Failed to update profile: ${error.message}`);
		},
	});
}
