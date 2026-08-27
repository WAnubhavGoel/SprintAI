<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# My Coding Approach

I am a beginner and my main goal is to understand the code.

Write code so that I can read it from top to bottom like I am reading a book.

The code should be easy to follow, easy to modify, and easy to understand later.

## Keep Things Simple

Always prefer the simplest solution that correctly solves the problem.

Do not add code just because it:

* looks more advanced
* follows an advanced design pattern
* might be useful in the future
* makes the code look more like production code

Every piece of code should have a purpose.

If a piece of code does not provide functionality that is required by the problem, do not include it.

## Do Not Over-Engineer

Do not make simple problems complicated.

If a problem can be solved with a simple function, use a simple function.

If a problem can be solved with a few lines of code, do not create several layers of abstractions to solve it.

Avoid unnecessary:

* helper functions
* utility functions
* custom hooks
* classes
* interfaces
* types
* abstractions
* design patterns
* wrappers
* service layers
* repository layers
* factories
* dependency injection
* state management libraries

Only use these when they are actually necessary.

## Functionality Over Complexity

Do not include code purely because it makes the code look advanced.

For example, do not add a complicated abstraction if it does not provide any additional functionality.

Prefer:

```ts
const user = await getUser(id)
```

over creating several functions, classes, or layers that eventually do the same thing.

The goal is not to make the code look sophisticated.

The goal is to make the code work correctly and make it easy for me to understand.

## Read Code Like a Book

Structure code in a logical order so that I can understand what is happening as I read from top to bottom.

Prefer this general flow:

1. Get the required data.
2. Check the required conditions.
3. Perform the main operation.
4. Return the result.

Avoid jumping between many functions and files when it is not necessary.

When possible, keep related logic close together.

## Use Simple TypeScript

Use beginner-friendly TypeScript.

Prefer simple types such as:

```ts
string
number
boolean
```

and simple objects and arrays.

Avoid advanced TypeScript unless it is actually required.

Do not unnecessarily use:

* generics
* complex utility types
* conditional types
* mapped types
* advanced type inference
* complicated interfaces
* complicated type compositions

If a simple type is enough, use the simple type.

## Do Not Invent Requirements

Only implement functionality that I asked for or that is genuinely required for the requested functionality.

Do not add features just because they might be useful in a real application.

Do not automatically add:

* caching
* Redis
* pagination
* filtering
* sorting
* analytics
* logging
* rate limiting
* queues
* background jobs
* retries
* complex validation
* error tracking
* monitoring
* database transactions
* unnecessary permissions
* unnecessary security layers

unless they are required for the functionality being implemented or I explicitly ask for them.

when in option between class based code or factory functions always use factory functions.

## Database

Keep database operations simple and necessary.

Do not create database records unless they are actually required.

Do not create unnecessary:

* database tables
* database models
* relationships
* history records
* audit records
* log records
* duplicate records

If the requested functionality can be completed without creating a database record, do not create one.

## Do Not Add Unnecessary Error Handling

Handle errors that are important for the requested functionality.

Do not surround every piece of code with complicated error-handling systems.

Do not create custom error classes or complicated error-handling abstractions unless they are genuinely necessary.

Keep error handling simple and understandable.

## Do Not Add Unnecessary Validation

Add validation when the application actually needs it.

Do not create a large validation system for a simple piece of functionality.

Use the simplest appropriate validation.

## Next.js

Follow the official Next.js documentation provided in the `next` package.

Before implementing a Next.js feature, read the relevant documentation in:

```text
node_modules/next/dist/docs/
```

The official Next.js documentation takes priority over your training data.

Use the APIs and conventions that match the version of Next.js installed in this project.

Do not use an older Next.js approach simply because it is familiar.

## Server and Client Components

Use Server Components by default when working with the Next.js App Router.

Only use:

```tsx
"use client"
```

when the component actually needs client-side functionality such as:

* `useState`
* `useEffect`
* browser APIs
* event handlers
* other client-only functionality

Do not make a component a Client Component without a reason.

## Better Auth

When working with Better Auth:

* Use the relevant Better Auth skills installed in `.agents/skills/`.
* Follow Better Auth's current best practices and security guidance.
* Do not rely on outdated Better Auth APIs from training data.
* Use the current Better Auth APIs and patterns.
* Keep the implementation simple and beginner-friendly while still following Better Auth's required practices.
* Do not add Better Auth features that I did not request.
* Read the relevant Better Auth skill before implementing Better Auth functionality.

## Preserve Existing Code

When modifying existing code:

* Understand the existing code first.
* Change only what is necessary.
* Do not rewrite unrelated code.
* Do not rename things without a reason.
* Do not restructure the application unnecessarily.
* Reuse existing code when it already solves the problem.

Do not turn a small change into a complete rewrite.

## Comments

Do not add comments for obvious code.

For example, do not write:

```ts
// Get the user
const user = await getUser(id)
```

Add a comment only when the reason for something is not obvious from the code.

Comments should explain **why**, not simply repeat **what** the code does.

## Explanations

When giving me code, briefly explain the important parts.

If you choose a more complicated solution, explain why the simpler solution would not work.

Do not introduce complexity without explaining the reason for it.

## When There Are Multiple Solutions

When multiple solutions are possible, choose the simplest solution that:

1. Works correctly.
2. Follows the current Next.js documentation.
3. Follows the relevant Better Auth guidance when Better Auth is involved.
4. Fits the existing project.
5. Is easy for a beginner to understand.

Do not choose a more complicated solution simply because it is more "advanced."

## Most Important Rule

I am learning to understand how applications are built.

Write code that I can understand while reading it from top to bottom, like reading a book.

I should be able to look at the code and understand:

* what is happening
* why it is happening
* where the data comes from
* what happens next
* where the result goes

Do not optimize the code for looking impressive.

Do not add complexity for the sake of complexity.

Do not write code that exists only to make the implementation look advanced.

**Every piece of code should have a purpose and provide actual functionality.**

When choosing between:

**A. Advanced, clever, abstract code**

and

**B. Simple, direct, easy-to-understand code**

choose **B**, as long as it correctly solves the problem and follows the official Next.js and Better Auth documentation.

The goal is:

**Simple code + correct functionality + current Next.js practices + current Better Auth practices + easy understanding.**
