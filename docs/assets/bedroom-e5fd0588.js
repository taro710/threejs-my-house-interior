import{S as E,P as N,W,O as q,V as T,a as H,R as O,T as I,G as V,D as $,E as f,b as u,M as w,e as K,g as y,U as _,p as L,f as j,A as z,v as U,h as Y,k as M,q as X,r as J,j as Q,L as Z,n as a,C as ee}from"./index-ff9db171.js";var D=`varying vec3 vPosition;
varying vec3 vNormal;

void main() {

    vec4 modelPosition = modelMatrix * vec4(position,1.0);

    
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    
    vPosition = modelPosition.xyz;
    vNormal = modelNormal.xyz;
}`,ne=`uniform float uTime;
uniform vec3 uColor;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    
    vec3 normal = normalize(vNormal);
    if(!gl_FrontFacing) {
        normal *= -1.0;
    }
    
    float stripes = mod((vPosition.y + uTime * 0.08) * 20.0,1.0);
    stripes = pow(stripes, 3.0);

    
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, 2.0);

    
    float falloff = smoothstep(0.8, 0.0, fresnel);

    
    float holographic = stripes * fresnel;
    holographic += fresnel * 1.25;
    holographic *= falloff;

    
    gl_FragColor = vec4(uColor, holographic);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}`,oe=`uniform float uTime;
uniform vec3 uColor;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    
    vec3 normal = normalize(vNormal);
    if(!gl_FrontFacing) {
        normal *= -1.0;
    }

    
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, 1.5);

    
    float falloff = smoothstep(0.8, 0.0, fresnel);

    
    float holographic =  fresnel;
    holographic += fresnel * 1.25;
    holographic *= falloff;

    
    gl_FragColor = vec4(uColor, holographic);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}`;const R=document.querySelector("canvas.webgl")||void 0,i=new E,o={width:window.innerWidth,height:window.innerHeight},e=new N(45,o.width/o.height,.1,100);e.position.x=1;e.position.y=2;e.position.z=4;i.add(e);const s=new W({canvas:R,antialias:!1});s.setSize(o.width,o.height);s.setPixelRatio(Math.min(window.devicePixelRatio,2));window.addEventListener("resize",()=>{o.width=window.innerWidth,o.height=window.innerHeight,e.aspect=o.width/o.height,e.updateProjectionMatrix(),s.setSize(o.width,o.height),s.setPixelRatio(Math.min(window.devicePixelRatio,2))});s.shadowMap.enabled=!0;const r=new q(e,R);r.enableDamping=!0;r.minDistance=2;r.maxDistance=10;r.addEventListener("change",()=>{const n=e.position.distanceTo(new T(-1.4,.18,.07));e.fov=n*10,e.updateProjectionMatrix()});const p=new H;window.addEventListener("mousemove",n=>{p.x=n.clientX/o.width*2-1,p.y=-(n.clientY/o.height)*2+1});const C=new O,te=new T(10,0,0);te.normalize();const m=document.querySelector(".loading"),G=new Z(()=>{a.to(B.uniforms.uAlpha,{duration:1,value:0,delay:.3}),window.innerWidth>768?(a.to(e.position,{duration:1,x:1,delay:.3}),a.to(e.position,{duration:1,y:2.5,delay:.3}),a.to(e.position,{duration:1,z:4.5,delay:.3}),r.target.set(1,2.3,1)):(a.to(e.position,{duration:1,x:-1,delay:.3}),a.to(e.position,{duration:1,y:3,delay:.3}),a.to(e.position,{duration:1,z:7.2,delay:.3}),r.target.set(-1,1.2,1)),m&&setTimeout(()=>{m.remove()},3e3)},(n,d,t)=>{const A=d/t;m&&(m.innerHTML=`${Math.round(A*100)}%`)}),v=new I(G),ae=new V(G).setDRACOLoader(new $().setDecoderPath("draco/")),k=v.load("/threejs-my-house-interior/environment/environment.jpg"),x=v.load("/threejs-my-house-interior/environment/environment2.jpg"),P=v.load("/threejs-my-house-interior/environment/night_skyscraper.jpg");k.mapping=f;k.colorSpace=u;x.mapping=f;x.colorSpace=u;P.mapping=f;P.colorSpace=u;i.background=P;const S=v.load("/threejs-my-house-interior/bedroomBaked.jpg");S.flipY=!1;S.colorSpace=u;const ie=new w({map:S}),re=new K({metalness:0,roughness:0,transmission:.95,opacity:1,ior:1.95,envMap:x}),b=new y({vertexShader:D,fragmentShader:ne,uniforms:{uTime:{value:0},uColor:new _(new L(33023))},side:j,depthWrite:!1,blending:z}),se=new y({vertexShader:D,fragmentShader:oe,uniforms:{uTime:{value:0},uColor:new _(new L(33023))},side:j,depthWrite:!1,blending:z,opacity:.5}),le=new w({color:16702653}),B=new y({transparent:!0,uniforms:{uAlpha:{value:1}},vertexShader:U,fragmentShader:Y});ae.load("/threejs-my-house-interior/bedroom.glb",n=>{i.add(n.scene),n.scene.traverse(d=>{const t=d;t.material=(()=>["TableGlass","BottledGlass"].includes(t.name)?re:["BottledLight"].includes(t.name)?le:["HologramBeam"].includes(t.name)?se:["HologramScreen"].includes(t.name)?b:ie)()})});const l=new M(new X(.15,.07,80),b);l.position.set(2.8,2.4,.5);i.add(l);const c=new M(new J(.021,32,32),new w({color:11250603})),g=c.clone();c.position.set(-.7799419164657593,1.4630173873901366,-.19310614466667175);g.position.set(-.7799419164657593,1.4630173873901366,1.0781683921813965);c.rotation.x=-Math.PI/2;g.rotation.x=-Math.PI/2;i.add(c);i.add(g);const ce=new Q(2,2,1,1),de=new M(ce,B);i.add(de);const me=new ee,h={x:.2,y:.2},F=()=>{const n=me.getElapsedTime();if(b.uniforms.uTime.value=n,l.rotation.x=n*h.x,l.rotation.y=n*h.y,C.setFromCamera(p,e),C.intersectObjects([l]).length)h.y=10;else{const t=a.to(h,{duration:.3,y:.2});if(t.isActive())return;t.play()}c.scale.set(Math.sin(n),Math.sin(n),0),g.scale.set(Math.sin(n),Math.sin(n),0),r.update(),s.render(i,e),window.requestAnimationFrame(F)};F();
//# sourceMappingURL=bedroom-e5fd0588.js.map
