float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

uniform float uTime;
uniform sampler2D uTexture;

varying vec2 vUv;

void main()
{
    //Texture
    vec4 textureColor = texture2D(uTexture, vUv);

    float color = step(0.5, noise(vUv * 50.0));

    gl_FragColor = vec4(vec3(color), 1.0);

}
