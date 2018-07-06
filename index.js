//统计一个repo的log信息
/***
 * 记录/统计
 * 1. 记录该repo有多少作者
 * 2. 记录每个作者的提交次数
 * 3. 记录每个作者的文件提交量和修改量和删除量
 * 4. 记录每次修改的时间，并根据时间进行统计
 * 5. 数据库: id , repo , author , mode(AMD) , path , operatetime,version,
 ***/
const {exec} = require('child_process');
const iconv = require('iconv-lite');

/***
 * 获得SVN的信息和LOG日志信息
 ***/
class SVNLOG {

	constructor( path ){
		this.path = path;//
		this.cmd= [`svn info ${this.path}`,`svn log ${path} -v`];
	}
	//获得svn信息
	async info (){
		let cmd = this.cmd[0];
		const str = await this.exec(cmd);
		return this.parseSVNINFO(str);
	}
	//获得日志记录
	async getLog(){
		let cmd= this.cmd[1];
		const str = await this.exec(cmd);
		return this.parseSVNLOG(str);
	}

	parseSVNLOG (str){
		const splitLine = '------------------------------------------------------------------------';
		const arr = str.split(splitLine);
		//arr内为单独的commit 
		const data = [];//结果
		arr.forEach(item => { //item 为一个commit
			//对commit进行分解
			let arr = item.split(/\r\n/);
			let author,version,time;
			arr.forEach( line => {//对每一行进行分解
				line = line.trim();
				if(line != ''){//空行跳过
					if(line.match(/^r[\.]*/)){
						let infoArr = line.split('|');
						version = infoArr[0].trim();
						author =infoArr[1].trim();
						let timeStr = infoArr[2].trim();//取值
						let execRs = /^([\d]{4}-[\d]{2}-[\d]{2}[\s]{1}[\d]{2}:[\d]{2}:[\d]{2})[\s\S]*$/.exec(timeStr);
						if(execRs){
							time = execRs[1];
						}
					}else if(line.match(/^[MAD][\.]*/)){
						const record = {mode : null,path: null,author : author,version : version,time : time};
						record.mode = line.split('')[0];
						record.path = line.split('').splice(1).join('').trim();
						data.push(record);
					}
				}
			});
		});
		return data;
	}

	//解析字符串，获得SVN的信息
	parseSVNINFO ( str ){
		const arr = str.split(/\r\n/);
		const repoName = 'Repository Root',idName = 'Repository UUID',versionName = 'Revision';
		const rs = {
			repo : null,
			id : null,
			version : null
		};
		arr.forEach(item => {
			let tempArr = item.split(':');
			let keyName = tempArr[0].trim();
			let keyValue = tempArr.length > 1 ? tempArr.splice(1).join('').trim() : '';
			if(keyName == repoName){
				rs.repo = keyValue;
			}else if(keyName == idName){
				rs.id = keyValue;
			}else if( keyName == versionName){
				rs.version = keyValue;
			}
		});
		return rs;
	}
	//执行cmd命令
	async exec( cmd ){
		const encoding = 'cp936';
		const binaryEncoding = 'binary';
		return await new Promise((resolve,reject) => {
			exec(cmd,{ encoding: binaryEncoding },function(err,stdout,stderr){
				if(err){
					reject(err);
				}else{
					const str = iconv.decode(Buffer.from(stdout,binaryEncoding),encoding);
					resolve(str);
				}
			})
		});
	}
}

module.exports = SVNLOG;