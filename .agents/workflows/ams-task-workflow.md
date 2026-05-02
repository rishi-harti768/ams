---
description: Workflow to complete a pending task for the academic management system
---

# AMS Task Workflow

This workflow guides the agent to complete a pending task from the academic management system specifications.

## Step 1: Explore the Codebase
- Explore the codebase and get a general understanding of the project structure.
- Understand the technologies, framework, and conventions in use.

## Step 2: Read Specifications
- Carefully read the 3 specification documents located in the @[.kiro/specs/academic-management-system] directory.
- Ensure you understand the requirements, architecture, and business logic described in these specs.

## Step 3: Pick a Pending Task
- Open and read the @[.kiro/specs/academic-management-system/tasks.md] file.
- Identify and pick onenext pending task from the list.

## Step 4: Finish the Task
- Implement the selected task in the codebase.
- Follow all project code standards and use appropriate tools to edit files.

## Step 5: Verify the Work
// turbo
- Run `bun x ultracite check` to ensure code style compliance.
// turbo
- Run `bun x ultracite fix` to fix any linting issues.
- Verify that the changes satisfy the task requirements and do not break the build.

## Step 6: Commit the Changes
// turbo
- Run `git add .` to stage the changes.
// turbo
- Run `git commit -m "<descriptive commit message based on the task>"` to commit the changes.