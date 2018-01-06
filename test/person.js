/**
 * Created by wz on 2017/11/25.
 */

class person {

    constructor(name, age){
        this.setAge(age);
        this.setName(name);
    }

    setName(name){
        this.name = name;
    }
    getName(){
        return this.name + ' get';
    }
    setAge(age){
        this.age = age;
    }
    getAge(){
        return this.age+1;
    }

}


let xiaoming = new person('xiaoming', 20);
console.log('. syntax -> name:' + xiaoming.name + ' age: ' + xiaoming.age);
console.log('get set syntax -> name:' + xiaoming.getName() + ' age: ' + xiaoming.getAge());

module.exports = person;