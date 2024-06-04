import{S as F,P as A,W as E,O as N,V as P,a as W,R as q,T as H,G as O,D as V,E as g,b as u,M as S,e as $,g as p,U as b,p as C,f as T,A as _,v as I,h as K,k as L,q as U,j as Y,L as X,n as t,C as J}from"./index-a8cfddb9.js";var j=`varying vec3 vPosition;
varying vec3 vNormal;

void main() {

    vec4 modelPosition = modelMatrix * vec4(position,1.0);

    
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    
    vPosition = modelPosition.xyz;
    vNormal = modelNormal.xyz;
}`,Q=`uniform float uTime;
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
}`,Z=`uniform float uTime;
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
}`;const z=document.querySelector("canvas.webgl")||void 0,s=new F,o={width:window.innerWidth,height:window.innerHeight},e=new A(45,o.width/o.height,.1,100);e.position.x=1;e.position.y=2;e.position.z=4;s.add(e);const r=new E({canvas:z,antialias:!1});r.setSize(o.width,o.height);r.setPixelRatio(Math.min(window.devicePixelRatio,2));window.addEventListener("resize",()=>{o.width=window.innerWidth,o.height=window.innerHeight,e.aspect=o.width/o.height,e.updateProjectionMatrix(),r.setSize(o.width,o.height),r.setPixelRatio(Math.min(window.devicePixelRatio,2))});r.shadowMap.enabled=!0;const i=new N(e,z);i.enableDamping=!0;i.minDistance=2;i.maxDistance=10;i.addEventListener("change",()=>{const n=e.position.distanceTo(new P(-1.4,.18,.07));e.fov=n*10,e.updateProjectionMatrix()});const v=new W;window.addEventListener("mousemove",n=>{v.x=n.clientX/o.width*2-1,v.y=-(n.clientY/o.height)*2+1});const x=new q,ee=new P(10,0,0);ee.normalize();const d=document.querySelector(".loading"),D=new X(()=>{t.to(k.uniforms.uAlpha,{duration:1,value:0,delay:.3}),window.innerWidth>768?(t.to(e.position,{duration:1,x:1,delay:.3}),t.to(e.position,{duration:1,y:2.5,delay:.3}),t.to(e.position,{duration:1,z:4.5,delay:.3}),i.target.set(1,2.3,1)):(t.to(e.position,{duration:1,x:-1,delay:.3}),t.to(e.position,{duration:1,y:3,delay:.3}),t.to(e.position,{duration:1,z:7.2,delay:.3}),i.target.set(-1,1.2,1)),d&&setTimeout(()=>{d.remove()},3e3)},(n,c,a)=>{const B=c/a;d&&(d.innerHTML=`${Math.round(B*100)}%`)}),h=new H(D),ne=new O(D).setDRACOLoader(new V().setDecoderPath("draco/")),R=h.load("/threejs-my-house-interior/environment/environment.jpg"),f=h.load("/threejs-my-house-interior/environment/environment2.jpg"),w=h.load("/threejs-my-house-interior/environment/night_skyscraper.jpg");R.mapping=g;R.colorSpace=u;f.mapping=g;f.colorSpace=u;w.mapping=g;w.colorSpace=u;s.background=w;const y=h.load("/threejs-my-house-interior/bedroomBaked.jpg");y.flipY=!1;y.colorSpace=u;const oe=new S({map:y}),ae=new $({metalness:0,roughness:0,transmission:.95,opacity:1,ior:1.95,envMap:f}),M=new p({vertexShader:j,fragmentShader:Q,uniforms:{uTime:{value:0},uColor:new b(new C(33023))},side:T,depthWrite:!1,blending:_}),te=new p({vertexShader:j,fragmentShader:Z,uniforms:{uTime:{value:0},uColor:new b(new C(33023))},side:T,depthWrite:!1,blending:_,opacity:.5}),ie=new S({color:16702653}),k=new p({transparent:!0,uniforms:{uAlpha:{value:1}},vertexShader:I,fragmentShader:K});ne.load("/threejs-my-house-interior/bedroom.glb",n=>{s.add(n.scene),n.scene.traverse(c=>{const a=c;a.material=(()=>["TableGlass","BottledGlass"].includes(a.name)?ae:["BottledLight"].includes(a.name)?ie:["HologramBeam"].includes(a.name)?te:["HologramScreen"].includes(a.name)?M:oe)()})});const l=new L(new U(.15,.07,80),M);l.position.set(2.8,2.4,.5);s.add(l);const re=new Y(2,2,1,1),se=new L(re,k);s.add(se);const le=new J,m={x:.2,y:.2},G=()=>{const n=le.getElapsedTime();if(M.uniforms.uTime.value=n,l.rotation.x=n*m.x,l.rotation.y=n*m.y,x.setFromCamera(v,e),x.intersectObjects([l]).length)m.y=10;else{const a=t.to(m,{duration:.3,y:.2});if(a.isActive())return;a.play()}i.update(),r.render(s,e),window.requestAnimationFrame(G)};G();
//# sourceMappingURL=bedroom-3a991fec.js.map
