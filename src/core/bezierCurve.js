export class Bezier2Curve
{
    constructor(checkpoints)
    {
        this.resolution = 48;
        this.bases = this.getBases();
        this.checkpoints = checkpoints;
        this.webgl_position_buffer = null;
        this.webgl_normal_buffer = null;
        this.webgl_index_buffer = null;
    }

    getBases()
    {
        return [
            function(u) { return (1-u)*(1-u);}, 	// (1-u)^2
			function(u) { return 2*u*(1-u); },	    // 2*u*(1-u)
			function(u) { return u*u;}			    // u^2
        ]
    }

    getPoint(u)
    {
        const segmentStart = 3 * Math.trunc(u);
        const param = u - Math.trunc(u);
        const p0 = this.checkpoints[segmentStart];
		const p1 = this.checkpoints[segmentStart + 1];
		const p2 = this.checkpoints[segmentStart + 2];

        const x = this.bases[0](param)*p0[0] + this.bases[1](param)*p1[0] + this.bases[2](param)*p2[0];
        const y = this.bases[0](param)*p0[1] + this.bases[1](param)*p1[1] + this.bases[2](param)*p2[1];
        const z = this.bases[0](param)*p0[2] + this.bases[1](param)*p1[2] + this.bases[2](param)*p2[2];

        return [x, y, z];
    }

    setupBuffers(gl)
    {
        const positionBuffer = [];
        const normalBuffer = [];
        const indexBuffer = [];
        const maxSegments = this.checkpoints.length / 3;
        for (let segment=0; segment < maxSegments; segment++)
        {
            for (let i=0; i < this.resolution; i++)
            {
                const step = i/this.resolution + segment;
                positionBuffer.push(...this.getPoint(step));
                normalBuffer.push(...this.getPoint(step));
                indexBuffer.push(i+segment*this.resolution);
            }
        }

        console.log(positionBuffer)
        console.log(indexBuffer)

        this.webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);
        this.webgl_position_buffer.itemSize = 3;
        this.webgl_position_buffer.numItems = positionBuffer.length / 3;

        this.webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);
        this.webgl_normal_buffer.itemSize = 3;
        this.webgl_normal_buffer.numItems = normalBuffer.length / 3;

        this.webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);
        this.webgl_index_buffer.itemSize = 1;
        this.webgl_index_buffer.numItems = indexBuffer.length;
    }

    /**
     * @param {mat4} parentMatrix
     */
    draw(gl, glProgram, parentMatrix)
    {
        //this.updateModelMatrix();
        //const m = mat4.create();
        //mat4.multiply(m, parentMatrix, this.modelMatrix);

        if (true)
        {
            const vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
            gl.enableVertexAttribArray(vertexPositionAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
            gl.vertexAttribPointer(vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

            const vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
            gl.enableVertexAttribArray(vertexNormalAttribute);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
            gl.vertexAttribPointer(vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

            //gl.bindBuffer(gl.ARRAY_BUFFER, this.geometry.webgl_normal_buffer);
            //gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.geometry.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

            //gl.uniform1i(glProgram.useLightingUniform,false);
            //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);

            gl.drawElements(gl.LINE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
            //gl.drawElements(gl.TRIANGLE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
            //gl.drawArrays(gl.LINES, 0,2)

            
        }

        // for (let i=0; i<this.childs.length; i++)
        // {
        //     this.childs[i].draw(m);
        // }
    }
}