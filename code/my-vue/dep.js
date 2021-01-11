class Dep {
    constructor(){
     // 存储所有的观察者
     this.subs= [] 
    }

    addStub(sub){
        if(sub && sub.update){
            this.subs.push(sub)
        }
    }

    notify(){
        this.subs.forEach(sub=>sub.update())
    }
}