const SVN = require('./svninfo');

const client = new SVN('g:/mygit/byy')

const authors = {

};
client.getLog().then(data => {
	data.forEach( item => {
		// console.log(item);
		const record = authors[item.author] || {total : 0,commits : 0,commitList : {}};
		record.total  += 1;
		if(!record.commitList[item.version]){
			record.commitList[item.version] = true;
			record.commits += 1;
		}
		authors[item.author] = record;
	});
	
}).catch( e => console.log(e))


//数据保存到数据库，如果已经有了，则删除全部重新更新。

//跑一个页面，用来列出SVN repo,针对repo进行统计图展示分析。

