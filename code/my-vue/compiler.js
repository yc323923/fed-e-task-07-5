//负责编译模板，解析指令/差值表达式
//负责页面的首次渲染
//当数据变化后重新渲染视图
class Compiler{
    constructor(vm){
        this.el = vm.$el;
        this.vm = vm;
        //初次渲染节点
        this.compile(this.el);
    }
    //编译模板 处理文本节点和元素节点
    compile(el){
        let childNodes = el.childNodes;
        Array.from(childNodes).forEach(node=>{
            if(this.isTextNode(node)){
                //处理文本节点
                this.compeileText(node)
            }else if(this.isElementNode(node)){
                //处理元素节点
                this.compileElement(node)
            }
            //深层次遍历当前节点是否还有子节点
            if(node.childNodes && node.childNodes.length){
                this.compile(node)
            }
        })
    }
    //编译元素节点 处理指令
    compileElement(node){
        let attrNames = node.attributes;
        Array.from(attrNames).forEach(attr=>{
            let attrName = attr.name;
            let eventName = null;
            if(this.isDirective(attrName)){
                if(attrName.startsWith("v-on")){
                    eventName =attrName.substr(2).replace(":","").trim(); 
                    attrName = attrName.substr(2,2);
                }else{
                    attrName = attrName.substr(2);
                }
                let key = attr.value;
                this.update(node,key,attrName,eventName)
            }
        })
       
    }

    update(node,key,attrName,eventName){
        let updateFn = this[attrName+"Updater"];
        if(eventName){
            updateFn && updateFn.call(this,node,key,eventName)
        }else{
            updateFn && updateFn.call(this,node,key,this.vm[key])
        }
       
    }

    //处理v-on

    onUpdater(node,key,eventName){
        node[eventName] = this.vm.$options.method[key]
    }

    //处理v-html
    htmlUpdater(node,key,value){
        node.innerHTML = value
        new Watcher(this.vm,key,(newValue)=>{
            node.innerHTML = newValue;
        })
    }

    //处理v-text
    textUpdater(node,key,value){
        node.textContent = value;
        new Watcher(this.vm,key,(newValue)=>{
            node.textContent = newValue;
        })
    }

    //处理v-model
    modelUpdater(node,key,value){
        node.oninput = (v)=>{
            this.vm[key] = node.value
        }
        node.value = value;
        new Watcher(this.vm,key,(newValue)=>{
            node.value = newValue;
        })
    }



    //编译文本节点，处理差值表达式
    compeileText(node){
        //匹配差值表达式使用正则
        let reg = /\{\{(.+?)\}\}/
        let value = node.textContent;
        if(reg.test(value)){
            let key = RegExp.$1.trim();
            // node.textContent = value.replace(reg,this.vm[key])
            node.textContent = this.vm[key];
            new Watcher(this.vm,key,(newValue)=>{
                node.textContent = newValue;
            })
        }
    }
    //判断元素是否是指令
    isDirective(attrName){
        return attrName.startsWith("v-");
    }
    //判断节点是否是文本节点
    isTextNode(node){
        return node.nodeType === 3;
    }
    //判断节点是否是元素节点
    isElementNode(node){
        return node.nodeType === 1;
    }
}