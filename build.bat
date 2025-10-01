@echo off
echo Building FlowVeda Frontend...
cd frontend
call npm install
call npm run build
cd ..
echo Build completed!

