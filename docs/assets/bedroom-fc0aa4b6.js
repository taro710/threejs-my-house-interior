import{S as P,P as k,W as z,O as C,V as f,a as D,R as G,T,G as E,D as B,E as m,b as l,M as w,e as g,f as x,g as W,v as A,h as q,j as O,k as X,L as _,n as a,C as F}from"./index-ce4bc38d.js";const S=document.querySelector("canvas.webgl")||void 0,r=new P,n={width:window.innerWidth,height:window.innerHeight},e=new k(45,n.width/n.height,.1,100);e.position.x=-2;e.position.y=6.5;e.position.z=4;r.add(e);const s=new z({canvas:S,antialias:!0});s.setSize(n.width,n.height);s.setPixelRatio(Math.min(window.devicePixelRatio,2));window.addEventListener("resize",()=>{n.width=window.innerWidth,n.height=window.innerHeight,e.aspect=n.width/n.height,e.updateProjectionMatrix(),s.setSize(n.width,n.height),s.setPixelRatio(Math.min(window.devicePixelRatio,2))});s.shadowMap.enabled=!0;const i=new C(e,S);i.enableDamping=!0;i.minDistance=2;i.maxDistance=10;i.addEventListener("change",()=>{const o=e.position.distanceTo(new f(-1.4,.18,.07));e.fov=o*10,e.updateProjectionMatrix()});const h=new D;window.addEventListener("mousemove",o=>{h.x=o.clientX/n.width*2-1,h.y=-(o.clientY/n.height)*2+1});const H=new G,V=new f(10,0,0);V.normalize();const d=document.querySelector(".loading"),b=new _(()=>{a.to(L.uniforms.uAlpha,{duration:1,value:0,delay:.3}),window.innerWidth>768?(e.position.x=-3.07,e.position.y=.93,e.position.z=3.41,a.to(e.position,{duration:1,x:-5,delay:.3}),a.to(e.position,{duration:1,y:2.2,delay:.3}),a.to(e.position,{duration:1,z:4,delay:.3}),i.target.set(-.5,1.2,0)):(e.position.x=-3.07,e.position.y=.93,e.position.z=3.41,a.to(e.position,{duration:1,x:-1,delay:.3}),a.to(e.position,{duration:1,y:3,delay:.3}),a.to(e.position,{duration:1,z:7.2,delay:.3}),i.target.set(-1,1.2,1)),d&&setTimeout(()=>{d.remove()},3e3)},(o,u,t)=>{const R=u/t;d&&(d.innerHTML=`${Math.round(R*100)}%`)}),c=new T(b),I=new E(b).setDRACOLoader(new B().setDecoderPath("draco/")),y=c.load("/threejs-my-house-interior/environment/environment.jpg"),p=c.load("/threejs-my-house-interior/environment/environment2.jpg"),v=c.load("/threejs-my-house-interior/environment/night_skyscraper.jpg");y.mapping=m;y.colorSpace=l;p.mapping=m;p.colorSpace=l;v.mapping=m;v.colorSpace=l;r.background=v;const M=c.load("/threejs-my-house-interior/bedroomBaked.jpg");M.flipY=!1;M.colorSpace=l;const Y=new w({map:M}),$=new g({metalness:0,roughness:0,transmission:.95,opacity:1,ior:1.95,envMap:p}),J=new g({metalness:0,roughness:0,envMapIntensity:1,transmission:.95,transparent:!0,ior:1.75,envMap:y,side:x,color:5592405,opacity:1}),K=new g({metalness:1,roughness:0,envMapIntensity:1,transmission:1,ior:1.75,envMap:p,color:16753920,side:x}),N=new w({color:16702653}),Q=new w({color:16753920}),L=new W({transparent:!0,uniforms:{uAlpha:{value:1}},vertexShader:A,fragmentShader:q});I.load("/threejs-my-house-interior/bedroom.glb",o=>{r.add(o.scene),o.scene.traverse(u=>{const t=u;t.material=(()=>["TableGlass","BottledGlass"].includes(t.name)?$:["BottledLight"].includes(t.name)?N:["XtalMetal"].includes(t.name)?K:["XtalLight"].includes(t.name)?(console.log(t.position),Q):["Xtal"].includes(t.name)?J:Y)()})});const U=new O(2,2,1,1),Z=new X(U,L);r.add(Z);const ee=new F,j=()=>{ee.getElapsedTime(),H.setFromCamera(h,e),i.update(),s.render(r,e),window.requestAnimationFrame(j)};j();
//# sourceMappingURL=bedroom-fc0aa4b6.js.map
