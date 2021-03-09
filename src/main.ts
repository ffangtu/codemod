const fs = require('fs');
const path = require('path');//解析需要遍历的文件夹
const babel = require("@babel/core");
const traverse =  require("@babel/traverse").default;
const filePath = path.resolve(__dirname,'./testdir');
const {parse} = require('@babel/parser')
const t = require('@babel/types')
const generator = require('@babel/generator').default



const visitor = {
    ImportDeclaration(path) { 
        console.log( path.node.source)
        path.node.source.value = '23232'
        console.log( path.node.source)
      }
}

//调用文件遍历方法
fileDisplay(filePath);
//文件遍历方法
function fileDisplay(filePath){
    // console.log(filePath)
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath,function(err,files){
        if(err){
            console.warn(err)
        }else{
            //遍历读取到的文件列表
            files.forEach(function(filename){
                //获取当前文件的绝对路径
                const filedir = path.join(filePath, filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(filedir,function(eror, stats){
                    if(eror){
                        console.warn('获取文件stats失败');
                    }else{
                        const isFile = stats.isFile();//是文件
                        const isDir = stats.isDirectory();//是文件夹
                        if(isFile){
                              babel.transformFileAsync(filedir, {
                                filename, ast: true, code: false,
                                plugins: [{
                                    visitor
                                }]
                              }).then(result => {
                                console.log(result.code);
                                // let newContent = JSON.stringify(newList, null, 4);
                               /*  fs.writeFile(filedir, result.code, 'utf8', (err) => {
                                    if (err) throw err;
                                    console.log('success done');
                                }); */
                              });;      
                        }
                        if(isDir){
                            fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                    }
                })
            });
        }
    });
}
