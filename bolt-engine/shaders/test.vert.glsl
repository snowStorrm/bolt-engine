#version 300 es
in vec4 aPosition;
out vec4 vPosition;
void main() {
    vPosition = aPosition;
    gl_Position = aPosition;
}