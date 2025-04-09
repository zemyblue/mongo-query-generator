#!/bin/bash

echo "▶️  Starting frontend at http://localhost:5173 ..."
serve -s public -l 5173 &

echo "▶️  Starting backend at http://localhost:3001 ..."
ts-node src/index.ts
