import { Geometry } from "../core/geometry.js";

var mat4=glMatrix.mat4;
var vec3=glMatrix.vec3;

export class SceneObject
{
    constructor()
    {
        this.geometry = null;

        this.childs = [];

        this.modelMatrix = mat4.create();

        this.position = vec3.create();
        this.rotation = vec3.create();
        this.scale = vec3.create(1, 1, 1);
    }

    updateModelMatrix()
    {
        mat4.identity(this.modelMatrix);

        const rotQuat = glMatrix.quat.fromEuler(glMatrix.quat.create(), this.rotation);
        mat4.fromRotationTranslationScale(this.modelMatrix, rotQuat, this.position, this.scale)
    }

    /**
     * @param {mat4} parentMatrix
     */
    draw(gl, glProgram, parentMatrix)
    {
        this.updateModelMatrix();
        const m = mat4.create();
        mat4.multiply(m, parentMatrix, this.modelMatrix);

        if (this.geometry)
        {
            const vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
            gl.enableVertexAttribArray(vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.webgl_position_buffer);
            gl.vertexAttribPointer(vertexPositionAttribute, this.geometry.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

            const vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
            gl.enableVertexAttribArray(vertexNormalAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.webgl_normal_buffer);
            gl.vertexAttribPointer(vertexNormalAttribute, this.geometry.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

            //gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.webgl_normal_buffer);
            //gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.geometry.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
            

            // TODO: Implement wire mode
            //gl.uniform1i(shaderProgram.useLightingUniform,(lighting=="true"));
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.geometry.webgl_index_buffer);
            gl.drawElements(gl.TRIANGLE_STRIP, this.geometry.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        }

        for (let i=0; i<this.childs.length; i++)
        {
            this.childs[i].draw(m);
        }
    }

    /**
     * @param {Geometry} geometry
     */
    setGeometry(geometry)
    {
        this.geometry = geometry;
    }

    /**
     * @param {SceneObject} child
     */
    addChild(child)
    {
        this.childs.push(child);
    }
}