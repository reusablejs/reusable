## What?!

Reusable is a library for reusing state and business logic between components.

## Should I use this now?

This is a very early stage alpha
If you want to start experimenting with it and share feedback - yes
If you need it for a production app - no

## Why?

Reusable provides a way for app-level state management, with a simple and clean API, inspired and based on React hooks API.

React hooks introduced new ways of thinking about state and side-effects inside components.
Reusable is applying the same principals to app-level state-management by adopting the same API and the same concepts:

- Separation of concerns
- Reusability
- Composability
- Simplicity

While still providing the developers with structure and architecture with large-scale apps in mind.

## Features
- managing shareable state
- handling side effects
- memoization
- reactive (subscription)

## Design guidelines
- immutability
- reusability (duh)
- performance
- predictability
- encapsulation (for shared libraries / lazy loading)
- gradually adoptable

# Documentation
https://reusablejs.github.io/reusable

# Commonly asked questions

## What about Context API?

Using Context API directly, introduces a few challenges. Deciding where in the component tree to put a certain Context is tricky, and also might change while building your app. It forces you to couple the data tree with the component tree, and creates artifically deeply nested component trees.
Reusable tries to solve these issues by decoupling the reusable state from the component tree, and by providing other benefits, such as:
- Time Travelling
- Single Store
- Compound Selectors
- Structure

## Is Reusable designed for large apps?

Reusable is built with large-scale apps in mind.
This affected many of the considerations when designing the solution:

- The benefits of a single store and immutable data
- The ability to do code reuse using custom hooks to prevent code duplication
- Supporting DevTools for better debugging & QA
- Support lazy-loaded modules

# Feedback:

https://goo.gl/forms/Jza0XsM7F3shvWhD2

# What's missing:

- Tests
- DevTools
- Docs
- More Examples
  - lazy-loaded modules example
  - API requests
  - Keyed states
  - 3rd party
- Time Travelling
- TypeScript Support
- Better error messages
