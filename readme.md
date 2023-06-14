# Sample Users Demo

This repo holds a command line demonstration of taking a query, and step by step constructing the optimal compound index for it. We start with range, then equality plus range, and finally arriving at equality, sort and then range.

Along the way we encounter some of the pitfalls with indexing and use explain outputs to show the consequence of ordering compound indexes in the optimal way.

## Purpose

This was created as a way for me to wrap my head around how compound indexes work conceptually before writing the L4 script.

## Usage

1. Run `yarn` to install deps
2. Add your connection string (local or Atlas) to `.env.example` and rename it to `.env`
3. Run `yarn seed` to populate the database
4. Run `yarn start` to start the demo
