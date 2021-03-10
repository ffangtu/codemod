#!/usr/bin/env node --parser=babel|babylon|flow|ts|tsx

const fs = require('fs');
const path = require('path');//解析需要遍历的文件夹
const filePath = path.resolve(__dirname,'./testdir');
const j = require('jscodeshift');
const babelParse = require("@babel/parser");

// 升级对照表
const updateMap = Object.entries(
    {
        "pmserver": "@pms/pmserver",
        "react-current-user": "@pms/react-current-user",
        "react-pm-utils": "@pms/react-utils"
    }
)

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
                            console.log(666666666666)
                            fs.readFile(filedir, 'utf-8', (err, data)=>{
                                let needChange = false
                             /*    const content = babelParse.parse(data,{
                                    sourceType: "module",
                                    plugins: [
                                        // enable jsx and flow syntax
                                        "js",
                                        "jsx",
                                        "flow"
                                      ]
                                })
                                console.log(content) */
                                // console.log(data)
                                const newContent = j(data)
                                .find(j.ImportDeclaration)
                                .forEach(path => {
                                    updateMap.some(item=>{
                                        if(path.value.source.value.indexOf(item[0]) === 0) {
                                            path.value.source.value = item[1];
                                            needChange = true;
                                            return true;
                                        }
                                        return false;
                                    })
                                })
                                .toSource();
                                needChange && fs.writeFile(filedir, newContent, 'utf8', (err) => {
                                    if (err) throw err;
                                    console.log('success done');
                                });
                            })
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
