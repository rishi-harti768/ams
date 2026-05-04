"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@ams/ui/components/card";
import {
	ProfileForm,
	type ProfileFormValues,
} from "@ams/ui/components/profile-form";
import { Skeleton } from "@ams/ui/components/skeleton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCreateProfile, useProfile } from "@/hooks/use-profile";

export default function Onboarding() {
	const router = useRouter();
	const { data: profile, isLoading: isProfileLoading } = useProfile();
	const { mutate: createProfile, isPending: isCreating } = useCreateProfile();

	// If profile already exists, redirect to dashboard
	useEffect(() => {
		if (profile) {
			router.push("/dashboard");
		}
	}, [profile, router]);

	const handleSubmit = (values: ProfileFormValues) => {
		createProfile(values, {
			onSuccess: () => {
				router.push("/dashboard");
			},
		});
	};

	if (isProfileLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center p-4">
				<Card className="w-full max-w-md">
					<CardHeader className="flex flex-col gap-2">
						<Skeleton className="h-8 w-3/4" />
						<Skeleton className="h-4 w-full" />
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-12 w-full" />
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-slate-50/50 p-4">
			<Card className="w-full max-w-md border-slate-200/60 shadow-xl">
				<CardHeader className="flex flex-col gap-1 pb-6">
					<CardTitle className="font-bold text-2xl tracking-tight">
						Welcome to AMS
					</CardTitle>
					<CardDescription className="text-slate-500">
						Let's set up your academic profile to get started.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ProfileForm isLoading={isCreating} onSubmit={handleSubmit} />
				</CardContent>
			</Card>
		</div>
	);
}
