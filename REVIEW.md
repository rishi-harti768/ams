# Codebase Review Report

This report summarizes the review of the codebase against the specified skills: Better Auth, Next.js Best Practices, Next.js Cache Components, shadcn, and Turborepo.

---

## 1. Turborepo Best Practices

### Issue: Incorrect `turbo` command usage in `package.json`
The root `package.json` uses the `turbo <task>` shorthand instead of the recommended `turbo run <task>` for scripted commands.

**File**: `package.json`

```diff
-    "dev": "turbo dev",
-    "build": "turbo build",
-    "check-types": "turbo check-types",
-    "dev:web": "turbo -F web dev",
-    "db:push": "turbo -F @ams/db db:push",
-    "db:studio": "turbo -F @ams/db db:studio",
-    "db:generate": "turbo -F @ams/db db:generate",
-    "db:migrate": "turbo -F @ams/db db:migrate",
+    "dev": "turbo run dev",
+    "build": "turbo run build",
+    "check-types": "turbo run check-types",
+    "dev:web": "turbo run dev --filter web",
+    "db:push": "turbo run db:push --filter @ams/db",
+    "db:studio": "turbo run db:studio --filter @ams/db",
+    "db:generate": "turbo run db:generate --filter @ams/db",
+    "db:migrate": "turbo run db:migrate --filter @ams/db",
```

### Issue: Build outputs missing cache exclusion
Next.js build outputs in `turbo.json` should exclude the `.next/cache` directory to improve caching performance and avoid bloating the cache.

**File**: `turbo.json`

```diff
     "build": {
       "dependsOn": ["^build"],
       "inputs": ["$TURBO_DEFAULT$", ".env*"],
-      "outputs": ["dist/**", ".next/**"]
+      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
     },
```

---

## 2. Next.js Best Practices & Cache Components

### Issue: Cache Components (PPR) not enabled
Next.js 16+ Cache Components and Partial Prerendering (PPR) should be explicitly enabled in `next.config.ts`.

**File**: `apps/web/next.config.ts`

```diff
 const nextConfig: NextConfig = {
 	typedRoutes: true,
 	reactCompiler: true,
+	cacheComponents: true,
 	transpilePackages: [
```

### Issue: Generic Root Metadata
The root layout metadata is currently set to placeholders ("ams").

**File**: `apps/web/src/app/layout.tsx`

```diff
 export const metadata: Metadata = {
-	title: "ams",
-	description: "ams",
+	title: "AMS | Academic Management System",
+	description: "Track your academic performance, CGPA, and semester goals efficiently.",
 };
```

---

## 3. shadcn Best Practices

### Issue: Manual Icon Sizing & Missing `data-icon`
Icons inside components like `Button` and `Badge` have manual `size-*` or `h-*/w-*` classes. According to shadcn guidelines, icons should rely on the component's CSS for sizing and use `data-icon` for positioning.

**Example File**: `apps/web/src/app/semesters/[id]/semester-detail.tsx` (and many others)

```diff
-<Button className="mt-6" nativeButton={false} render={<Link href="/semesters" />} variant="outline">
-    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Semesters
-</Button>
+<Button className="mt-6" nativeButton={false} render={<Link href="/semesters" />} variant="outline">
+    <ArrowLeft data-icon="inline-start" /> Back to Semesters
+</Button>
```

### Issue: Using `space-y-*` instead of `gap-*`
The codebase uses `space-y-*` for layout, which is an anti-pattern in the modern shadcn/ui preset. Use `flex flex-col gap-*` instead.

**Example File**: `apps/web/src/app/semesters/[id]/semester-detail.tsx`

```diff
-		<div className="fade-in animate-in space-y-8 duration-500">
+		<div className="fade-in animate-in flex flex-col gap-8 duration-500">
```

### Issue: Direct use of HTML elements instead of UI components
The codebase uses `<hr />` instead of the `Separator` component.

**File**: `apps/web/src/components/header.tsx`

```diff
-			<hr />
+			<Separator />
```
*(Note: `Separator` component needs to be added to the UI package first)*

---

## 4. Better Auth Best Practices

### Issue: Redundant `secret` and `baseURL` Configuration
Better Auth automatically detects `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` from environment variables. Manually passing them in the config is redundant and potentially error-prone.

**File**: `packages/auth/src/index.ts`

```diff
 		emailAndPassword: {
 			enabled: true,
 		},
-		secret: env.BETTER_AUTH_SECRET,
-		baseURL: env.BETTER_AUTH_URL,
 		plugins: [nextCookies()],
```

### Issue: Missing `/api/auth/ok` verification endpoint
It is recommended to have a health check endpoint for auth.

**Suggested Fix**: Create `apps/web/src/app/api/auth/ok/route.ts`
```tsx
export const GET = () => Response.json({ status: "ok" });
```

---

## 5. Vercel Composition Patterns

### Issue: Boolean Prop Proliferation (`isLoading`)
Components like `ProfileForm`, `SubjectForm`, and `SemesterForm` use a boolean `isLoading` prop to manage internal loading states and button text. According to Vercel composition patterns, behavior should be composed rather than controlled by many boolean props.

**File**: `apps/web/src/components/sign-in-form.tsx`

```diff
-	{({ canSubmit, isSubmitting }) => (
-		<Button
-			className="w-full"
-			disabled={!canSubmit || isSubmitting}
-			type="submit"
-		>
-			{isSubmitting ? "Submitting..." : "Sign In"}
-		</Button>
-	)}
+	{({ canSubmit, isSubmitting }) => (
+		<Button
+			className="w-full"
+			disabled={!canSubmit || isSubmitting}
+			type="submit"
+		>
+			{isSubmitting ? (
+				<>
+					<Spinner data-icon="inline-start" /> Submitting…
+				</>
+			) : (
+				"Sign In"
+			)}
+		</Button>
+	)}
```

---

## 6. Vercel React Best Practices

### Issue: Conditional Rendering with `&&`
The codebase frequently uses the `&&` operator for conditional rendering. Vercel React best practices recommend using the ternary operator for more explicit and safer rendering, especially to avoid accidental rendering of falsy values like `0`.

**File**: `apps/web/src/app/semesters/semester-list.tsx`

```diff
-	{semester.isActive && (
-		<Badge className="border-primary/20 bg-primary/10 text-primary hover:bg-primary/20">
-			Active
-		</Badge>
-	)}
+	{semester.isActive ? (
+		<Badge className="border-primary/20 bg-primary/10 text-primary hover:bg-primary/20">
+			Active
+		</Badge>
+	) : null}
```

---

## 7. Web Interface Guidelines

### Issue: Typography - Ellipsis Anti-pattern
The codebase uses three dots `...` instead of the proper ellipsis character `…`.

**File**: `apps/web/src/components/sign-in-form.tsx`

```diff
-	{isSubmitting ? "Submitting..." : "Sign In"}
+	{isSubmitting ? "Submitting…" : "Sign In"}
```

### Issue: Form Accessibility & Autocomplete
Form inputs are missing critical attributes like `autocomplete` and `spellCheck={false}` for appropriate fields.

**File**: `apps/web/src/components/sign-in-form.tsx`

```diff
 								<Input
 									id={field.name}
 									name={field.name}
+									autocomplete="email"
+									spellCheck={false}
 									onBlur={field.handleBlur}
```

### Issue: Placeholder Style
Placeholders should end with `…` to indicate they are examples or hints.

**File**: `packages/ui/src/components/profile-form.tsx`

```diff
 								onBlur={field.handleBlur}
 								onChange={(e) => field.handleChange(e.target.value)}
-								placeholder="e.g. Stanford University"
+								placeholder="e.g. Stanford University…"
 								value={field.state.value}
```

