# svnlog
调用本地svn命令行工具，查询并解析SVN仓库的日志信息.


# install 
```
npm install svnlog
```

# usage
```

const SVN = require('svnlog')

//指定svn的本地路径
const client = new SVN('c:/svn/test')

//获得日志信息
client.getLog().then(data => {
	console.log(`data length ${data.length}`)
	/**
	 * data[0] : {author : '',version : '',time : '',mode : '',path : ''}
	 *
	 **/
}).catch( e => console.log(e))

//获得svn信息
client.info().then(function(svn){
	console.log(svn);
	/**
 	 * svn : {
 	 * 	repo : '',
 	 *  id : '',
 	 *  version : ''
 	 * }
 	 *
 	 **/
})

```

# license 
MIT LICENSE