// Tomy 非常敏感，不喜欢别人碰他的东西。一旦有人碰他就会大喊 Don't Touch Me.。
// 完成 tomy 这个对象，禁止对 tomy 的内容进行修改（增加、修改、删除）。一旦有人对 tomy 进行任何的修改，
// 都用 console.log 打印 Don't Touch Me.。


const Tomy = new Proxy({}, {
    set() {
        console.log('Don\'t Touch Me.');
        return;
    },
    deleteProperty() {
        console.log('Don\'t Touch Me.');
        return;
    },
    defineProperty() {
        console.log('Don\'t Touch Me.');
        return;
    }
})
Tomy.name = 'hhh'

// Tomy.deleteProperty(name)