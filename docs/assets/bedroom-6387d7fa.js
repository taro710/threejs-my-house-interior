import{S as D,P as k,W as R,O as B,V as G,a as E,T as F,G as N,D as W,E as u,b as d,M as w,e as A,g as h,U as y,p as M,f as x,A as P,v as H,h as q,j as O,k as V,L as $,n as i,C as U}from"./index-2e8f07cd.js";var S=`varying vec3 vPosition;
varying vec3 vNormal;

void main() {

    vec4 modelPosition = modelMatrix * vec4(position,1.0);

    
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    
    vPosition = modelPosition.xyz;
    vNormal = modelNormal.xyz;
}`,Y=`uniform float uTime;
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
}`,X=`uniform float uTime;
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
}`;const b=document.querySelector("canvas.webgl")||void 0,s=new D,n={width:window.innerWidth,height:window.innerHeight},e=new k(45,n.width/n.height,.1,100);e.position.x=1;e.position.y=2;e.position.z=4;s.add(e);const r=new R({canvas:b,antialias:!1});r.setSize(n.width,n.height);r.setPixelRatio(Math.min(window.devicePixelRatio,2));window.addEventListener("resize",()=>{n.width=window.innerWidth,n.height=window.innerHeight,e.aspect=n.width/n.height,e.updateProjectionMatrix(),r.setSize(n.width,n.height),r.setPixelRatio(Math.min(window.devicePixelRatio,2))});r.shadowMap.enabled=!0;const t=new B(e,b);t.enableDamping=!0;t.minDistance=2;t.maxDistance=10;t.addEventListener("change",()=>{const o=e.position.distanceTo(new G(-1.4,.18,.07));e.fov=o*10,e.updateProjectionMatrix()});const f=new E;window.addEventListener("mousemove",o=>{f.x=o.clientX/n.width*2-1,f.y=-(o.clientY/n.height)*2+1});const l=document.querySelector(".loading"),C=new $(()=>{i.to(L.uniforms.uAlpha,{duration:1,value:0,delay:.3}),window.innerWidth>768?(i.to(e.position,{duration:1,x:1,delay:.3}),i.to(e.position,{duration:1,y:2.5,delay:.3}),i.to(e.position,{duration:1,z:4.5,delay:.3}),t.target.set(1,2.3,1)):(i.to(e.position,{duration:1,x:-1,delay:.3}),i.to(e.position,{duration:1,y:3,delay:.3}),i.to(e.position,{duration:1,z:7.2,delay:.3}),t.target.set(-1,1.2,1)),l&&setTimeout(()=>{l.remove()},3e3)},(o,m,a)=>{const z=m/a;l&&(l.innerHTML=`${Math.round(z*100)}%`)}),c=new F(C),I=new N(C).setDRACOLoader(new W().setDecoderPath("draco/")),T=c.load("/threejs-my-house-interior/environment/environment.jpg"),v=c.load("/threejs-my-house-interior/environment/environment2.jpg"),g=c.load("/threejs-my-house-interior/environment/night_skyscraper.jpg");T.mapping=u;T.colorSpace=d;v.mapping=u;v.colorSpace=d;g.mapping=u;g.colorSpace=d;s.background=g;const p=c.load("/threejs-my-house-interior/bedroomBaked.jpg");p.flipY=!1;p.colorSpace=d;const J=new w({map:p}),K=new A({metalness:0,roughness:0,transmission:.95,opacity:1,ior:1.95,envMap:v}),_=new h({vertexShader:S,fragmentShader:Y,uniforms:{uTime:{value:0},uColor:new y(new M(33023))},side:x,depthWrite:!1,blending:P}),Q=new h({vertexShader:S,fragmentShader:X,uniforms:{uTime:{value:0},uColor:new y(new M(33023))},side:x,depthWrite:!1,blending:P,opacity:.5}),Z=new w({color:16702653}),L=new h({transparent:!0,uniforms:{uAlpha:{value:1}},vertexShader:H,fragmentShader:q});I.load("/threejs-my-house-interior/bedroom.glb",o=>{s.add(o.scene),o.scene.traverse(m=>{const a=m;a.material=(()=>["TableGlass","BottledGlass"].includes(a.name)?K:["BottledLight"].includes(a.name)?Z:["HologramBeam"].includes(a.name)?Q:["HologramScreen"].includes(a.name)?_:J)()})});const ee=new O(2,2,1,1),ne=new V(ee,L);s.add(ne);const oe=new U,j=()=>{const o=oe.getElapsedTime();_.uniforms.uTime.value=o,t.update(),r.render(s,e),window.requestAnimationFrame(j)};j();
//# sourceMappingURL=bedroom-6387d7fa.js.map
