const name1 = 'shiffina, Daniel'
const name2 = 'shifafl, Daniell'
const name3 = 'shquer, Danny'

const reg = /(\w+),\s(\w+)/
console.log(name1.replace(reg,'$2 $1')); //Daniel shiffina

const link1 = '[google](http://google.com)' 
const link2 = '[itp](http://itp.nyu.edu)'
const link3 = '[Coding Rainbow](http://codingrainbow.com)'

const reg2 = /\[(.*?)\]\((http:.*)\)/
console.log(link1.replace(reg2,'$2')); //http://google.com

const str = 'This is is a a dog , I think think this is is really a a good good dog. Don\'t you you thinks so so ?'
const reg3 = /\b(\w+)\s\1\b/

