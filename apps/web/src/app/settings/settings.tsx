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
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@ams/ui/components/tabs";
import { GraduationCap, Settings2, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";

export default function Settings() {
	const { data: profile, isLoading } = useProfile();
	const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

	const handleSubmit = (values: ProfileFormValues) => {
		updateProfile(values, {
			onSuccess: () => {
				toast.success("Profile updated successfully");
			},
		});
	};

	if (isLoading) {
		return <SettingsSkeleton />;
	}

	return (
		<div className="fade-in mx-auto flex max-w-4xl animate-in flex-col gap-8 duration-500">
			<div className="flex flex-col gap-1">
				<h1 className="font-bold text-3xl tracking-tight">Settings</h1>
				<p className="text-muted-foreground">
					Manage your account and academic preferences.
				</p>
			</div>

			<Tabs className="flex flex-col gap-6" defaultValue="academic">
				<TabsList className="bg-muted/50 p-1">
					<TabsTrigger className="gap-2" value="academic">
						<GraduationCap data-icon="inline" /> Academic Profile
					</TabsTrigger>
					<TabsTrigger className="gap-2" value="account">
						<User data-icon="inline" /> Account
					</TabsTrigger>
					<TabsTrigger className="gap-2" value="security">
						<ShieldCheck data-icon="inline" /> Security
					</TabsTrigger>
				</TabsList>

				<TabsContent className="flex flex-col gap-6" value="academic">
					<Card className="border-slate-200/60 shadow-sm">
						<CardHeader className="pb-4">
							<div className="flex items-center gap-2">
								<Settings2 className="text-primary" data-icon="inline-start" />
								<CardTitle>Academic Configuration</CardTitle>
							</div>
							<CardDescription>
								Update your institution details and degree targets. These
								settings affect your dashboard projections.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ProfileForm
								initialValues={
									profile
										? {
												institutionType: profile.institutionType as
													| "school"
													| "college",
												institutionName: profile.institutionName ?? undefined,
												currentSemester: profile.currentSemester,
												totalSemesters: profile.totalSemesters,
												targetCumulativeCGPA: Number(
													profile.targetCumulativeCGPA
												),
											}
										: undefined
								}
								isLoading={isUpdating}
								onSubmit={handleSubmit}
							/>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="account">
					<Card className="border-slate-200/60 shadow-sm">
						<CardHeader>
							<CardTitle>Account Information</CardTitle>
							<CardDescription>
								General information about your account.
							</CardDescription>
						</CardHeader>
						<CardContent className="py-20 text-center">
							<User
								className="mx-auto mb-4 text-muted-foreground opacity-20"
								data-icon="inline"
							/>
							<p className="text-muted-foreground">
								Account management features coming soon.
							</p>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="security">
					<Card className="border-slate-200/60 shadow-sm">
						<CardHeader>
							<CardTitle>Security & Privacy</CardTitle>
							<CardDescription>
								Manage your password and session settings.
							</CardDescription>
						</CardHeader>
						<CardContent className="py-20 text-center">
							<ShieldCheck
								className="mx-auto mb-4 text-muted-foreground opacity-20"
								data-icon="inline"
							/>
							<p className="text-muted-foreground">
								Security settings are managed via Better Auth.
							</p>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}

function SettingsSkeleton() {
	return (
		<div className="mx-auto flex max-w-4xl flex-col gap-8">
			<div className="flex flex-col gap-2">
				<Skeleton className="h-10 w-48" />
				<Skeleton className="h-4 w-64" />
			</div>
			<Skeleton className="h-12 w-full max-w-md" />
			<Card>
				<CardHeader>
					<Skeleton className="mb-2 h-8 w-3/4" />
					<Skeleton className="h-4 w-full" />
				</CardHeader>
				<CardContent className="flex flex-col gap-6">
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-12 w-full" />
				</CardContent>
			</Card>
		</div>
	);
}
