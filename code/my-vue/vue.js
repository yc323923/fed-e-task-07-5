class Vue {
    constructor(options){
        //通过数据来保存选项的数据
        this.$options = options || {};
        this.$data = options.data || {};
        this.$el = typeof options.el==='string' ? document.querySelector(options.el) : options.el;
        //将data中的数据转换成getter和setter 注入到vue实例中
        this._proxyData(this.$data);
        //调用observer对象
            //负责将data选项中的属性转换为响应式的数据
            //若data中的某个属性也是对象，把该对象转换成响应式数据
            //数据变化发生通知
        new Observer(this.$data);

        //调用compiler对象 解析指令和差值表达式
        new Compiler(this);
    }
    _proxyData(data){
        // 遍历data中的所有属性，将他们注入到vue实例中以getter和setter的方式
        Object.keys(data).forEach(key=>{
            Object.defineProperty(this, key, {
                enumrable:true,
                configurable:true,
                get(){
                    return data[key]
                },
                set(newValue){
                    if(data[key] === newValue) return
                    data[key] = newValue
                },  
            })
        })
    }
}