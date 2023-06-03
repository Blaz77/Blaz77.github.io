export class Geometry 
{
    constructor()
    {
        this.rows = 256;
        this.cols = 256;
        this.webgl_position_buffer = null;
        this.webgl_normal_buffer = null;
        this.webgl_uvs_buffer = null;
        this.webgl_index_buffer = null;
    }

    getPosition(u, v)
    {
        return [u, v, 0];
    }

    getNormal(u, v)
    {
        return [u, v, 0];
    }

    getTextureCoords(u, v)
    {
        return [u, v];
    }

    setupBuffers(gl)
    {
        const positionBuffer = [];
        const normalBuffer = [];
        const uvBuffer = [];

        for (let i=0; i < this.rows; i++)
        {
            for (let j=0; j < this.cols; j++) 
            {
                const u=j/(this.cols-1);
                const v=i/(this.rows-1);

                const pos = this.getPosition(u, v);
                positionBuffer.push(pos[0]);
                positionBuffer.push(pos[1]);
                positionBuffer.push(pos[2]);

                const nrm = this.getNormal(u, v);
                normalBuffer.push(nrm[0]);
                normalBuffer.push(nrm[1]);
                normalBuffer.push(nrm[2]);

                const uvs = this.getTextureCoords(u, v);
                uvBuffer.push(uvs[0]);
                uvBuffer.push(uvs[1]);
            }
        }

        const indexBuffer=[];
        for (let i=0; i < this.rows-1; i++) 
        {
            indexBuffer.push(i*this.cols);
            let j;
            for (j=0; j < this.cols-1; j++) 
            {
                indexBuffer.push((i+1)*this.cols+j);
                indexBuffer.push(i*this.cols+j+1);
            }
            indexBuffer.push((i+1)*this.cols+j);
            indexBuffer.push((i+1)*this.cols+j);
            indexBuffer.push((i+1)*this.cols);
        }
        indexBuffer.pop();
        indexBuffer.pop();

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

        this.webgl_uvs_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_uvs_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvBuffer), gl.STATIC_DRAW);
        this.webgl_uvs_buffer.itemSize = 2;
        this.webgl_uvs_buffer.numItems = uvBuffer.length / 2;

        this.webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);
        this.webgl_index_buffer.itemSize = 1;
        this.webgl_index_buffer.numItems = indexBuffer.length;
    }
}