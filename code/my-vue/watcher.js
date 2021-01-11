// 当数据变化触发依赖，dep通知所有的Watcher实例更新视图
// 自身实例化的时候往dep对象中添加自己
class Watcher{

    constructor(vm,key,cb){
        this.vm = vm;
        this.key = key;
        //将watcher对象记录到Dep类的静态属性中
        Dep.target = this;
        //回调函数负责更新视图
        this.cb= cb;
        //触发get方法 在get方法中调用addStub
        this.oldValue = this.vm[key];
        Dep.target = null;
    }
    //当数据发生变化的时候 更新视图
    update(){
        let newValue = this.vm[this.key];
        if(this.oldValue === newValue ){
            return;
        }
        this.cb(newValue)
    }
}