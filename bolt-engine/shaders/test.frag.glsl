#version 300 es
precision highp float;

in vec4 vPosition;
out vec4 glColor;

void main() {
    glColor = vPosition;
}