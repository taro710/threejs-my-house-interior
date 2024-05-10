import{S as N,P as J,W as K,O as Q,V as D,a as Z,R as ee,T as ne,G as te,D as ie,E as S,b as w,c as G,d as oe,M as P,e as c,f as m,g as b,A as ae,v as se,h as re,i as le,j as E,k as F,B as ce,l as O,m as de,L as me,n as a,o as ue,C as pe}from"./index-ce4bc38d.js";var ve=`uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;

attribute float aScale;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += sin(uTime + modelPosition.x * 100.0) * aScale * 0.2;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
    
    gl_PointSize = uSize * aScale * uPixelRatio;
    gl_PointSize *= (1.0 / - viewPosition.z);
}`,ge=`void main()
{
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = 0.05 / distanceToCenter - 0.1;

    gl_FragColor = vec4(1.0, 1.0, 1.0, strength);
}`,we=`varying vec2 vUv;

void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    vUv = uv;
}`,he=`uniform float uTime;

varying vec2 vUv;

void main()
{
    gl_FragColor = vec4(vUv, abs(sin(uTime)), 0.8);
}`;const W=document.querySelector("canvas.webgl")||void 0,o=new N,i={width:window.innerWidth,height:window.innerHeight},n=new J(45,i.width/i.height,.1,100);n.position.x=-2;n.position.y=6.5;n.position.z=4;o.add(n);const l=new K({canvas:W,antialias:!0});l.setSize(i.width,i.height);l.setPixelRatio(Math.min(window.devicePixelRatio,2));window.addEventListener("resize",()=>{i.width=window.innerWidth,i.height=window.innerHeight,n.aspect=i.width/i.height,n.updateProjectionMatrix(),l.setSize(i.width,i.height),l.setPixelRatio(Math.min(window.devicePixelRatio,2)),L.uniforms.uPixelRatio.value=Math.min(window.devicePixelRatio,2)});l.shadowMap.enabled=!0;const s=new Q(n,W);s.enableDamping=!0;s.minDistance=2;s.maxDistance=10;s.addEventListener("change",()=>{const e=n.position.distanceTo(new D(-1.4,.18,.07));n.fov=e*10,n.updateProjectionMatrix()});const y=new Z;window.addEventListener("mousemove",e=>{y.x=e.clientX/i.width*2-1,y.y=-(e.clientY/i.height)*2+1});const C=new ee,fe=new D(10,0,0);fe.normalize();const p=document.querySelector(".loading"),I=new me(()=>{a.to(U.uniforms.uAlpha,{duration:1,value:0,delay:.3}),window.innerWidth>768?(n.position.x=-3.07,n.position.y=.93,n.position.z=3.41,a.to(n.position,{duration:1,x:-5,delay:.3}),a.to(n.position,{duration:1,y:2.2,delay:.3}),a.to(n.position,{duration:1,z:4,delay:.3}),s.target.set(-.5,1.2,0)):(n.position.x=-3.07,n.position.y=.93,n.position.z=3.41,a.to(n.position,{duration:1,x:-1,delay:.3}),a.to(n.position,{duration:1,y:3,delay:.3}),a.to(n.position,{duration:1,z:7.2,delay:.3}),s.target.set(-1,1.2,1)),p&&setTimeout(()=>{p.remove()},3e3)},(e,d,t)=>{const M=d/t;p&&(p.innerHTML=`${Math.round(M*100)}%`)}),h=new ne(I),Me=new te(I).setDRACOLoader(new ie().setDecoderPath("draco/")),f=h.load("environment/environment.jpg"),u=h.load("environment/environment2.jpg"),R=h.load("environment/night_skyscraper.jpg");f.mapping=S;f.colorSpace=w;u.mapping=S;u.colorSpace=w;R.mapping=S;R.colorSpace=w;o.background=R;const T=h.load("baked.jpg");T.flipY=!1;T.colorSpace=w;const V=new G(16777215,.4),$=new G(16777215,.4),q=new oe(16157471,.5,1);V.position.set(0,4,-2);$.position.set(-4,1,2);q.position.set(-1.112,.81,3.257);o.add(V);o.add($);o.add(q);const ye=new P({map:T}),xe=new c({metalness:0,roughness:0,transmission:.95,opacity:1,ior:1.95,envMap:u}),Se=new c({metalness:0,roughness:0,envMapIntensity:1,transmission:.95,transparent:!0,ior:1.75,envMap:f,side:m,color:5592405,opacity:1}),Pe=new c({metalness:1,roughness:0,envMapIntensity:.9,transmission:.95,opacity:1,ior:1,envMap:f,side:m}),be=new c({metalness:1,roughness:0,envMapIntensity:.9,transmission:.95,opacity:1,ior:1,envMap:u,side:m}),Re=new c({metalness:1,roughness:0,envMapIntensity:1,transmission:1,ior:1.75,envMap:u,color:16753920,side:m}),Te=new c({color:5457689,roughness:.5}),Le=new P({color:16702653}),Ae=new P({color:16753920}),L=new b({uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uSize:{value:100}},vertexShader:ve,fragmentShader:ge,transparent:!0,blending:ae,depthWrite:!1}),H=new b({uniforms:{uTime:{value:0}},vertexShader:we,fragmentShader:he,side:m}),U=new b({transparent:!0,uniforms:{uAlpha:{value:1}},vertexShader:se,fragmentShader:re});let g,x,r;Me.load("myroom.glb",e=>{o.add(e.scene),e.scene.traverse(d=>{const t=d;t.material=(()=>["TVReg","SofaReg","DiningTableReg","StepWire"].includes(t.name)?be:["BarcelonaBack","BarcelonaSeat"].includes(t.name)?Te:["CoffeeTable","BottledGlass","FlowerBottle"].includes(t.name)?xe:["LampBulb","BottledLight"].includes(t.name)?Le:["BarcelonaReg"].includes(t.name)?Pe:["XtalMetal"].includes(t.name)?Re:["XtalLight"].includes(t.name)?(console.log(t.position),Ae):["Xtal"].includes(t.name)?Se:ye)(),x=[e.scene.getObjectByName("AkabekoHead"),e.scene.getObjectByName("AkabekoBody")].filter(M=>M)}),g=new le(e.scene),r=g.clipAction(e.animations[0])});const _=e=>{if(e==="stop"&&!r.isRunning()){r.stop();return}r.isRunning()||(r.loop=ue,r.play())},ke=new E(2,2,1,1),Be=new F(ke,U);o.add(Be);const A=new ce,k=100,v=new Float32Array(k*3),X=new Float32Array(k);for(let e=0;e<k;e++)v[e*3+0]=(Math.random()-.5)*4,v[e*3+1]=Math.random()*1.5,v[e*3+2]=(Math.random()-.5)*4,X[e]=Math.random();A.setAttribute("position",new O(v,3));A.setAttribute("aScale",new O(X,1));const B=new de(A,L);B.position.z=-5;B.position.y=.8;o.add(B);const ze=new E(.82,.48,1,1),z=new F(ze,H);z.position.set(-1.39,.88,-2.59);z.rotateY(.5235988354713379);o.add(z);const Ce=new pe;let j=0;const Y=()=>{const e=Ce.getElapsedTime(),d=e-j;j=e,H.uniforms.uTime.value=e,L.uniforms.uTime.value=e,C.setFromCamera(y,n),x&&(C.intersectObjects(x).length?_("start"):_("stop")),g&&g.update(d),s.update(),l.render(o,n),window.requestAnimationFrame(Y)};Y();
//# sourceMappingURL=main-5e292db0.js.map
