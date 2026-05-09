"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@ams/ui/components/card";
import { Skeleton } from "@ams/ui/components/skeleton";
import { GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ProfileForm, type ProfileFormValues } from "@/components/profile-form";
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
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50/50 p-4">
			{/* Decorative Background Elements */}
			<div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />

			<Card className="relative w-full max-w-md border-slate-200/60 shadow-2xl transition-all duration-500 hover:shadow-primary/5">
				<CardHeader className="flex flex-col gap-4 pb-8 text-center">
					<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-8 ring-primary/5">
						<GraduationCap className="h-8 w-8" />
					</div>
					<div className="flex flex-col gap-1">
						<CardTitle className="font-bold text-3xl text-slate-900 tracking-tight">
							Welcome to AMS
						</CardTitle>
						<CardDescription className="text-balance px-4 text-slate-500">
							Let's personalize your experience. Set your graduation goal to
							unlock smart grade projections.
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent>
					<ProfileForm
						isLoading={isCreating}
						key={profile?.id ?? "new"}
						onSubmit={handleSubmit}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
