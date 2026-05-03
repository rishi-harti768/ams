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
		<div className="fade-in mx-auto max-w-4xl animate-in space-y-8 duration-500">
			<div className="space-y-1">
				<h1 className="font-bold text-3xl tracking-tight">Settings</h1>
				<p className="text-muted-foreground">
					Manage your account and academic preferences.
				</p>
			</div>

			<Tabs className="space-y-6" defaultValue="academic">
				<TabsList className="bg-muted/50 p-1">
					<TabsTrigger className="gap-2" value="academic">
						<GraduationCap className="h-4 w-4" /> Academic Profile
					</TabsTrigger>
					<TabsTrigger className="gap-2" value="account">
						<User className="h-4 w-4" /> Account
					</TabsTrigger>
					<TabsTrigger className="gap-2" value="security">
						<ShieldCheck className="h-4 w-4" /> Security
					</TabsTrigger>
				</TabsList>

				<TabsContent className="space-y-6" value="academic">
					<Card className="border-slate-200/60 shadow-sm">
						<CardHeader className="pb-4">
							<div className="flex items-center gap-2">
								<Settings2 className="h-5 w-5 text-primary" />
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
												institutionName: profile.institutionName,
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
							<User className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-20" />
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
							<ShieldCheck className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-20" />
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
		<div className="mx-auto max-w-4xl space-y-8">
			<div className="space-y-2">
				<Skeleton className="h-10 w-48" />
				<Skeleton className="h-4 w-64" />
			</div>
			<Skeleton className="h-12 w-full max-w-md" />
			<Card>
				<CardHeader>
					<Skeleton className="mb-2 h-8 w-3/4" />
					<Skeleton className="h-4 w-full" />
				</CardHeader>
				<CardContent className="space-y-6">
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-12 w-full" />
				</CardContent>
			</Card>
		</div>
	);
}
