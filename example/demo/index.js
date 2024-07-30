//index未超过8行,没有警告和报错
import {warning} from './warning'
import {test} from './test'
import {list} from './list/list'
const a1=warning; //warning文件超过8行未超过12行只有警告
const a2=test; //test文件超过12行报错(真正报错设置errorStatus:true)
const a3=list;// list文件在忽略目录里,没有警告和报错
