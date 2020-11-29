attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform float sizeM;
uniform float sizeN;
uniform float m;
uniform float n;

void main() {

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

    vTextureCoord = vec2((aTextureCoord.x+m)/sizeM,(aTextureCoord.y+n)/sizeN);
}
