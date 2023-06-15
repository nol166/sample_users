# Sample Users Demo

CLI demo that runs a series of queries against a database, creates indexes, shows the explain output and provides context for what is happening and why. It uses the MongoDB Node.js driver and vanilla EJS modules.

## Purpose

This was created as a way for me to wrap my head around compound indexes and see how the order of fields within a compound index has an impact on query performance.

## Usage

1. Run `yarn` to install deps
2. Add your connection string (local or Atlas) to `.env.example` and rename it to `.env`
3. Run `yarn seed` to populate the database
4. Run `yarn start` to start the demo
