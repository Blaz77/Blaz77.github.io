import { Geometry } from "../core/geometry.js";
import { SceneObject } from "./sceneObject.js";

var vec3=glMatrix.vec3;

export class ExampleObject extends SceneObject
{
    constructor(radius)
    {
        super()
        this.setGeometry(new ExampleGeometry(radius));
    }
}

export class ExampleGeometry extends Geometry
{
    constructor(radius)
    {
        super();
        this.radius = radius;
    }

    getPosition(u, v)
    {
        u = u * Math.PI*2;
        v = (0.1 + v * 0.8) * Math.PI

        return this.getPositionRemapped(u, v);
    }

    getPositionRemapped(u, v)
    {
        const r = this.radius;
        const nx = Math.sin(v)*Math.sin(u);
        const ny = Math.sin(v)*Math.cos(u);
        const nz = Math.cos(v);

        const g = v % 0.5;
        const h = u % 1;
        let f = 1;

        if (g < 0.25) f = 0.95;
        if (h < 0.5) f = f * 0.95;
        
        const x = nx * r * f;
        const y = ny * r * f;
        const z = nz * r * f;

        return [x, y, z];
    }

    getNormal(u, v)
    {
        u = u * Math.PI*2;
        v = (0.1 + v * 0.8) * Math.PI

        const delta = 0.05;
        const p1 = this.getPositionRemapped(u, v);
        const p2 = this.getPositionRemapped(u, v+delta);
        const p3 = this.getPositionRemapped(u+delta, v);

        const v1 = vec3.fromValues(p2[0]-p1[0], p2[1]-p1[1], p2[2]-p1[2]);
        const v2 = vec3.fromValues(p3[0]-p1[0], p3[1]-p1[1], p3[2]-p1[2]);

        vec3.normalize(v1, v1);
        vec3.normalize(v2, v2);
        
        const n=vec3.create();
        vec3.cross(n, v1, v2);
        vec3.scale(n, n, -1);
        return n;
    }
}