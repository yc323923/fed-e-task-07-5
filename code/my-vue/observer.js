//负责将data选项中的属性转换为响应式的数据
//若data中的某个属性也是对象，把该对象转换成响应式数据
//数据变化发生通知
class Observer{
    constructor(data){
        this.walk(data)
    }
    walk(data){//遍历data中的所有属性
        //判断是否是对象
        if(!data || typeof data !== "object"){
            return;
        }
        //遍历data对象中的所有属性
        Object.keys(data).forEach(key=>{
            this.defineReactive(data,key,data[key])
        })
    }
    defineReactive(obj,key,val){//将属性变为getter和setter
        this.walk(val);
        let self = this;
        //负责收集依赖
        let dep = new Dep()
        Object.defineProperty(obj,key,{
            enumerable:true,
            configurable:true,
            get(){
                Dep.target && dep.addStub(Dep.target);
                return val
            },
            set(newValue){
                if(newValue=== val) return;
                self.walk(newValue);
                val = newValue;
                
                //发送通知
                dep.notify()
            }
        })
    }
}