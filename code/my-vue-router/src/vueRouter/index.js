let _Vue = null;
export default class VueRouter{
    static install(Vue){
        //判断当前插件是否安装
        if(VueRouter.install.installed) return;
        VueRouter.install.installed = true;
        //将vue的构造函数记录到全局中
        _Vue = Vue;
        //把创建vue实例时候传入的router 对象注入到vue实例上
        _Vue.mixin({ //混入
            beforeCreate(){
                if(this.$options.router){
                    _Vue.prototype.$router = this.$options.router;
                    this.$options.router.init();
                }
            }
        })
    }

    constructor(options){
        this.options = options;
        this.routeMap = {};//解析options中的route规则 
        this.data = _Vue.observable({//使用Vue的静态方法observable来创建一个响应式数据
            current:"/"
        }) 
    }

    init(){
        this.creatRouteMap();
        this.initComponents(_Vue);
        this.initEvent();
    }

    creatRouteMap(){//遍历options中的route规则,将其以键值对的方式存储到routeMap中
        this.options.routes.forEach(route=>{
            this.routeMap[route.path] = route.component;
        })
    }

    initComponents(Vue){
        let self = this;
        Vue.component("router-link",{
            props:{
                to:String
            },
            render(h){
                return h('a',{
                    attrs:{
                        href:this.to
                    },
                    on:{
                        click:this.clickHandler
                    }
                },[this.$slots.default])
            },
            methods:{
                clickHandler(e){
                    window.location.hash = this.to
                    // history.pushState({},'',this.to);
                    this.$router.data.current = this.to
                    e.preventDefault();
                }
            }
        })
        Vue.component("router-view",{
            render(h){
                const component = self.routeMap[self.data.current];
                return h(component)
            }
            // template:'<a :href="to"><slot></slot></a>'
        })
    }

    initEvent(){
        window,addEventListener("hashchange",()=>{
            console.log(window.location.hash.substr(1))
             this.data.current = window.location.hash.substr(1);
        })
    }

}