uniform float uTime;

varying vec2 vUv;



void main()
{
    gl_FragColor = vec4(vUv, abs(sin(uTime)), 0.8);
}