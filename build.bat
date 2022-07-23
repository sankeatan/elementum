echo Starting build...
if not exist build_tmp rmdir build_tmp /s /q
echo Building client...
cd client
call ng build --output-path=../build_tmp/client
cd ..
echo Building server...
cd server
call npx tsc
cd ..
echo Finalizing...
if exist build rmdir build /s /q
move build_tmp build
echo Done.