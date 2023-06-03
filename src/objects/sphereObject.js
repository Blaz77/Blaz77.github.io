import { Geometry } from "../core/geometry.js";
import { SceneObject } from "./sceneObject.js";

export class SphereObject extends SceneObject
{
    constructor(radius)
    {
        super()
        this.setGeometry(new SphereGeometry(radius));
    }
}

export class SphereGeometry extends Geometry
{
    constructor(radius)
    {
        super();
        this.radius = radius;
    }

    getPosition(u, v)
    {
        const theta = Math.PI * u;
        const phi = 2 * Math.PI * v;
        const x = this.radius * Math.sin(theta) * Math.cos(phi);
        const y = this.radius * Math.sin(theta) * Math.sin(phi);
        const z = this.radius * Math.cos(theta);
        return [x, y, z];
    }

    getNormal(u, v)
    {
        const theta = Math.PI * u;
        const phi = 2 * Math.PI * v;
        const x = Math.sin(theta) * Math.cos(phi);
        const y = Math.sin(theta) * Math.sin(phi);
        const z = Math.cos(theta);
        return [x, y, z];
    }
}