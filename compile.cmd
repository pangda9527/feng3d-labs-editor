cd feng3d
call compile.cmd
cd ..
cd objectView
call tsc
cd ..
call tsc
call tsc -p "configs/jsconfig.json"
echo 编译完成.