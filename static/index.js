// class a {
//   a
//   constructor() {
//
//     console.log(this.a)
//   }
//
// }
// class cc extends a{
//   constructor() {
//     super()
//   }
//   user(){
//     super.constructor.bind({})
//   }
// }
//
// let bb = new cc();
// console.dir(bb.user())

// class A {
//   name;
//   constructor() {
//     console.log(this.name);
//   }
// }
// let a =new A();
// a.name = 12;
// function aa() {
//  this.name;
//   console.log(this.name)
// }
class aa{
  name;
  constructor() {
    console.log(this)
  }
}
let bb =new aa();
bb.name = 12;
//Object.defineProperty(bb,"constructor")
// bb.constructor=function () {
//   console.log(this.name)
// };
console.log(bb.constructor.toString().match(/;/,""));
// aa.apply({name:222})
 // aa()
